import dbutil
import os.path
import sqlite3
from flask import Flask, redirect, json
from sqlite3 import Error

app = Flask(__name__)
crash_list = None

@app.route('/')
def home():
    # redirect to crashes
    if (crash_list):
        return redirect("/crashes")
    
    return redirect("/refresh")

@app.route('/crashes')
def crashes():
    return json.jsonify(crash_list)

@app.route('/refresh')
def refresh():
    global crash_list

    pwd_path = os.path.os.path.abspath(os.path.dirname(__file__))
    db_path = os.path.join(pwd_path, '../db/crashes.db')
    conn = None

    try:
        conn = dbutil.connect(db_path)
        crash_list = dbutil.get_all_crashes(conn)

    except Error as e:
        print(e)
    finally:
        if (conn):
            conn.close()

    return redirect('/crashes')

if __name__ == '__main__':
    app.run()

    #print(refresh())
