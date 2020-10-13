import dbutil
import os.path
import pandas as pd
import sqlite3
from sqlite3 import Error

def main():

    file_names = ['traffic_2019_NJ.csv']

    # get absolute path present working directory
    # (this is needed to find other files in this project, like CSV and DB)
    pwd_path = os.path.abspath(os.path.dirname(__file__))
    
    for file_name in file_names:

        # get path to the source CSV file and read to dataframe
        crash_path = os.path.join(pwd_path, f'../csvfiles/{file_name}')
        crashes = pd.read_csv(crash_path)

        # clean up column names to make downstream API and JS easier to work with
        crashes.columns = ['source', 'severity', 'start_time', 'end_time',
        'start_lat', 'start_lng', 'city', 'county', 'state',
        'temperature_f', 'wind_chill_f', 'humidity', 'pressure_in',
        'visibility_mi', 'wind_speed_mph', 'precipitation_in', 
        'weather_condition', 'civil_twilight', 'year', 'month']

        # get path location for the sqlite DB file
        db_path = os.path.join(pwd_path, '../db/crashes.db')
        
        #initialize a connection object for SQL
        conn = None

        try:

            # connect to sqlite db, creating it if necessary
            conn = dbutil.connect(db_path)

            # write the dataframe to the sqlite file, replacing any existing records
            # (this setup will help scale the source dataset size as we get ready to "go live")
            crashes.to_sql(dbutil.get_crash_table(), con=conn, if_exists='replace')

        except Error as e:
            # print any sqlite errors that occur
            print(e)

        finally:
            # if we have an open connection object, close it
            if (conn != None):
                conn.close()

        # report how many crashes are added
        print(f'{crashes.count()} crashes added.')

# run 'main' if this is the file being run
# (this is python's standard entry point pattern)
if __name__ == "__main__":
    main()

