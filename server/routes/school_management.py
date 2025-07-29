from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restful import Resource
from extensions import db
from models import User, Student, Teacher, School, Class, ClassMember
from datetime import datetime, timezone
import json


class SchoolDetails(Resource):
    @jwt_required()
    def get(self, school_id):
        current_user = json.loads(get_jwt_identity())
        
        if current_user['role'] != 'owner':
            return {"error": "Unauthorized"}, 403
            
        try:
            school = School.query.filter_by(id=school_id, owner_id=current_user['id']).first()
            if not school:
                return {"error": "School not found or unauthorized"}, 404
            
            
            classes = Class.query.filter_by(school_id=school_id).all()
            
            
            students = Student.query.filter_by(school_id=school_id).all()
            teachers = Teacher.query.filter_by(school_id=school_id).all()
            
            
            classes_data = []
            for class_ in classes:
                
                members = ClassMember.query.filter_by(class_id=class_.id).all()
                
                class_students = []
                class_teachers = []
                
                for member in members:
                    user_data = {
                        "id": member.user.id,
                        "full_name": member.user.full_name,
                        "email": member.user.email,
                        "joined_at": member.joined_at.isoformat() if member.joined_at else None
                    }
                    
                    
                    if member.role_in_class == 'student':
                        
                        student_profile = Student.query.filter_by(user_id=member.user.id).first()
                        if student_profile:
                            user_data["admission_number"] = student_profile.admission_number
                            user_data["grade"] = student_profile.grade
                        class_students.append(user_data)
                    elif member.role_in_class == 'educator':
                        
                        teacher_profile = Teacher.query.filter_by(user_id=member.user.id).first()
                        if teacher_profile:
                            user_data["tsc_number"] = teacher_profile.tsc_number
                        class_teachers.append(user_data)
                
                class_data = {
                    "id": class_.id,
                    "name": class_.name,
                    "created_at": class_.created_at.isoformat() if class_.created_at else None,
                    "students": class_students,
                    "teachers": class_teachers,
                    "total_students": len(class_students),
                    "total_teachers": len(class_teachers)
                }
                classes_data.append(class_data)
            
            assigned_user_ids = set()
            for class_ in classes:
                members = ClassMember.query.filter_by(class_id=class_.id).all()
                for member in members:
                    assigned_user_ids.add(member.user_id)
            
            unassigned_students = []
            for student in students:
                if student.user_id not in assigned_user_ids:
                    unassigned_students.append({
                        "id": student.user.id,
                        "full_name": student.user.full_name,
                        "email": student.user.email,
                        "admission_number": student.admission_number,
                        "grade": student.grade
                    })
            
            unassigned_teachers = []
            for teacher in teachers:
                if teacher.user_id not in assigned_user_ids:
                    unassigned_teachers.append({
                        "id": teacher.user.id,
                        "full_name": teacher.user.full_name,
                        "email": teacher.user.email,
                        "tsc_number": teacher.tsc_number
                    })
            
            return {
                "school": {
                    "id": school.id,
                    "name": school.name,
                    "description": school.description,
                    "address": school.address,
                    "created_at": school.created_at.isoformat() if school.created_at else None
                },
                "classes": classes_data,
                "unassigned_students": unassigned_students,
                "unassigned_teachers": unassigned_teachers,
                "stats": {
                    "total_classes": len(classes),
                    "total_students": len(students),
                    "total_teachers": len(teachers),
                    "unassigned_students": len(unassigned_students),
                    "unassigned_teachers": len(unassigned_teachers)
                }
            }, 200
            
        except Exception as e:
            return {"error": str(e)}, 500


class ClassManagement(Resource):
    @jwt_required()
    def post(self, school_id):
        """Create a new class"""
        current_user = json.loads(get_jwt_identity())
        
        if current_user['role'] != 'owner':
            return {"error": "Unauthorized"}, 403
            
        try:
            
            school = School.query.filter_by(id=school_id, owner_id=current_user['id']).first()
            if not school:
                return {"error": "School not found or unauthorized"}, 404
            
            data = request.get_json()
            if not data.get('name'):
                return {"error": "Class name is required"}, 400
            
            
            existing_class = Class.query.filter_by(name=data['name'], school_id=school_id).first()
            if existing_class:
                return {"error": "Class name already exists in this school"}, 409
            
            
            new_class = Class(
                name=data['name'],
                school_id=school_id,
                created_by=current_user['id'],
                created_at=datetime.now(timezone.utc)
            )
            
            db.session.add(new_class)
            db.session.commit()
            
            return {
                "message": "Class created successfully",
                "class": {
                    "id": new_class.id,
                    "name": new_class.name,
                    "school_id": new_class.school_id,
                    "created_at": new_class.created_at.isoformat()
                }
            }, 201
            
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500
    
    @jwt_required()
    def put(self, school_id, class_id):
        """Update a class"""
        current_user = json.loads(get_jwt_identity())
        
        if current_user['role'] != 'owner':
            return {"error": "Unauthorized"}, 403
            
        try:
            school = School.query.filter_by(id=school_id, owner_id=current_user['id']).first()
            if not school:
                return {"error": "School not found or unauthorized"}, 404
                
            class_ = Class.query.filter_by(id=class_id, school_id=school_id).first()
            if not class_:
                return {"error": "Class not found"}, 404
            
            data = request.get_json()
            if not data.get('name'):
                return {"error": "Class name is required"}, 400
            
            existing_class = Class.query.filter(
                Class.name == data['name'],
                Class.school_id == school_id,
                Class.id != class_id
            ).first()
            if existing_class:
                return {"error": "Class name already exists in this school"}, 409
            
            class_.name = data['name']
            db.session.commit()
            
            return {
                "message": "Class updated successfully",
                "class": {
                    "id": class_.id,
                    "name": class_.name,
                    "school_id": class_.school_id
                }
            }, 200
            
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500
    
    @jwt_required()
    def delete(self, school_id, class_id):
        """Delete a class"""
        current_user = json.loads(get_jwt_identity())
        
        if current_user['role'] != 'owner':
            return {"error": "Unauthorized"}, 403
            
        try:
            
            school = School.query.filter_by(id=school_id, owner_id=current_user['id']).first()
            if not school:
                return {"error": "School not found or unauthorized"}, 404
                
            class_ = Class.query.filter_by(id=class_id, school_id=school_id).first()
            if not class_:
                return {"error": "Class not found"}, 404
            
            db.session.delete(class_)
            db.session.commit()
            
            return {"message": "Class deleted successfully"}, 200
            
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500


