import dbutil
import os.path
import pandas as pd
import sqlite3
from sqlite3 import Error

def main():
    pwd_path = os.path.abspath(os.path.dirname(''))
    
    crash_path = os.path.join(pwd_path, '../csvfiles/traffic_crashes.csv')
    crashes = pd.read_csv(crash_path)

    # clean up column names to make downstream API and JS easier to work with
    crashes.columns = ['id', 'source', 'tmc', 'severity', 'start_time', 'end_time',
       'start_lat', 'start_lng', 'end_lat', 'end_lng', 'distance_mi',
       'description', 'number', 'street', 'side', 'city', 'county', 'state',
       'zipcode', 'country', 'timezone', 'airport_code', 'weather_timestamp',
       'temperature_f', 'wind_chill_f', 'humidity', 'pressure_in',
       'visibility_mi', 'wind_direction', 'wind_speed_mph',
       'precipitation_in', 'weather_condition', 'amenity', 'bump', 'crossing',
       'give_way', 'junction', 'no_exit', 'railway', 'roundabout', 'station',
       'stop', 'traffic_calming', 'traffic_signal', 'turning_loop',
       'sunrise_sunset', 'civil_twilight', 'nautical_twilight',
       'astronomical_twilight']

    db_path = os.path.join(pwd_path, '../db/crashes.db')

    with conn as connect(db_path):
        crashes.to_sql(dbutil.crash_table, con=conn, if_exists='replace')

    print(f'{crashes.count()} crashes added.')

if __name__ == "__main__":
    main()

