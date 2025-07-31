from flask_socketio import join_room, leave_room, emit
from datetime import datetime
from extensions import db
from models.chat import Chat
from app import socketio


@socketio.on("join")
def handle_join(data):
    class_id = data.get("class_id")
    username = data.get("username")

    room = f"class_{class_id}"
    join_room(room)
    emit("status", {
        "msg": f"{username} joined class {class_id}"
    }, room=room)


@socketio.on("leave")
def handle_leave(data):
    class_id = data.get("class_id")
    username = data.get("username")

    room = f"class_{class_id}"
    leave_room(room)
    emit("status", {
        "msg": f"{username} left class {class_id}"
    }, room=room)


@socketio.on("send_message")
def handle_send_message(data):
    class_id = data.get("class_id")
    user_id = data.get("user_id")
    message = data.get("message")

    # Save message
    new_chat = Chat(
        class_id=class_id,
        user_id=user_id,
        message=message,
        timestamp=datetime.utcnow()
    )
    db.session.add(new_chat)
    db.session.commit()

    # Emit to everyone in class room
    emit("receive_message", {
        "class_id": class_id,
        "user_id": user_id,
        "message": message,
        "user_name": new_chat.user.full_name,
        "timestamp": new_chat.timestamp.isoformat()
    }, room=f"class_{class_id}")
