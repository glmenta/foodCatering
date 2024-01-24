from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Food(db.Model):
    __tablename__ = 'foods'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(255), nullable=False)
    isActive = db.Column(db.Boolean, nullable=False, default=True)

    food_orders = db.relationship('FoodOrder', back_populates='food', cascade="all, delete")
    food_images = db.relationship('FoodImage', back_populates='food', cascade="all, delete")
    food_menus = db.relationship('FoodMenu', secondary='food_menu_foods', back_populates='foods')
    created_at = db.Column(db.DateTime, nullable=False)
    updated_at = db.Column(db.DateTime, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'price': self.price,
            'description': self.description,
            'isActive': self.isActive,
            'food_images': [foodImage.to_dict() for foodImage in self.food_images],
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }

class FoodMenu(db.Model):
    __tablename__ = 'food_menus'

    id = db.Column(db.Integer, primary_key=True)
    day_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('days.id')), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.now)

    foods = db.relationship('Food', secondary='food_menu_foods', back_populates='food_menus')
    day = db.relationship('Day', back_populates='food_menu')

    def to_dict(self):
        return {
            'id': self.id,
            'day_id': self.day_id,
            'day': self.day.to_dict(),
            'foods': [food.to_dict() for food in self.foods],
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }

class FoodOrder(db.Model):
    __tablename__ = 'food_orders'

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('orders.id')), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.now)

    food = db.relationship('Food', back_populates='food_orders')
    order = db.relationship('Order', back_populates='food_orders')

    def to_dict(self):
        return {
            'id': self.id,
            'order_id': self.order_id,
            'quantity': self.quantity,
            'food': self.food.to_dict(),
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }

class FoodImage(db.Model):
    __tablename__ = 'food_images'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(255), nullable=False)
    food_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('foods.id')), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.now)

    food = db.relationship('Food', back_populates='food_images')

    def to_dict(self):
        return {
            'id': self.id,
            'url': self.url,
            'food_id': self.food_id
        }
