from flask import Flask,request,make_response, Response
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
from flask_restful import Api,Resource
from app import app,db,api,ma
from sqlalchemy import func, desc
from datetime import datetime
import csv
import io
from models import Attendance,User,Student
from flask_jwt_extended import jwt_required, get_jwt_identity
import json






migrate = Migrate(app,db)

class AttendanceSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Attendance
        load_instance =True

    id = ma.auto_field() 
    class_id = ma.auto_field()
    student_id = ma.auto_field()
    educator_id = ma.auto_field()
    date =ma.auto_field()
    status = ma.auto_field()
    student_name = ma.Method("get_student_name")
    educator_name = ma.Method("get_educator_name")
    class_name = ma.Method("get_class_name")

    def get_student_name(self, obj):
        return obj.student.full_name if obj.student else None
    
    def get_educator_name(self, obj):
        return obj.educator.full_name if obj.educator else None

    def get_class_name(self, obj):
        return obj.class_.name if obj.class_ else None



    url = ma.Hyperlinks(
        {
            "self":ma.URLFor("attendance_detail", values= dict(id="<id>")),
            "collection":ma.URLFor("attendances_list"),
        }
    )

attendance_schema = AttendanceSchema()
attendances_schema = AttendanceSchema(many=True)



class Index(Resource):
    def get(self):
        response_dict = {
            "index":"Bruh BRuh karibuu sanaaaaaa hahahahah just kidding , btw restful api za attendance ndio hizii colleague"

        }

        response = make_response(
            response_dict,
            200,
        )
        return response
    


class Attendances(Resource):
    def get(self):

        try:
            class_id = request.args.get("class_id", type=int)
            student_id = request.args.get("student_id", type=int)
            status = request.args.get("status")
            date = request.args.get("date")
            date_from = request.args.get("date_from")
            date_to = request.args.get("date_to")
            distinct = request.args.get("distinct", "false").lower() == "true"
            export = request.args.get("export", "false").lower() == "true"
      

            query = Attendance.query.options(
                db.joinedload(Attendance.student)
            )
            

            if class_id:
                query = query.filter_by(class_id=class_id)
            if student_id:
                query = query.filter_by(student_id=student_id)
            if status:
                query = query.filter_by(status=status)
            if date:
                query = query.filter_by(date=date)
            if date_from:
                query= query.filter(Attendance.date>=date_from)
            if date_to:
                query = query.filter(Attendance.date <= date_to)

            if distinct:
                subquery = (
                    db.session.query(
                        Attendance.student_id,
                        func.max(Attendance.date).label("max_date")
                    )
                    .group_by(Attendance.student_id)
                    .subquery()
                )

                query = (
                    query.join(subquery, (Attendance.student_id == subquery.c.student_id)
                               & (Attendance.date == subquery.c.max_date))
                )
            
            


            order_by = request.args.get("order_by", "date")
            order_dir = request.args.get("order_dir", "desc")

            if order_by == "date":
                query = query.order_by(Attendance.date.desc() if order_dir=="desc" else Attendance.date.asc())
            elif order_by == "student_name":
                query = query.join(User, Attendance.student_id == User.id).options(
                    db.joinedload(Attendance.student)
                ).order_by(User.full_name.asc() if order_dir == "asc" else User.full_name.desc())

            page = request.args.get("page", 1, type=int)
            per_page = request.args.get("per_page", 30, type=int)
            pagination = query.paginate(page=page, per_page=per_page, error_out=False)
            

            attendances = pagination.items
            if not attendances:
                return make_response({"message": "No attendance records found"}, 404)
            

            if export:
                all_attendances = query.all()
                output = io.StringIO()
                writer = csv.writer(output)
                writer.writerow(["ID", "Class", "Student", "Educator", "Date", "Status", "Student Name"])
                for a in all_attendances:
                    writer.writerow([
                        a.id, a.class_id, a.student_id,a.educator_id, a.date,a.status,
                        a.student.user.full_name if a.student and a.student.user else ""

                    ])
                res = Response(output.getvalue(), mimetype="text/csv")
                res.headers.set("Content-Disposition", "attachment", filename="attendance.csv")
                return res


            response = {
                "data":attendances_schema.dump(attendances),
                "total": pagination.total,
                "page": pagination.page,
                "per_page": pagination.per_page,
                "pages": pagination.pages,
                
            }
            
            return make_response(response, 200)
        except Exception as e:
            return make_response({"error": str(e)}, 500)
    
        
    @jwt_required()
    def post(self):
        current_user=json.loads(get_jwt_identity())
        if current_user["role"] not in ["owner", "educator"]:
            return {"error": "unauthorised"}, 403
        
        data = request.get_json()

        class_id =data.get("class_id")
        educator_id = current_user["id"]
        date_str = data.get("date")
        records = data.get("records")

        if not class_id or not date_str or not records:
            return {"error": "Missing class_id, date, or records"}, 400
        
        try:
            date= datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return {"error":" Invalid date formart, expected YYYY-MM-DD"}, 400
        
        created = 0
        updated = 0

        for record in records:
            student_id = record.get("student_id")
            status = record.get("status")

            if not student_id or status not in ["present", "absent", "late"]:
                continue


            existing = Attendance.query.filter_by(
                class_id=class_id,
                student_id=student_id,
                date=date,
            ).first()

            if existing:
                existing.status=status
                existing.educator_id=educator_id
                updated +=1

            else:
                new_record = Attendance(
                    class_id=class_id,
                    student_id=student_id,
                    educator_id=educator_id,
                    date=date,
                    status=status,
                )

                db.session.add(new_record)
                created +=1

        db.session.commit()
        return {
            "message": "Attendance records processed",
            "created": created,
            "updated": updated
        }, 201
    

