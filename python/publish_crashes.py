import dbutil
import os.path
import sqlite3
from flask import Flask, redirect, Response, json
from flask_cors import CORS
from sqlite3 import Error

#set up flask app
app = Flask(__name__)
cors = CORS(app)

#global crash list - we don't need to reload this every time its requested
crash_list = None

# default route; redirect to refresh if crash list is not define or to crashes otherwise
@app.route('/')
def home():
    # redirect to crashes if defined
    if (crash_list):
        return redirect("/crashes")
    
    # otherwise refresh the crash list first
    return redirect("/refresh")

# return the crash list
@app.route('/crashes')
def crashes():

    if (crash_list):
        return Response(json.dumps(crash_list),  mimetype='application/json')

    # return the crash list as a json object
    return redirect("/refresh")

# refresh the crash list and the redirect to showing the results
@app.route('/refresh')
def refresh():

    # (this is where the sausage is made...)
    # set crash_list to global so we update the global one for the other routes
    global crash_list

    # get the path to the crashes database
    # (pwd_path enables python to find files within this project)
    pwd_path = os.path.abspath(os.path.dirname(__file__))
    db_path = os.path.join(pwd_path, '../db/crashes.db')
    
    # define a connection variable
    conn = None

    try:

        # connect to sqllite
        conn = dbutil.connect(db_path)

        # get all crashes from sqlite
        crash_list = dbutil.get_all_crashes(conn)

    except Error as e:

        # if there's an error, show it
        print(e)
    finally:

        # if a connection is defined, close it
        if (conn):
            conn.close()

    # redirect to crashes to show the result
    return redirect('/crashes')

if __name__ == '__main__':
    app.run()
