from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired
from app.models.order import Order

class OrderForm(FlaskForm):
    order_name = StringField('order_name', validators=[DataRequired()])
    submit = SubmitField('Submit')