#        try:
#             data = request.get_json()
#             new_attendance = Attendance(
                
#                 class_id = data["class_id"],
#                 student_id = data["student_id"],
#                 educator_id = data["educator_id"],
#                 status = data["status"]

#             )
#             db.session.add(new_attendance)
#             db.session.commit()

#             response = make_response(
#                 attendance_schema.dump(new_attendance),
#                 201,
#             )
#             return response
#         except KeyError as e:
#             return make_response({"error": f"Missing field: {str(e)}"}, 400)
#         except Exception as e:
#             return make_response({"error": str(e)}, 500)
            
# #api.add_resource(Attendances, "/attendances")

class AttendanceById(Resource):
    @jwt_required()
    def get(self,id):
        current_user=json.loads(get_jwt_identity())
        if current_user["role"] not in ["owner", "educator"]:
            return {"error": "unauthorised"}, 403
        
        attendance = Attendance.query.options(
            db.joinedload(Attendance.student)
        ).filter(Attendance.id==id).first()
        if not attendance:
            return make_response({"error":"Attendance record not found"}, 404)
        response = make_response(
            attendance_schema.dump(attendance),
            200,
        )
        return response
    
    @jwt_required()
    def patch(self,id):
        current_user=json.loads(get_jwt_identity())
        if current_user["role"] not in ["owner", "educator"]:
            return {"error": "unauthorised"}, 403
        
        data = request.get_json()
        patch_attendance = Attendance.query.options(
            db.joinedload(Attendance.student)
        ).filter(Attendance.id==id).first()
        if not patch_attendance:
            return make_response({"error": "Attendance record not found"},404)
        for attr, value in data.items():
            setattr(patch_attendance,attr, value)
        db.session.add(patch_attendance)
        db.session.commit()

        response = make_response(
            attendance_schema.dump(patch_attendance),
            200,
        )
        return response
    @jwt_required()
    def delete(self,id):
        current_user=json.loads(get_jwt_identity())
        if current_user["role"] not in ["owner", "educator"]:
            return {"error": "unauthorised"}, 403
        record = Attendance.query.filter(Attendance.id==id).first()
        if not record:
            return make_response({"error": "Attendance record not found"}, 404)

        db.session.delete(record)
        db.session.commit()

        response_dict ={"message":"attendace record deleted successfulyy"}
        response = make_response(
            response_dict,
            200
        )
        return response
    


