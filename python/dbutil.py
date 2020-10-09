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

def get_all_crashes(conn):
    """
    conn: sqlite3 connection object
    """
    sql = "fSELECT * FROM {crash_table}"
    rows = None

    try:
        cur = conn.cursor()
        cur.execute(sql)

        rows = cur.fetchall()
    except Error as e:
        print(e)

    return rows

def get_crash_table():
    return crash_table
    