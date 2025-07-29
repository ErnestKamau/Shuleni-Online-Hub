from extensions import db
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime, timezone


class Chat(db.Model, SerializerMixin):
    __tablename__ = 'chats'
    
    id = db.Column(db.Integer, primary_key=True)
    class_id = db.Column(db.Integer, db.ForeignKey('classes.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    message = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    class_ = db.relationship('Class', back_populates='messages')
    sender = db.relationship('User', back_populates='messages')


    serialize_rules = ('-class_.messages', '-sender.messages',)


    def __repr__(self):
        return f"<Chat id={self.id} user_id={self.user_id} class_id={self.class_id} message='{self.message[:20]}...'>"