
from extensions import db
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime, timezone
from sqlalchemy import and_
from .class_member import ClassMember  
from .user import User
from sqlalchemy.orm import foreign




class Class(db.Model, SerializerMixin):
    __tablename__ = 'classes'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    school_id = db.Column(db.Integer, db.ForeignKey('schools.id'), nullable=False)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    school = db.relationship('School', back_populates='classes')
    members = db.relationship('ClassMember', back_populates='class_', cascade='all, delete-orphan',single_parent=True)
    resources = db.relationship('Resource', back_populates='class_')
    assessments = db.relationship('Assessment', back_populates='class_', cascade='all, delete-orphan')
    attendance_records = db.relationship('Attendance', back_populates='class_', cascade='all, delete-orphan')
    messages = db.relationship('Chat', back_populates='class_', cascade='all, delete-orphan')
    students = db.relationship("Student", back_populates="class_", cascade='all, delete-orphan')
   


    serialize_rules = ('-school.classes', '-members.class_', '-resources.class_', '-assessments.class_', '-attendance_records.class_', '-messages.class_',)

    def __repr__(self):
        return f"<Class id={self.id} name='{self.name}' school_id={self.school_id}>"
