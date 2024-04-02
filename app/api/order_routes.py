from flask import Blueprint, jsonify, request, current_app
from app.models.order import Order
from app.models.user import User
from app.models.foodinfo import FoodOrder, Food, FoodMenu
from flask_login import login_required, current_user
from ..forms.order_form import OrderForm, FoodOrderForm
order_routes = Blueprint('orders', __name__)
from ..models.db import db
#get all orders
@order_routes.route('/', methods=['GET'])
@login_required
def get_all_orders():
    orders = Order.query.all()
    return {'orders': [order.to_dict() for order in orders]}

#get order by id
@order_routes.route('/<int:id>', methods=['GET'])
@login_required
def get_order_by_id(id):
    order = Order.query.get(id)
    if order is None:
        return jsonify({'error': 'Order not found'}), 404
    return order.to_dict()

#get order by user id
@order_routes.route('/user/<int:id>/orders', methods=['GET'])
@login_required
def get_orders_by_user_id(id):
    user = User.query.get(id)
    if user is None:
        return jsonify({'error': 'User not found'}), 404
    user_orders = Order.query.filter(Order.user_id == id).all()
    return {'orders': [order.to_dict() for order in user_orders]}

#create order
@order_routes.route('/new', methods=['POST'])
@login_required
def create_order():
    # get the user id from the current user
    user_id = current_user.id
    print(user_id)
    # create a new order form with the user id
    order_data = request.get_json()
    order_form = OrderForm(data=order_data)
    order_form['csrf_token'].data = request.cookies['csrf_token']
    if order_form.validate():
        order = Order(
            order_name=order_data.get('order_name'),
            user_id=current_user.id
        )
        db.session.add(order)
        db.session.commit()
        return {'order': order.to_dict()}, 201
    else:
        return jsonify(errors=order_form.errors), 400

@order_routes.route('/<int:order_id>/add/<int:food_order_id>', methods=['PATCH'])
@login_required
def add_food_to_order(order_id, food_order_id):
    user_id = current_user.id

    # Fetch the order and food_order from the database
    order = Order.query.get(order_id)
    food_order = FoodOrder.query.get(food_order_id)

    # Check if the order exists and belongs to the current user
    if not order or order.user_id != user_id:
        return jsonify({'error': 'Order not found or does not belong to the current user'}), 404

    # Check if the food_order exists
    if not food_order:
        return jsonify({'error': 'Food order not found'}), 404

    # Retrieve the quantity from the request JSON
    order_data = request.json
    if not order_data or 'quantity' not in order_data:
        return jsonify({'error': 'Invalid JSON data. Quantity is required'}), 400
    quantity = order_data['quantity']

    # Check if the food_order is already associated with the order
    if food_order.order_id == order_id:
        # Update the quantity of the existing food_order
        food_order.quantity += quantity
    else:
        # Create a new food_order and associate it with the order
        order.food_orders.append(food_order)

    db.session.commit()

    return jsonify({'success': 'Food added to order successfully', 'order': order.to_dict()}), 200




@order_routes.route('/<int:order_id>/delete/<int:food_order_id>', methods=['DELETE'])
@login_required
def remove_food_order_from_order(order_id, food_order_id):
    user_id = current_user.id
    order = Order.query.get(order_id)

    if order is None or order.user_id != user_id:
        return jsonify({'error': 'Order not found or does not belong to the current user'}), 404

    food_order = FoodOrder.query.get(food_order_id)

    if food_order is None or food_order.order_id != order_id:
        return jsonify({'error': 'Food order not found in the specified order'}), 404

    order.food_orders = [order for order in order.food_orders if order.id != food_order_id]

    db.session.commit()

    return jsonify({'message': 'Food order removed from order successfully', 'order': order.to_dict()}), 200

@order_routes.route('/<int:order_id>/update/<int:food_order_id>', methods=['PATCH'])
@login_required
def update_food_order_quantity(order_id, food_order_id):
    user_id = current_user.id
    order = Order.query.get(order_id)

    if order is None or order.user_id != user_id:
        return jsonify({'error': 'Order not found or does not belong to the current user'}), 404

    food_order = FoodOrder.query.get(food_order_id)

    if food_order is None or food_order.order_id != order_id:
        return jsonify({'error': 'Food order not found in the specified order'}), 404

    data = request.get_json()
    quantity_from_data = data.get('quantity')

    if quantity_from_data is None or quantity_from_data <= 0 or not isinstance(quantity_from_data, int):
        return jsonify({'error': 'Invalid quantity value'}), 400

    food_order.quantity = quantity_from_data
    db.session.commit()

    return jsonify({'message': 'Food order quantity updated successfully', 'order': order.to_dict()}), 200
