from flask import Blueprint, jsonify
from app.models.order import Order
from flask_login import login_required

order_routes = Blueprint('orders', __name__)


#get all orders
#update order if userId matches order userId
#add food to order if userId matches order userId
#delete food from order if userId matches order userId
#delete order if userId matches order userId
