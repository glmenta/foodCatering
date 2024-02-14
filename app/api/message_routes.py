from app.models.message import Message
from flask import Blueprint, jsonify, request
from app.models.db import db
from app.models.user import User
from app.models.order import Order
from flask_login import login_required, current_user
from app.forms.message_form import MessageForm
message_routes = Blueprint('messages', __name__)

@message_routes.route('/all', methods=['GET'])
def view_all_messages():
    messages = Message.query.all()
    return {'messages': [message.to_dict() for message in messages]}

@message_routes.route('/<int:user_id>/received', methods=['GET'])
def view_received_messages(user_id):
    messages = Message.query.filter_by(receiver_id=user_id).all()
    return {'received_messages': [message.to_dict() for message in messages]}

@message_routes.route('/<int:user_id>/sent', methods=['GET'])
def view_sent_messages(user_id):
    messages = Message.query.filter_by(sender_id=user_id).all()
    return {'sent_messages': [message.to_dict() for message in messages]}

@message_routes.route('/<int:order_id>', methods=['GET'])
def view_messages_by_order_id(order_id):
    messages = Message.query.filter_by(order_id=order_id).all()
    return {'messages': [message.to_dict() for message in messages]}

@message_routes.route('/send/<int:order_id>', methods=['GET', 'POST'])
def send_message(order_id):
    form = MessageForm()

    order = Order.query.get(order_id)
    if not order or order.user_id != current_user.id:
        return jsonify({'error': 'Order not found or does not belong to the current user'}), 404

    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():

        message = Message(
            sender_id=current_user.id,
            order_id=order_id,
            content=form.message.data

        )
        db.session.add(message)
        db.session.commit()

    return message
