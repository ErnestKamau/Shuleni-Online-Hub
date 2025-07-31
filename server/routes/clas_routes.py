from flask import Flask,request,make_response, Response, jsonify
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
from flask_restful import Api,Resource
from app import app,db,api,ma
from sqlalchemy import func, desc
import csv
import io
from models import Class,User, ClassMember,Student, Assessment, Resources, Submission
from flask_jwt_extended import jwt_required, get_jwt_identity
import json
from datetime import datetime, timezone
import os

migrate = Migrate(app,db)

class ClassSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Class
        load_instance =True

    id = ma.auto_field()
    name = ma.auto_field()
    school_id = ma.auto_field()
    created_by = ma.auto_field()
    created_at = ma.auto_field()


    url = ma.Hyperlinks(
        {
            "self": ma.URLFor("class_detail", values=dict(id="<id>")),
            "collection": ma.URLFor("class_list"),
        }
    )

class_schema = ClassSchema()
classes_schema= ClassSchema(many=True)


class ResourceSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Resources
        load_instance = True

    id = ma.auto_field()
    title = ma.auto_field()
    description = ma.auto_field()
    type = ma.auto_field()
    file_url = ma.auto_field()
    uploaded_by = ma.auto_field()
    class_id = ma.auto_field()
    created_at = ma.auto_field()

resource_schema = ResourceSchema()
resources_schema = ResourceSchema(many=True)

class AssessmentSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Assessment
        load_instance = True

    id = ma.auto_field()
    title = ma.auto_field()
    description = ma.auto_field()
    type = ma.auto_field()
    class_id = ma.auto_field()
    created_by = ma.auto_field()
    duration_minutes = ma.auto_field()
    start_time = ma.auto_field()
    questions = ma.auto_field()
    created_at = ma.auto_field()

assessment_schema = AssessmentSchema()
assessments_schema = AssessmentSchema(many=True)

class SubmissionSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Submission
        load_instance = True

    id = ma.auto_field()
    answers = ma.auto_field()
    student_id = ma.auto_field()
    assessment_id = ma.auto_field()
    submitted_at = ma.auto_field()
    score = ma.auto_field()
    graded_by = ma.auto_field()
    remarks = ma.auto_field()


submission_schema = SubmissionSchema()
submissions_schema = SubmissionSchema(many=True)


class Index2(Resource):
    def get(self):
        response_dict = {
            "index":"welcome to class api"
        }

        response = make_response(
            response_dict,
            200
        )
        return response
    
api.add_resource(Index2, "/another")

class ClassList(Resource):
    @jwt_required()
    def get(self):
        current_user = json.loads(get_jwt_identity())
        if current_user["role"] not in ["owner", "educator"]:
            return {"error": "unauthorised"}, 403
        try:
            query =Class.query

            school_id = request.args.get("school_id", type=int)
            total_students = None
            if school_id:
                query = query.filter_by(school_id=school_id)
                total_students = db.session.query(Student).join(Class).filter(Class.school_id == school_id).count()

            created_by = request.args.get("created_by", type=int)
            if created_by:
                query = query.filter_by(created_by=created_by)

            class_name = request.args.get("name")
            if class_name:
                query = query.filter(Class.name.ilike(f"%{class_name}%"))

            results = query.all()

            response_data = {
                "classes": classes_schema.dump(results),
                "total_students": total_students
            }
            response = make_response(response_data, 200)
            return response



        except Exception as e:
            return make_response({"error":str(e)}, 500)
        
    @jwt_required()
    def post(self):
        current_user = json.loads(get_jwt_identity())
        if current_user["role"] not in ["owner", "educator"]:
            return {"error": "unauthorised"}, 403
        try:

            data =request.get_json()
            if not data.get('name'):
                return {"error": "Class name is required"}, 400
            
            
            existing_class = Class.query.filter_by(name=data['name'], school_id=data["school_id"]).first()
            if existing_class:
                return {"error": f"{data['name']} already exists in this school"}, 409
            
        
            new_class = Class(
                name = data["name"],
                school_id = data["school_id"],
                created_by = current_user["id"],
                created_at=datetime.now(timezone.utc)
            )
            db.session.add(new_class)
            db.session.commit()
            response = make_response(
                class_schema.dump(new_class),
                201,
            )
            return response
        except KeyError as e:
            return make_response({"error": f"Missing field:{str(e)}"}, 400)
        except Exception as e:
            return make_response({"error":str(e)},500)

        
api.add_resource(ClassList,"/classes")


class ClassById(Resource):
    @jwt_required()
    def get(self,id):
        current_user = json.loads(get_jwt_identity())
        if current_user["role"] not in ["owner", "educator"]:
            return {"error": "unauthorised"}, 403
        clas = Class.query.filter(Class.id==id).first()
        if not clas:
            return make_response({"error":"Classs record not found"},404)
        response = make_response(
            class_schema.dump(clas),
            200,
        )
        return response
    @jwt_required()
    def patch(self,id):
        current_user = json.loads(get_jwt_identity())
        if current_user["role"] not in ["owner", "educator"]:
            return {"error": "unauthorised"}, 403
        
        data=request.get_json()
        patch_class = Class.query.filter(Class.id==id).first()
        if not patch_class:
            return make_response({"error":"Class record not found"},404)
        for attr,value in data.items():
            setattr(patch_class, attr,value)
        db.session.add(patch_class)
        db.session.commit()

        response= make_response(
            class_schema.dump(patch_class),
            200,
        )
        return response
    @jwt_required()
    def delete(self,id):
        record = Class.query.filter(Class.id==id).first()
        if not record:
            return make_response({"error":"Class record not found"})
        db.session.delete(record)
        db.session.commit()

        response_dict= {"message":"class record has een deleted succesfully"}
        response= make_response(
            response_dict,
            200
        )
        return response
    
