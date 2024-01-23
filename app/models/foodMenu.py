from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class FoodMenu(db.Model):
    __tablename__ = 'food_menus'

    id = db.Column(db.Integer, primary_key=True)
    food_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('foods.id')), nullable=False)
    day_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('days.id')), nullable=False)

    food = db.relationship('Food', back_populates='food_menu')
    day = db.relationship('Day', back_populates='food_menu')
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.now)

    def to_dict(self):
        return {
            'id': self.id,
            'food_id': self.food_id,
            'day': self.day.day,
            'food': self.food.to_dict(),
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
