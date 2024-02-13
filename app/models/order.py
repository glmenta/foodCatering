# id, user_id, name, createdAt/updated At
# food_id => foodOrder, order_id

from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Order(db.Model):
    __tablename__ = 'orders'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    order_name = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.now)



    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'order_name': self.order_name,
            'createdAt': self.created_at,
            'updatedAt': self.updated_at,
            'foodOrders': [foodOrder.to_dict() for foodOrder in self.food_orders]
        }

    users = db.relationship('User', back_populates='orders')
    food_orders = db.relationship('FoodOrder', back_populates='orders', cascade="all, delete-orphan")
    messages = db.relationship('Message', back_populates='order', cascade="all, delete-orphan")
