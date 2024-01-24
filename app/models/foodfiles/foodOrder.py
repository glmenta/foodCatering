from ..db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime
class FoodOrder(db.Model):
    __tablename__ = 'food_orders'

    id = db.Column(db.Integer, primary_key=True)
    food_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('foods.id')), nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('orders.id')), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)

    food = db.relationship('Food', back_populates='food_orders')
    order = db.relationship('Order', back_populates='food_orders')

    def to_dict(self):
        return {
            'id': self.id,
            'food_id': self.food_id,
            'order_id': self.order_id,
            'quantity': self.quantity,
            'food': self.food.to_dict()
        }
