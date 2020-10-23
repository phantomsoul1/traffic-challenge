import dbutil
import os.path
import sqlite3
from flask import Flask, redirect, request, Response, json, url_for
from flask_cors import CORS
from sqlite3 import Error

#set up flask app
app = Flask(__name__)
cors = CORS(app)

#global crash list - we don't need to reload this every time its requested
crash_list = None
county = None
month = None

def validate():
    global county, month
    
    if (request.method == 'GET'):
        c = request.args.get("county")
        if (c):
            c = c.lower()

        m = request.args.get("month")
        if (m):
            m = m.lower()

        if (crash_list and c == county and m == month):
            return True

    county = c
    month = m

    return False

# default route; redirect to refresh if crash list is not define or to crashes otherwise
@app.route('/')
def home():
    # redirect to crashes if defined
    if (validate()):
        return redirect(url_for("crashes", county = county, month = month))
    
    # otherwise refresh the crash list first
    return redirect(url_for("refresh", county = county, month = month))

# return the crash list
@app.route('/crashes')
def crashes():

    if (validate()):
        return Response(json.dumps(crash_list),  mimetype='application/json')

    # return the crash list as a json object
    return redirect("/refresh")

# refresh the crash list and the redirect to showing the results
@app.route('/refresh')
def refresh():

    # (this is where the sausage is made...)
    # set crash_list to global so we update the global one for the other routes
    global county, month, crash_list

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
        crash_list = dbutil.get_crashes(conn, county, month)

    except Error as e:

        # if there's an error, show it
        print(e)
    finally:

        # if a connection is defined, close it
        if (conn):
            conn.close()

    # redirect to crashes to show the result
    return redirect(url_for('crashes', county = county, month = month))

@app.route('/all')
def all():

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
    return Response(json.dumps(crash_list),  mimetype='application/json')


if __name__ == '__main__':
    app.run()
