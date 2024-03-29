from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    first_name = db.Column(db.String(255), nullable=True)
    last_name = db.Column(db.String(255), nullable=True)
    isAdmin = db.Column(db.Boolean, nullable=True, default=False)
    hashed_password = db.Column(db.String(255), nullable=False)

    sent_messages = db.relationship('Message', back_populates='sender', cascade='all, delete-orphan', lazy=True, foreign_keys='Message.sender_id')
    received_messages = db.relationship('Message', back_populates='receiver', cascade='all, delete-orphan', lazy=True, foreign_keys='Message.receiver_id')

    # relationships
    orders = db.relationship('Order', back_populates='users', cascade='all, delete-orphan')
    reviews = db.relationship('Review', back_populates='user', cascade='all, delete-orphan')
    foods = db.relationship('Food', back_populates='user', cascade='all, delete-orphan')

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'firstName': self.first_name,
            'lastName': self.last_name,
            'isAdmin': self.isAdmin,
            'orders': [order.to_dict() for order in self.orders],
            'foods': [food.to_dict() for food in self.foods],
            'reviews': [review.to_dict() for review in self.reviews],
            'sentMessages': [message.to_dict() for message in self.sent_messages],
            'receivedMessages': [message.to_dict() for message in self.received_messages]
        }
