from flask import request
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_restful import Resource
from extensions import db, bcrypt
from models import User, Student, Teacher, School, Class, ClassMember
from datetime import datetime, timezone, timedelta
import json

class EducatorDashboard(Resource):
    @jwt_required()
    def get(self):
        current_user = json.loads(get_jwt_identity())

        if not current_user or not isinstance(current_user, dict):
            return  {"error":"unauthorised"}, 401
        
        if current_user["role"] != "educator":
            return {"error": "unauthorised"}, 403
        
        try:
            educator_id = current_user["id"]
            teacher = Teacher.query.filter_by(user_id=educator_id).first()

            if not teacher:
                return {"error": "Educator record not found"}, 404

            school = School.query.get(teacher.school_id)

            
            # FIX: Get educator's classes via ClassMember table
            class_memberships = ClassMember.query.filter_by(
                user_id=educator_id, role_in_class='educator'
            ).all()

            class_ids = [m.class_id for m in class_memberships]
            active_classes = Class.query.filter(Class.id.in_(class_ids)).all()
            num_classes = len(active_classes)

            #  FIX: Access uploaded resources via User, not Teacher
            user = User.query.get(educator_id)
            uploaded_materials = user.uploaded_resources if hasattr(user, "uploaded_resources") else []
            num_uploads = len(uploaded_materials)


            
            recent_uploads = sorted(uploaded_materials, key=lambda x: x.created_at, reverse=True)[:5]
            recent_resources = [
                {
                    "title": material.title,
                    "subject": getattr(material, "subject", "General"),
                    "uploaded_at": material.created_at.strftime("%Y-%m-%d %H:%M"),
                    "file_url": getattr(material, "file_url", "#")
                }
                for material in recent_uploads
            ]

            return {
                "educator": {
                    "id": educator_id,
                    "full_name": current_user.get("full_name", "Educator"),
                    "school": {
                        "name": school.name if school else "Unknown",
                        "logo": "/logo.png"
                    }
                },
                "stats": {
                    "classes": num_classes,
                    "uploads": num_uploads
                },
                "recent_resources": recent_resources
            }, 200

        except Exception as e:
            return {"error": str(e)}, 500
