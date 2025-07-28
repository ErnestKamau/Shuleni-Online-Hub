#!/usr/bin/env python3
from flask import Flask, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api, Resource
from flask_migrate import Migrate
from routes.schools import SchoolListResource, SchoolResource


from config import Config
from marshmallow import ValidationError
from datetime import timedelta
from flask_jwt_extended import jwt_required

# Import from extensions
from extensions import db, ma, jwt, bcrypt, cors

app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions with app
db.init_app(app)
ma.init_app(app)
jwt.init_app(app)
bcrypt.init_app(app)
cors.init_app(app, resources={r"/api/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)
api = Api(app)
migrate = Migrate(app, db)

# import routes
from routes.auth_routes import SchoolOwnerRegister, AdminCreateEducator, AdminCreateStudent, Login, ChangePassword, UserProfile
from schemas import SchoolOwnerRegistrationSchema, StudentCreationSchema, EducatorCreationSchema, LoginSchema, ChangePasswordSchema, UserProfileResponseSchema, AuthResponseSchema, UserCreationResponseSchema
from routes.school_stats import SchoolStats
from routes.schools import SchoolListResource, SchoolResource



# import models
from models import *



# Initialize schemas
school_owner_schema = SchoolOwnerRegistrationSchema()
student_creation_schema = StudentCreationSchema()
educator_creation_schema = EducatorCreationSchema()
login_schema = LoginSchema()
change_password_schema = ChangePasswordSchema()
user_profile_schema = UserProfileResponseSchema()
auth_response_schema = AuthResponseSchema()
user_creation_response_schema = UserCreationResponseSchema()


# Enhanced Resource classes with validation
class ValidatedSchoolOwnerRegister(SchoolOwnerRegister):
    def post(self):
        try:
            # Validate input data
            data = school_owner_schema.load(request.get_json())
            
            # Set the validated data in request for parent class
            request.validated_data = data
            
            # Call parent method
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
            # Validate input data
            data = student_creation_schema.load(request.get_json())
            
            # Set the validated data in request for parent class
            request.validated_data = data
            
            # Call parent method with validated data
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
            # Validate input data
            data = educator_creation_schema.load(request.get_json())
            
            # Set the validated data in request for parent class
            request.validated_data = data
            
            # Call parent method
            response = super().post()
            return response
            
        except ValidationError as err:
            return {"error": "Validation failed", "messages": err.messages}, 400
        except Exception as e:
            return {"error": str(e)}, 500

class ValidatedLogin(Login):
    def post(self):
        try:
            # Validate input data
            data = login_schema.load(request.get_json())
            
            # Set the validated data in request for parent class
            request.validated_data = data
            
            # Call parent method
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
            # Validate input data
            data = change_password_schema.load(request.get_json())
            
            # Set the validated data in request for parent class
            request.validated_data = data
            
            # Call parent method
            response = super().post()
            return response
            
        except ValidationError as err:
            return {"error": "Validation failed", "messages": err.messages}, 400
        except Exception as e:
            return {"error": str(e)}, 500



# define your resource class
class Home(Resource):
    def get(self):
        return make_response({"status": "healthy", "message": "Shuleni API is running"}, 200)

# register the route
api.add_resource(Home, '/api/home', endpoint='home')


api.add_resource(SchoolListResource, "/api/schools")
api.add_resource(SchoolResource, "/api/schools/<int:id>")



# api.add_resource(ValidatedSchoolOwnerRegister, '/api/register/owner')
# api.add_resource(ValidatedAdminCreateStudent, '/api/admin/create-student')
# api.add_resource(ValidatedAdminCreateEducator, '/api/admin/create-educator')
# api.add_resource(ValidatedLogin, '/api/login')
# api.add_resource(ValidatedChangePassword, '/api/change-password')
# api.add_resource(UserProfile, '/api/profile')
# api.add_resource(SchoolStats, '/api/admin/stats')
# # api.add_resource(AssignUserToClass, '/api/admin/assign-class')


api.add_resource(Login, '/api/login', endpoint='login')
api.add_resource(SchoolOwnerRegister, '/api/register/owner', endpoint='register_owner') 
api.add_resource(AdminCreateStudent, '/api/admin/create-student', endpoint='create_student')
api.add_resource(AdminCreateEducator, '/api/admin/create-educator', endpoint='create_educator')
api.add_resource(ChangePassword, '/api/change-password', endpoint='change_password')
api.add_resource(UserProfile, '/api/profile', endpoint='user_profile')
api.add_resource(SchoolStats, '/api/admin/stats', endpoint='school_stats')
