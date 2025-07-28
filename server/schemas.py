from marshmallow import Schema, fields, validate, validates_schema, ValidationError
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from models import User, Student, Teacher, School
from extensions import db


class UserSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
        sqla_session = db.session
        exclude = ['password_hash']  
    
    #custom fields for nested relationships
    student_profile = fields.Nested('StudentSchema', exclude=['user'], dump_only=True)
    teacher_profile = fields.Nested('TeacherSchema', exclude=['user'], dump_only=True)
    school = fields.Nested('SchoolSchema', exclude=['users'], dump_only=True)

class StudentSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Student
        load_instance = True
        sqla_session = db.session
    
    user = fields.Nested('UserSchema', exclude=['student_profile'], dump_only=True)
    school = fields.Nested('SchoolSchema', exclude=['students'], dump_only=True)

class TeacherSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Teacher
        load_instance = True
        sqla_session = db.session
    
    user = fields.Nested('UserSchema', exclude=['teacher_profile'], dump_only=True)
    school = fields.Nested('SchoolSchema', exclude=['teachers'], dump_only=True)

class SchoolSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = School
        load_instance = True
        sqla_session = db.session
    
    users = fields.Nested('UserSchema', many=True, exclude=['school'], dump_only=True)

# Custom validation schemas for API requests
class SchoolOwnerRegistrationSchema(Schema):
    full_name = fields.String(required=True, validate=validate.Length(min=2, max=120))
    email = fields.Email(required=True)
    password = fields.String(required=True, validate=validate.Length(min=6))
    school_name = fields.String(required=True, validate=validate.Length(min=2, max=120))
    description = fields.String(load_default='', validate=validate.Length(max=500))

class StudentCreationSchema(Schema):
    full_name = fields.String(required=True, validate=validate.Length(min=2, max=120))
    admission_number = fields.String(required=True, validate=validate.Length(min=1, max=50))
    grade = fields.String(required=True, validate=validate.Length(min=1, max=20))
    class_id = fields.Integer(load_default=None, allow_none=True)
    
    @validates_schema
    def validate_admission_number(self, data, **kwargs):
        admission_num = data.get('admission_number')
        if admission_num and not admission_num.replace('-', '').replace('/', '').isalnum():
            raise ValidationError('Admission number can only contain letters, numbers, hyphens, and slashes')

class EducatorCreationSchema(Schema):
    full_name = fields.String(required=True, validate=validate.Length(min=2, max=120))
    school_email = fields.Email(required=True)
    tsc_number = fields.String(required=True, validate=validate.Length(min=1, max=100))
    class_id = fields.Integer(load_default=None, allow_none=True)
    
    @validates_schema
    def validate_school_email(self, data, **kwargs):
        email = data.get('school_email')
        if email and not email.endswith('.edu') and '@' not in email:
            # You can add more specific validation based on your school email format
            pass

class LoginSchema(Schema):
    username = fields.String(required=True, validate=validate.Length(min=1))
    password = fields.String(required=True, validate=validate.Length(min=1))

class ChangePasswordSchema(Schema):
    old_password = fields.String(required=True, validate=validate.Length(min=1))
    new_password = fields.String(required=True, validate=validate.Length(min=6))

class UserProfileResponseSchema(Schema):
    id = fields.Integer()
    full_name = fields.String()
    email = fields.String()
    role = fields.String()
    school_id = fields.Integer()
    created_at = fields.DateTime()
    
    
    admission_number = fields.String(allow_none=True)
    grade = fields.String(allow_none=True)
    tsc_number = fields.String(allow_none=True)
    class_id = fields.Integer(allow_none=True)


class AssignClassSchema(Schema):
    user_ids = fields.List(fields.Integer(), required=True, validate=validate.Length(min=1))
    class_id = fields.Integer(required=True)

class BulkUserCreationSchema(Schema):
    users = fields.List(fields.Dict(), required=True, validate=validate.Length(min=1, max=100))
    user_type = fields.String(required=True, validate=validate.OneOf(['student', 'educator']))


class AuthResponseSchema(Schema):
    token = fields.String()
    role = fields.String()
    full_name = fields.String()
    id = fields.Integer()
    school_id = fields.Integer()
    email = fields.String(allow_none=True)
    admission_number = fields.String(allow_none=True)
    first_login = fields.Boolean()  # Add first_login field

class UserCreationResponseSchema(Schema):
    message = fields.String()
    temporary_password = fields.String()
    user_id = fields.Integer()
    admission_number = fields.String(allow_none=True)  # For students
    school_email = fields.String(allow_none=True)  # For educators