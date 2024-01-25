from app.models.order import Order, db, environment, SCHEMA
from sqlalchemy.sql import text

def seed_orders():
    order1 = Order(
        user_id = 1,
        order_name = 'test order 1'
    )
    order2 = Order(
        user_id = 1,
        order_name = 'test order 2'
    )
    order3 = Order(
        user_id = 2,
        order_name = 'test order 3'
    )

    db.session.add(order1)
    db.session.add(order2)
    db.session.add(order3)
    db.session.commit()

def undo_orders():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.orders RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM orders"))

    db.session.commit()
