# traffic-challenge
A look into recent traffic accident information

Dataset provided by Kaggle on the following link:
https://www.kaggle.com/sobhanmoosavi/us-accidents

## ETL
The ETL process is governed by the script in `/python/ingest_crashes.py`.

To update the crashes database located at `/db/crahses.db`, ensure the target source data is in the `/csvfiles/traffic_crashes.csv` file and then run this script. It will report on how many values are added for each column.

_This ETL only needs to be run if the contents of `/csvfiles/traffic_crashes.csv` changes._

### Dependecies
* Python 3.7
* Traffic Crash data in `/csvfiles/traffic_crashes.csv`
* Pandas (`pip install pandas`)
* SQLite (`pip install sqlite3`)

## Rest API
A development version of the REST API is available in /python/publish_crashes.py. Run this script to set up a dev web server with the following 3 routes:

* `/`: Redirects to `/refresh` the first time this is run; to `/crashes` otherwise
* `/crashes`: Returns crashes as a JSON object
* `/refresh`: Refreshes the crashes from the database before redirecting to `/crashes`

We should look into a way to more-durably publish this before presenting, but this will get us started with our vizzes.

### Dependencies
* Python 3.7
* A `/db/crashes.db` file with at least an empty `crash` table.
    * See the ETL section above for details
* SQLAlchemy (`pip install SQLAlchemy`)
* SQLite (`pip install sqlite3`)
* Flask CORS (`pip install flask-cors`)
