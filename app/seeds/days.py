# from app.models.day import Day, db, environment, SCHEMA
# from sqlalchemy.sql import text

# def seed_days():
#     day1 = Day(
#         day='Monday'
#     )
#     day2 = Day(
#         day='Tuesday'
#     )
#     day3 = Day(
#         day='Wednesday'
#     )
#     day4 = Day(
#         day='Thursday'
#     )
#     day5 = Day(
#         day='Friday'
#     )
#     day6 = Day(
#         day='Saturday'
#     )
#     day7 = Day(
#         day='Sunday'
#     )
#     db.session.add(day1)
#     db.session.add(day2)
#     db.session.add(day3)
#     db.session.add(day4)
#     db.session.add(day5)
#     db.session.add(day6)
#     db.session.add(day7)
#     db.session.commit()

# def undo_days():
#     if environment == "production":
#         db.session.execute(f"TRUNCATE table {SCHEMA}.days RESTART IDENTITY CASCADE;")
#     else:
#         db.session.execute(text("DELETE FROM days"))

#     db.session.commit()
