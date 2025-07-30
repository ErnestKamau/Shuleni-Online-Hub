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


    @property
    def user_role(self):
        return self.sender.role if self.sender else "unknown"


    def __repr__(self):
        return f"<Chat id={self.id} user_id={self.user_id} class_id={self.class_id} message='{self.message[:20]}...'>"
    
    

    




    

    #message_type = db.Column(db.String, default='text')
    #is_read = db.Column(db.Boolean, default=False)
    #receiver = db.relationship('User', foreign_keys=[receiver_id], back_populates='received_messages')
    #'-receiver.received_messages'
    #sender_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    #receiver_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)