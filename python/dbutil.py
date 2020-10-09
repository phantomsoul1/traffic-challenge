import sqlite3
from sqlite3 import Error

def connect(db_file):
    conn = None

    try:
        conn = sqlite3.connect(db_file)
    except Error as e:
        print(e)

    return conn

def create_table(conn, sql):
    try:
        c = conn.cursor()
        c.execute(sql)
    except Error as e:
        print(e)

def add_crash(conn, crash):
    """
    conn: sqlite3 connection object
    crash: a list of values to insert as a crash record
    """
    sql = "" # create sql insert statement here with ? parameters
    
    try:
        cur = conn.cursor()
        cur.execute(sql, crash)
    except Error as e:
        print(e)

    return cur.lastrowid

def get_all_crashes(conn):
    """
    conn: sqlite3 connection object
    """
    sql = "" # create sql select statement here with all columns
    rows = None

    try:
        cur = conn.cursor()
        cur.execute(sql)

        rows = cur.fetchall()
    except Error as e:
        print(e)

    return rows
    