api.add_resource(ClassById, "/classes/<int:id>")

class ClassResources(Resource):
    @jwt_required()
    def get(self, class_id):
        resources = Resources.query.filter_by(class_id=class_id).all()
        return make_response({"resources": resources_schema.dump(resources)}, 200)

    @jwt_required()
    def post(self, class_id):
        current_user = json.loads(get_jwt_identity())
        user = User.query.get(current_user['id'])
        if not user or user.role not in ['owner', 'educator']:
            return {"error": "Unauthorized"}, 403

        title = request.form.get('title')
        file = request.files.get('file')
        if not title or not file:
            return {"error": "Title and file required"}, 400
        

        filename = f"{datetime.now(timezone.utc).timestamp()}_{file.filename}"
        upload_dir = "uploads"
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)
        filepath = os.path.join(upload_dir, filename)
        file.save(filepath)
        file_url = f"/uploads/{filename}"
        
        resource = Resources(
            title=title,
            description=request.form.get('description', ''),
            type='files',
            file_url=file_url,
            uploaded_by=user.id,
            class_id=class_id,
            created_at=datetime.now(timezone.utc)
        )
        db.session.add(resource)
        db.session.commit()
        return make_response({"message": "Resource uploaded", "resource": resource_schema.dump(resource)}, 201)

class ClassAssessments(Resource):
    @jwt_required()
    def get(self, class_id):
        assessments = Assessment.query.filter_by(class_id=class_id).all()
        return make_response({"assessments": assessments_schema.dump(assessments)}, 200)

    @jwt_required()
    def post(self, class_id):
        current_user = json.loads(get_jwt_identity())
        user = User.query.get(current_user['id'])
        if not user or user.role not in ['owner', 'educator']:
            return {"error": "Unauthorized"}, 403

        data = request.get_json()
        title = data.get('title')
        type_ = data.get('type')
        questions_input = data.get('questions')
        if not title or not type_ or not questions_input:
            return {"error": "Title, type, and questions required"}, 400

        
        questions = parse_questions(questions_input)

        assessment = Assessment(
            title=title,
            description=data.get('description', ''),
            type=type_,
            class_id=class_id,
            created_by=user.id,
            questions=questions,
            created_at=datetime.now(timezone.utc)
        )
        db.session.add(assessment)
        db.session.commit()
        return make_response({"message": "Assessment created", "assessment": assessment_schema.dump(assessment)}, 201)

def parse_questions(questions_input):
    """
    Accepts either a JSON string/array or plain text (one question per line).
    Returns a list of question dicts.
    """
    if isinstance(questions_input, list):
        return questions_input
    
    if isinstance(questions_input, str):
        
        try:
            parsed = json.loads(questions_input)
            if isinstance(parsed, list):
                return parsed
        except Exception:
            pass
        lines = [q.strip() for q in questions_input.split('\n') if q.strip()]
        return [{"question": line} for line in lines]
    return []

# class AssessmentSubmissions(Resource):
#     @jwt_required()
#     def get(self, class_id, assessment_id):
#         try:
            
#             submissions = Submission.query.filter_by(assessment_id=assessment_id).all()
#             return make_response({"submissions": submissions_schema.dump(submissions)}, 200)
#         except Exception as e:
#             return make_response({"error": str(e)}, 500)

#     @jwt_required()
#     def post(self, class_id, assessment_id):
#         current_user = json.loads(get_jwt_identity())
#         try:
#             data = request.get_json()
#             answers = data.get("answers")

#             if not answers:
#                 return make_response({"error": "Submission answers are required"}, 400)

        
#             assessment = Assessment.query.filter_by(id=assessment_id, class_id=class_id).first()
#             if not assessment:
#                 return {"error": "Assessment not found in this class"}, 404

#             new_submission = Submission(
#                 answers=answers,
#                 student_id=current_user["id"],
#                 assessment_id=assessment_id,
#                 submitted_at=datetime.now(timezone.utc)
#             )

#             db.session.add(new_submission)
#             db.session.commit()

#             return make_response(submission_schema.dump(new_submission), 201)

#         except Exception as e:
#             return make_response({"error": "Submission failed", "details": str(e)}, 500)

class SubmissionByID(Resource):
    @jwt_required()
    def get(self, id):
        try:
            submission = Submission.query.get_or_404(id)
            return make_response(submission_schema.dump(submission), 200)
        except Exception as e:
            return make_response({"error": str(e)}, 500)

    @jwt_required()
    def patch(self, id):
        current_user = json.loads(get_jwt_identity())
        try:
            submission = Submission.query.get_or_404(id)
            data = request.get_json()

            
            submission.score = data.get("score", submission.score)
            submission.remarks = data.get("remarks", submission.remarks)
            submission.graded_by = current_user["id"]

            db.session.commit()
            return make_response(submission_schema.dump(submission), 200)

        except Exception as e:
            return make_response({"error": str(e)}, 500)
        
    @jwt_required()
    def delete(self, id):
        try:
            submission = Submission.query.get_or_404(id)
            db.session.delete(submission)
            db.session.commit()
            return make_response({"message": "Submission deleted"}, 200)
        except Exception as e:
            return make_response({"error": str(e)}, 500)
