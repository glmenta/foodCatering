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

@message_routes.route('/send-to-customer/<int:order_id>', methods=['GET', 'POST'])
@login_required
def send_message_to_customer(order_id):
    form = MessageForm()

    if not current_user.isAdmin:
        return jsonify({'error': 'Only admins can send messages to customers'}), 401

    order = Order.query.get(order_id)

    if not order:
        return jsonify({'error': 'Order not found'}), 404

    if not current_user.isAdmin and order.user_id != current_user.id:
        return jsonify({'error': 'You do not have permission to access this order'}), 403

    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        message = Message(
            sender_id=current_user.id,
            receiver_id=order.user_id,
            order_id=order_id,
            content=form.message.data
        )
        db.session.add(message)
        try:
            db.session.commit()
            return jsonify({'message': 'Message sent to customer!', 'sent_message': message.to_dict(), 'order': order.to_dict()}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': 'Failed to send message. Error: {}'.format(str(e))}), 500
    else:
        return jsonify({'errors': form.errors}), 400

# send message to admin
@message_routes.route('/send-to-admin/<int:order_id>', methods=['GET', 'POST'])
@login_required
def send_message_to_admin(order_id):
    form = MessageForm()
    order = Order.query.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    if not order.user_id != current_user.id:
        return jsonify({'error': 'This order does not belong to you'}), 403

    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        message = Message(
            sender_id=current_user.id,
            receiver_id=1,
            order_id=order_id,
            content=form.message.data
        )
        db.session.add(message)
        try:
            db.session.commit()
            return jsonify({'message': 'Message sent to admin!', 'sent_message': message.to_dict()}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': 'Failed to send message. Error: {}'.format(str(e))}), 500
    else:
        return jsonify({'errors': form.errors}), 400
