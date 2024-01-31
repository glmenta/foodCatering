from flask import Blueprint, jsonify, request
from app.models.order import Order
from app.models.user import User
from app.models.foodinfo import FoodOrder, Food
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
        return {'order': order.to_dict()}
    else:
        return jsonify(errors=order_form.errors), 400

#add food to order if userId matches order userId
@order_routes.route('/<int:id>/add', methods=['PUT'])
@login_required
def add_food_to_order(id):
    order = Order.query.get(id)
    if order is None:
        return jsonify({'error': 'Order not found'}), 404
    if order.user_id != current_user.id:
        return jsonify({'error': 'You cannot add food to another user\'s order'}), 401

    order_data = request.get_json()
    form = FoodOrderForm(data=order_data)
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        selected_food = [form.food.data]

        existing_food = Food.query.filter(Food.name.in_(selected_food)).first()

        print('existing_food', existing_food)

        quantity = int(form.quantity.data)

    else:
        return jsonify(errors=form.errors), 400

#add food to order if userId matches order userId
#delete food from order if userId matches order userId
#delete order if userId matches order userId
