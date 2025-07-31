
from extensions import db, bcrypt
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime, timezone


class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    _password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum('owner', 'educator', 'student', name='user_roles'), nullable=False)
    school_id = db.Column(db.Integer, db.ForeignKey('schools.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    first_login = db.Column(db.Boolean, default=True, nullable=True)


    school = db.relationship('School', back_populates='users', foreign_keys=[school_id])
    

    class_memberships = db.relationship('ClassMember', back_populates='user', cascade='all, delete-orphan')
    attendances = db.relationship('Attendance', back_populates='student', foreign_keys='Attendance.student_id', cascade='all, delete-orphan')
    marked_attendance = db.relationship('Attendance', back_populates='educator', foreign_keys='Attendance.educator_id', cascade='all, delete-orphan')
    uploaded_resources = db.relationship('Resource', back_populates='uploader', cascade='all, delete-orphan')
    assessments_created = db.relationship('Assessment', back_populates='creator', cascade='all, delete-orphan')
    submissions = db.relationship('Submission', back_populates='student', foreign_keys='Submission.student_id', cascade='all, delete-orphan')
    graded_submissions = db.relationship('Submission', back_populates='grader',foreign_keys='Submission.graded_by')
    student_profile = db.relationship("Student", back_populates="user", uselist=False, cascade='all, delete-orphan', single_parent=True)

    messages = db.relationship('Chat', back_populates='sender', cascade='all, delete-orphan')

    serialize_rules = ('-password_hash','-school.users','-class_memberships.user', '-attendances.student', '-marked_attendance.educator')
    
    
    
    @hybrid_property
    def password_hash(self):
        raise AttributeError('Password hash may not be viewed.')
    
    @password_hash.setter
    def password_hash(self, password):
        hashed_password = bcrypt.generate_password_hash(password)
        self._password_hash = hashed_password.decode('utf-8')
        
    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password)
    



    def __repr__(self):
        return f"<User id={self.id} name='{self.full_name}' role={self.role} school_id={self.school_id}>"
    


