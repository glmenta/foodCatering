from .db import db , environment, SCHEMA, add_prefix_for_prod
from datetime import datetime
class Day(db.Model):
    __tablename__ = 'days'

    id = db.Column(db.Integer, primary_key=True)
    day = db.Column(db.String(255), nullable=False)

    food_menu = db.relationship('FoodMenu', back_populates='day', cascade="all, delete")

    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.now)

    def to_dict(self):
        return {
            'id': self.id,
            'day': self.day,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
