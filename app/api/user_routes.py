from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import User
from app.models.order import Order
from app.models.foodinfo import Food, FoodOrder
from app.forms.order_form import FoodOrderForm
from app.models.message import Message
from ..models.db import db
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

@user_routes.route('/<int:id>/foodorders', methods=['GET'])
@login_required
def user_foodorders(id):
    user = User.query.get(id)
    if user is None:
        return jsonify({'error': 'User not found'}), 404
    user_foodorders = FoodOrder.query.filter(FoodOrder.user_id == id).all()
    return {'food_orders': [foodorder.to_dict() for foodorder in user_foodorders]}

@user_routes.route('/<int:id>/foodorders/new', methods=['POST'])
@login_required
def create_food_order(id):
    user = User.query.get(id)

    # Check if the user exists
    if user is None:
        return jsonify({'error': 'User not found'}), 404

    # Check if the current user is the owner of the requested user's data
    if user.id != current_user.id:
        return jsonify({'error': 'You cannot add food to another user\'s order'}), 401

    # Get the JSON data from the request
    foodorder_data = request.get_json()

    # Create the form instance with the provided data
    form = FoodOrderForm(food_menu_id=foodorder_data.get('menu_id'), foodorder_data=foodorder_data)
    form['csrf_token'].data = request.cookies['csrf_token']

    print('Request Data:', request.get_json())
    print('Available Choices:', form.food.choices)
    # Validate the form
    if form.validate():
        # Retrieve the selected food and quantity from the form
        selected_food_id = form.food.data
        quantity = form.quantity.data

        # Create a new FoodOrder instance
        new_food_order = FoodOrder(
            food_id=selected_food_id,
            user_id=user.id,
            menu_id=foodorder_data.get('menu_id'),
            order_id=None,  # Since there's no order_id yet
            quantity=quantity
        )

        db.session.add(new_food_order)
        db.session.commit()
        return jsonify({'message': 'Food order created successfully', 'food_order': new_food_order.to_dict()}), 201
    else:
        return jsonify({'error': 'Form validation failed', 'errors': form.errors}), 400

@user_routes.route('/<int:user_id>/foodorders/<int:id>', methods=['DELETE'])
@login_required
def delete_food_order(user_id, id):
    food_order = FoodOrder.query.get(id)
    user = User.query.get(user_id)
    if food_order is None:
        return jsonify({'error': 'Food order not found'}), 404
    if food_order.user_id != current_user.id or user.id != current_user.id:
        return jsonify({'error': 'You cannot delete another user\'s food order'}), 401
    db.session.delete(food_order)
    db.session.commit()

    return {'message': 'Food order deleted successfully'}, 200

@user_routes.route('/<int:id>/reviews', methods=['GET'])
@login_required
def user_reviews(id):
    user = User.query.get(id)
    if user is None:
        return jsonify({'error': 'User not found'}), 404
    user_reviews = user.reviews
    return {'reviews': [review.to_dict() for review in user_reviews]}

