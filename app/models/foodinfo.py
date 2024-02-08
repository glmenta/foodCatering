from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Food(db.Model):
    __tablename__ = 'foods'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(255), nullable=False)
    isActive = db.Column(db.Boolean, nullable=False, default=True)

    user = db.relationship('User', back_populates='foods')
    food_orders = db.relationship('FoodOrder', back_populates='food', cascade="all, delete")
    food_images = db.relationship('FoodImage', back_populates='food', cascade="all, delete")
    food_menus = db.relationship('FoodMenu', secondary='food_menu_foods', back_populates='foods')
    # food_menu_foods = db.relationship('food_menu_foods')
    reviews = db.relationship('Review', back_populates='food', cascade="all, delete")

    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.now)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'price': self.price,
            'description': self.description,
            'isActive': self.isActive,
            'food_images': [foodImage.to_dict() for foodImage in self.food_images],
            'reviews': [review.to_dict() for review in self.reviews],
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }

class FoodMenu(db.Model):
    __tablename__ = 'food_menus'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    day_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('days.id')), nullable=True)
    current_menu_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('food_menus.id')), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.now)

    day = db.relationship('Day', back_populates='food_menus')
    foods = db.relationship('Food', secondary='food_menu_foods', back_populates='food_menus')
    food_orders = db.relationship('FoodOrder', back_populates='food_menu')

    def to_dict(self):
        return {
            'id': self.id,
            'day_id': self.day_id,
            'current_menu_id': self.current_menu_id,
            'day': self.day.to_dict() if self.day else None,
            'foods': [food.to_dict() for food in self.foods],
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }


food_menu_foods = db.Table(
    'food_menu_foods',
    db.Column('food_id', db.Integer, db.ForeignKey(add_prefix_for_prod('foods.id'))),
    db.Column('food_menu_id', db.Integer, db.ForeignKey(add_prefix_for_prod('food_menus.id')))
    )


class FoodOrder(db.Model):
    __tablename__ = 'food_orders'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('orders.id')), nullable=True)
    food_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('foods.id')), nullable=False)
    menu_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('food_menus.id')), nullable=True)
    quantity = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.now)

    food = db.relationship('Food', back_populates='food_orders')
    orders = db.relationship('Order', back_populates='food_orders')
    food_menu = db.relationship('FoodMenu', back_populates='food_orders')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'menu_id': self.menu_id,
            'order_id': self.order_id,
            'food_id': self.food_id,
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
    url = db.Column(db.String(500), nullable=False)
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



# class FoodMenuFoods(db.Model):
#     __tablename__ = 'food_menu_foods'

#     if environment == "production":
#         __table_args__ = {'schema': SCHEMA}

#     id = db.Column(db.Integer, primary_key=True)
#     food_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('foods.id')), nullable=False)
#     food_menu_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('food_menus.id')), nullable=False)
#     created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
#     updated_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
