import sqlite3
from sqlite3 import Error

# set the target name for the crash table
crash_table = 'crash'

# connects to a sqlite database at the specified path, creating one if necessary
def connect(db_file):
    conn = None

    try:
        conn = sqlite3.connect(db_file)
    except Error as e:
        print(e)

    return conn

# function to return each row as a dictionary of column-name: column-value pairs
# (runs once for each row returned in the results)
def dict_factory(cursor, row):
    # define a dictionary
    d = {}

    # iterate through the column names
    for idx, col in enumerate(cursor.description):

        # add each name/value pair to the dictionary
        # col[0] is the column name, row[idx] is the column value
        d[col[0]] = row[idx]
    
    # return the dictionary representing this row
    return d

# get all crashes in the database
def get_all_crashes(conn):
    """
    conn: sqlite3 connection object
    """
    
    # sql statement, incorporating the table name described above
    sql = f"SELECT * FROM {crash_table} limit 1000"

    try:

        # use the row factory described above
        conn.row_factory = dict_factory
        
        # execute the sql statement
        cur = conn.cursor()
        cur.execute(sql)

        # get all rows
        rows = cur.fetchall()

    except Error as e:
        
        # print any error encountered
        print(e)

    # do not close on finalize here; since conn object is passed in
    # as a parameter, we expect the caller to take care of that

    # return the result
    return rows

# gets the name of the crash table
def get_crash_table():
    return crash_table

    