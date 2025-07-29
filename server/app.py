
from flask import Flask, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api, Resource
from flask_migrate import Migrate



from config import Config
from marshmallow import ValidationError
from datetime import timedelta
from flask_jwt_extended import jwt_required


from extensions import db, ma, jwt, bcrypt, cors

app = Flask(__name__)
app.config.from_object(Config)


db.init_app(app)
ma.init_app(app)
jwt.init_app(app)
bcrypt.init_app(app)
cors.init_app(app, resources={r"/api/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)
api = Api(app)
migrate = Migrate(app, db)




from routes.auth_routes import SchoolOwnerRegister, AdminCreateEducator, AdminCreateStudent, Login, ChangePassword, UserProfile, CreateSchool, StudentDashboard
from schemas import SchoolOwnerRegistrationSchema, StudentCreationSchema, EducatorCreationSchema, LoginSchema, ChangePasswordSchema, UserProfileResponseSchema, AuthResponseSchema, UserCreationResponseSchema
from routes.school_stats import SchoolStats
from routes.schools import SchoolListResource, SchoolResource
from routes.owner_dashboard import OwnerDashboard
from routes.school_management import SchoolDetails, AssignUserToClass

from routes.attendance_route import AttendanceById, Attendances
from routes.clas_routes import ClassList,ClassById, ClassResources, ClassAssessments
from routes.assessment_routes import AssessmentById


from models import *




school_owner_schema = SchoolOwnerRegistrationSchema()
student_creation_schema = StudentCreationSchema()
educator_creation_schema = EducatorCreationSchema()
login_schema = LoginSchema()
change_password_schema = ChangePasswordSchema()
user_profile_schema = UserProfileResponseSchema()
auth_response_schema = AuthResponseSchema()
user_creation_response_schema = UserCreationResponseSchema()



class ValidatedSchoolOwnerRegister(SchoolOwnerRegister):
    def post(self):
        try:
            
            data = school_owner_schema.load(request.get_json())
            

            request.validated_data = data
            
           
            response = super().post()
            return response
            
        except ValidationError as err:
            return {"error": "Validation failed", "messages": err.messages}, 400
        except Exception as e:
            return {"error": str(e)}, 500

class ValidatedAdminCreateStudent(AdminCreateStudent):
    @jwt_required()
    def post(self):
        try:
            data = student_creation_schema.load(request.get_json())
            request.validated_data = data
            response = super().post()
            return response
            
        except ValidationError as err:
            return {"error": "Validation failed", "messages": err.messages}, 400
        except Exception as e:
            return {"error": str(e)}, 500

class ValidatedAdminCreateEducator(AdminCreateEducator):
    @jwt_required()
    def post(self):
        try:
            data = educator_creation_schema.load(request.get_json())
            
            request.validated_data = data
            response = super().post()
            return response
            
        except ValidationError as err:
            return {"error": "Validation failed", "messages": err.messages}, 400
        except Exception as e:
            return {"error": str(e)}, 500

class ValidatedLogin(Login):
    def post(self):
        try:
           
            data = login_schema.load(request.get_json())
            request.validated_data = data
            
            response = super().post()
            return response
            
        except ValidationError as err:
            return {"error": "Validation failed", "messages": err.messages}, 400
        except Exception as e:
            return {"error": str(e)}, 500

class ValidatedChangePassword(ChangePassword):
    @jwt_required()
    def post(self):
        try:
            data = change_password_schema.load(request.get_json())
            request.validated_data = data
            
            response = super().post()
            return response
            
        except ValidationError as err:
            return {"error": "Validation failed", "messages": err.messages}, 400
        except Exception as e:
            return {"error": str(e)}, 500

class Home(Resource):
    def get(self):
        return make_response({"status": "healthy", "message": "Shuleni API is running"}, 200)


api.add_resource(Home, '/api/home', endpoint='home')


api.add_resource(SchoolListResource, "/api/schools")
api.add_resource(SchoolResource, "/api/schools/<int:id>")
api.add_resource(Login, '/api/login', endpoint='login')
api.add_resource(SchoolOwnerRegister, '/api/register/owner', endpoint='register_owner') 
api.add_resource(AdminCreateStudent, '/api/admin/create-student', endpoint='create_student')
api.add_resource(AdminCreateEducator, '/api/admin/create-educator', endpoint='create_educator')
api.add_resource(ChangePassword, '/api/change-password', endpoint='change_password')
api.add_resource(UserProfile, '/api/profile', endpoint='user_profile')
api.add_resource(SchoolStats, '/api/admin/stats', endpoint='school_stats')
api.add_resource(CreateSchool, '/api/create-school', endpoint='create_school')
api.add_resource(OwnerDashboard, '/api/owner/dashboard', endpoint='owner_dashboard')
api.add_resource(StudentDashboard, '/api/student/dashboard', endpoint='student_dashboard')
api.add_resource(ClassList, "/api/classes", endpoint="class_list")
api.add_resource(ClassById, "/api/classes/<int:id>", endpoint="class_detail")
api.add_resource(
    AssignUserToClass,
    "/api/schools/<int:school_id>/classes/<int:class_id>/assignments",
    endpoint="assign_user_to_class",
    methods=["OPTIONS", "POST", "DELETE"]
)

api.add_resource(SchoolDetails, '/api/schools/<int:school_id>/details', endpoint='school_details')
api.add_resource(ClassResources, "/api/classes/<int:class_id>/resources", endpoint="class_resources")
api.add_resource(ClassAssessments, "/api/classes/<int:class_id>/assessments", endpoint="class_assessments")
api.add_resource(AssessmentById, "/api/assessments/<int:id>", endpoint="assessment_by_id")
