import sqlite3
from sqlite3 import Error

crash_table = 'crash'

def connect(db_file):
    conn = None

    try:
        conn = sqlite3.connect(db_file)
    except Error as e:
        print(e)

    return conn

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

def get_all_crashes(conn):
    """
    conn: sqlite3 connection object
    """
    sql = f"SELECT * FROM {crash_table}"

    try:
        conn.row_factory = dict_factory
        cur = conn.cursor()
        cur.execute(sql)

        rows = cur.fetchall()

    except Error as e:
        print(e)

    return rows

def get_crash_table():
    return crash_table

    