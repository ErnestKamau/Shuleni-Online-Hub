from flask import request
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_restful import Resource
from extensions import db, bcrypt
from models import User, Student, Teacher, School
from datetime import datetime, timezone, timedelta
import json

class OwnerDashboard(Resource):
    @jwt_required()
    def get(self):
        
        current_user = json.loads(get_jwt_identity())
        if not current_user or not isinstance(current_user, dict):
            return {"error": "Unauthorized"}, 401
        
        
        if current_user['role'] != 'owner':
            return {"error": "Unauthorized"}, 403
            
        try:
            owner_id = current_user['id']
            
            
            owned_schools = School.query.filter_by(owner_id=owner_id).all()
            
            # Serialize schools data
            schools_data = []
            total_students = 0
            total_teachers = 0
            
            for school in owned_schools:
                # Count students and teachers for this school
                school_students = Student.query.filter_by(school_id=school.id).count()
                school_teachers = Teacher.query.filter_by(school_id=school.id).count()
                
                total_students += school_students
                total_teachers += school_teachers
                
                school_data = {
                    "id": school.id,
                    "name": school.name,
                    "description": school.description,
                    "address": school.address,
                    "location": school.address,
                    "established": school.created_at.strftime("%Y") if school.created_at else "N/A",
                    "created_at": school.created_at.isoformat() if school.created_at else None,
                    "student_count": school_students,
                    "teacher_count": school_teachers
                }
                schools_data.append(school_data)
            
            # Get recent additions (last 30 days) across all owned schools
            thirty_days_ago = datetime.now(timezone.utc) - timedelta(days=30)
            
            # Get school IDs for owned schools
            school_ids = [school.id for school in owned_schools]
            
            recent_students = 0
            recent_teachers = 0
            
            if school_ids:
                recent_students = Student.query.filter(
                    Student.school_id.in_(school_ids),
                    Student.created_at >= thirty_days_ago
                ).count()
                
                recent_teachers = Teacher.query.filter(
                    Teacher.school_id.in_(school_ids),
                    Teacher.created_at >= thirty_days_ago
                ).count()
            
            # Get owner profile info
            owner = User.query.get(owner_id)
            
            return {
                "owner": {
                    "id": owner.id,
                    "full_name": owner.full_name,
                    "email": owner.email
                },
                "schools": schools_data,
                "stats": {
                    "total_schools": len(owned_schools),
                    "total_students": total_students,
                    "total_teachers": total_teachers,
                    "recent_students": recent_students,
                    "recent_teachers": recent_teachers
                }
            }, 200
            
        except Exception as e:
            return {"error": str(e)}, 500
