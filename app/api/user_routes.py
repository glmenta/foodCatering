from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import User
from app.models.order import Order

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    if user is None:
        return jsonify({'error': 'User not found'}), 404
    return user.to_dict()

#get all orders by user Id
@user_routes.route('/<int:id>/orders', methods=['GET'])
@login_required
def user_orders(id):
    user = User.query.get(id)
    if user is None:
        return jsonify({'error': 'User not found'}), 404
    user_orders = Order.query.filter(Order.user_id == id).all()

    return {'orders': [order.to_dict() for order in user_orders]}

@user_routes.route('/<int:id>/orders/<int:order_id>', methods=['GET'])
@login_required
def user_order(id, order_id):
    user = User.query.get(id)
    if user is None:
        return jsonify({'error': 'User not found'}), 404
    user_order = Order.query.filter(Order.user_id == id, Order.id == order_id).first()
    if user_order is None:
        return jsonify({'error': 'Order not found'}), 404
    return user_order.to_dict()

@user_routes.route('/<int:id>/reviews', methods=['GET'])
@login_required
def user_reviews(id):
    user = User.query.get(id)
    if user is None:
        return jsonify({'error': 'User not found'}), 404
    user_reviews = user.reviews
    return {'reviews': [review.to_dict() for review in user_reviews]}