class AssignUserToClass(Resource):
    def options(self, school_id, class_id):
        return {}, 200
    @jwt_required()
    def post(self, school_id, class_id):
        """Assign users to a class"""
        current_user = json.loads(get_jwt_identity())
        
        if current_user['role'] != 'owner':
            return {"error": "Unauthorized"}, 403
            
        try:
            
            school = School.query.filter_by(id=school_id, owner_id=current_user['id']).first()
            if not school:
                return {"error": "School not found or unauthorized"}, 404
                
            class_ = Class.query.filter_by(id=class_id, school_id=school_id).first()
            if not class_:
                return {"error": "Class not found"}, 404
            
            data = request.get_json()
            user_ids = data.get('user_ids', [])
            role = data.get('role') 

            print("Received POST to /assignments")
            print("Raw data:", data)
            print("user_ids:", user_ids, " type:", type(user_ids))
            print("role:", role)
            
            if not user_ids or not role:
                return {"error": "user_ids and role are required"}, 400
            
            if role not in ['student', 'educator']:
                return {"error": "Role must be 'student' or 'educator'"}, 400
            
            assignments_created = []
            errors = []
            
            for user_id in user_ids:
                try:
                   
                    user = User.query.filter_by(id=user_id, school_id=school_id).first()
                    if not user:
                        errors.append(f"User {user_id} not found in this school")
                        continue
                    
                    
                    if role == 'student' and user.role != 'student':
                        errors.append(f"User {user.full_name} is not a student")
                        continue
                    elif role == 'educator' and user.role != 'educator':
                        errors.append(f"User {user.full_name} is not an educator")
                        continue
                    
                    
                    existing_assignment = ClassMember.query.filter_by(
                        class_id=class_id, 
                        user_id=user_id
                    ).first()
                    if existing_assignment:
                        errors.append(f"User {user.full_name} is already assigned to this class")
                        continue
                    
                    assignment = ClassMember(
                        class_id=class_id,
                        user_id=user_id,
                        role_in_class=role,
                        joined_at=datetime.now(timezone.utc)
                    )
                    
                    db.session.add(assignment)
                    assignments_created.append({
                        "user_id": user_id,
                        "user_name": user.full_name,
                        "role": role
                    })
                    
                except Exception as e:
                    errors.append(f"Error assigning user {user_id}: {str(e)}")
            
            if assignments_created:
                db.session.commit()
            
            return {
                "message": f"Assigned {len(assignments_created)} users to class successfully",
                "assignments_created": assignments_created,
                "errors": errors
            }, 200 if assignments_created else 400
            
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500
    
    @jwt_required()
    def delete(self, school_id, class_id):
        """Remove users from a class"""
        current_user = json.loads(get_jwt_identity())
        
        if current_user['role'] != 'owner':
            return {"error": "Unauthorized"}, 403
            
        try:
            school = School.query.filter_by(id=school_id, owner_id=current_user['id']).first()
            if not school:
                return {"error": "School not found or unauthorized"}, 404
                
            class_ = Class.query.filter_by(id=class_id, school_id=school_id).first()
            if not class_:
                return {"error": "Class not found"}, 404
            
            data = request.get_json()
            user_ids = data.get('user_ids', [])
            
            if not user_ids:
                return {"error": "user_ids are required"}, 400
            
            removed_count = 0
            errors = []
            
            for user_id in user_ids:
                try:
                    assignment = ClassMember.query.filter_by(
                        class_id=class_id,
                        user_id=user_id
                    ).first()
                   
                    if assignment:
                        db.session.delete(assignment)
                        removed_count += 1
                    else:
                        errors.append(f"User {user_id} not found in this class")
                        
                except Exception as e:
                    errors.append(f"Error removing user {user_id}: {str(e)}")
            
            if removed_count > 0:
                db.session.commit()
            
            return {
                "message": f"Removed {removed_count} users from class successfully",
                "removed_count": removed_count,
                "errors": errors
            }, 200
            
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500
