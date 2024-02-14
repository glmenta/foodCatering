from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired
from app.models import User
class MessageForm(FlaskForm):
    message = StringField('message', validators=[DataRequired()])
    sender = StringField('sender', validators=[DataRequired()])
    recipient = StringField('recipient', validators=[DataRequired()])
    submit = SubmitField('Submit')
