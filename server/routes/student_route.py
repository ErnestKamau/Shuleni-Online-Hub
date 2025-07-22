
from flask_restful import Resource
from flask import request
from flask_marshmallow import Marshmallow
from marshmallow_sqlalchemy import auto_field
from models.student import Student, db

ma = Marshmallow()

class StudentSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Student
        load_instance = True

    id = auto_field()
    user_id = auto_field()
    school_id = auto_field()
    admission_number = auto_field()
    grade = auto_field()
    class_id = auto_field()
    created_at = auto_field()

student_schema  = StudentSchema()
students_schema = StudentSchema(many=True)

class StudentListResource(Resource):
    def get(self):
        students = Student.query.all()
        return students_schema.dump(students), 200


class StudentResource(Resource):
    def get(self, student_id):
        student = Student.query.get_or_404(student_id)
        return student_schema.dump(student),200        

    def patch(self, student_id):
        student = Student.query.get_or_404(student_id)
        data = request.get_json()

        for key, value in data.items():
            if hasattr(student, key):
                setattr(student, key, value)

        db.session.commit()
        return student_schema.dump(student), 200 

    