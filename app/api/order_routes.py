from flask import Blueprint, jsonify
from app.models.order import Order
from flask_login import login_required

order_routes = Blueprint('orders', __name__)

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

#create order
#update order if userId matches order userId
#add food to order if userId matches order userId
#delete food from order if userId matches order userId
#delete order if userId matches order userId
