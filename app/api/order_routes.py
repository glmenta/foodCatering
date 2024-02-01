from flask import Blueprint, jsonify, request
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
    # from this point so far, I have the order => need to find food_orders thru order_id
    user_orders = FoodOrder.query.filter(FoodOrder.order_id == order.id).all()
    # # from food_order, menu_id => food menu => has the available food
    # food_menu = FoodMenu.query.filter(FoodMenu.id == user_order.food_menu_id).first()
    # # add food from food_menu to food_order => add food_order to order
    # available_food = Food.query.filter(Food.id == food_menu.food_id).all()
    for user_order in user_orders:
        food_menu = FoodMenu.query.filter(FoodMenu.id == user_order.food_menu_id).first()
        available_food = Food.query.filter(Food.id == food_menu.food_id).all()
    order_data = request.get_json()
    food_menu_id = food_menu.ID
    form = FoodOrderForm(food_menu_id=food_menu_id)
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate():
        selected_food_id = form.food.data
        print('Selected food ID:', selected_food_id)
        existing_food = Food.query.get(selected_food_id)

        if existing_food is None:
            return jsonify({'error': 'Food not found'}), 404

        quantity = form.quantity.data
        food_order = FoodOrder(food=existing_food, quantity=quantity)
        order.food_orders.append(food_order)

        db.session.commit()

        return jsonify({'success': 'Food added to order successfully', 'order': order.to_dict()})





#add food to order if userId matches order userId
#delete food from order if userId matches order userId
#delete order if userId matches order userId
    # form = FoodOrderForm(food_menu_id=id)
    # form['csrf_token'].data = request.cookies['csrf_token']
    # if form.validate():
    #     selected_food_id = form.food.data
    #     print('Selected food ID:', selected_food_id)
    #     existing_food = Food.query.get(selected_food_id)

    #     if existing_food is None:
    #         return jsonify({'error': 'Food not found'}), 404

    #     quantity = form.quantity.data
    #     food_order = FoodOrder(food=existing_food, quantity=quantity)
    #     order.food_orders.append(food_order)

    #     db.session.commit()

    #     return jsonify({'success': 'Food added to order successfully', 'order': order.to_dict()})
