import sqlite3

conn = sqlite3.connect('food_database.db')

cursor = conn.cursor()

cursor.execute('''
    CREATE TABLE IF NOT EXISTS meals (
        id INTEGER PRIMARY KEY,
        mealName TEXT,
        price INTEGER
    )
''')

conn.commit()
conn.close()