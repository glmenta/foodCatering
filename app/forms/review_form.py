from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, IntegerField
from wtforms.validators import InputRequired, NumberRange

class ReviewForm(FlaskForm):
    rating = IntegerField('Rating', validators=[InputRequired(), NumberRange(min=1, max=5)])
    review = StringField('Review', validators=[InputRequired()])
    submit = SubmitField('Submit')
