from flask import request, make_response, Response
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import or_, desc
from datetime import datetime
import io
import csv
import humanize
import json

from app import db, ma
from models import Chat
from models import User  


class ChatSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Chat
        load_instance = True
        include_fk = True

    id = ma.auto_field()
    class_id = ma.auto_field()
    user_id = ma.auto_field()
    message = ma.auto_field()
    timestamp = ma.auto_field()

    user_name = ma.Function(lambda obj: obj.user.full_name if obj.user else "Unknown")
    relative_time = ma.Function(lambda obj: humanize.naturaltime(datetime.utcnow() - obj.timestamp))

    url = ma.Hyperlinks({
        "self": ma.URLFor("chatresource", values={"chat_id": "<id>"}),
        "collection": ma.URLFor("chatlistresource")
    })

chat_schema = ChatSchema()
chats_schema = ChatSchema(many=True)

# ─── Resources ──────────────────────────────────────
class ChatListResource(Resource):
    @jwt_required()
    def get(self):
        class_id = request.args.get("class_id")
        search = request.args.get("q")

        query = Chat.query.order_by(Chat.timestamp)

        if class_id:
            query = query.filter(Chat.class_id == class_id)
        if search:
            query = query.filter(Chat.message.ilike(f"%{search}%"))

        chats = query.all()
        return make_response({
            "count": len(chats),
            "chats": chats_schema.dump(chats)
        }, 200)

    @jwt_required()
    def post(self):
        current_user = json.loads(get_jwt_identity())  # from JWT
        try:
            data = request.get_json()
            message = data.get("message")

            if not message:
                return {"error": "Message is required"}, 400

            # Fetch the actual User record from DB
            user = User.query.get(current_user["id"])
            if not user:
                return {"error": "User not found"}, 404

            # Automatically detect class_id
            class_id = None

            if user.role == "student" and user.student_profile:
                class_id = user.student_profile.class_id

            elif user.role == "educator" and user.teacher_profile:
                class_id = user.teacher_profile[0].class_id

            else:
                return {"error": "This role is not allowed to send chats or no class assigned"}, 403

            if not class_id:
                return {"error": "User has no class assigned"}, 400

            # Create and save the Chat
            new_chat = Chat(
                class_id=class_id,
                user_id=user.id,
                message=message,
                timestamp=datetime.utcnow()
            )
            db.session.add(new_chat)
            db.session.commit()

            return make_response({
                "message": "Chat created successfully",
                "chat": chat_schema.dump(new_chat)
            }, 201)

        except Exception as e:
            return make_response({"error": str(e)}, 500)


class ChatResource(Resource):
    @jwt_required()
    def get(self, chat_id):
        chat = Chat.query.get_or_404(chat_id)
        return make_response(chat_schema.dump(chat), 200)

    @jwt_required()
    def delete(self, chat_id):
        chat = Chat.query.get_or_404(chat_id)
        db.session.delete(chat)
        db.session.commit()
        return make_response({"message": "Deleted successfully"}, 204)


class ChatExportResource(Resource):
    @jwt_required()
    def get(self):
        class_id = request.args.get("class_id")
        chats = Chat.query.filter_by(class_id=class_id).order_by(Chat.timestamp).all() if class_id else Chat.query.order_by(Chat.timestamp).all()

        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["ID", "Class ID", "User Name", "Message", "Timestamp"])

        for chat in chats:
            writer.writerow([
                chat.id,
                chat.class_id,
                chat.user.full_name if chat.user else "Unknown",
                chat.message,
                chat.timestamp.strftime("%Y-%m-%d %H:%M:%S")
            ])

        output.seek(0)
        return Response(output, mimetype="text/csv", headers={"Content-Disposition": "attachment; filename=chats.csv"})
