import csv
import psycopg2
import os
from dotenv import load_dotenv, dotenv_values

load_dotenv()

# RDS connection details
rds_host = os.getenv("DB_HOST")
rds_data = os.getenv("DB_NAME")
rds_user = os.getenv("DB_USER")
rds_password = os.getenv("DB_PASS")

try:
    # Connect to the PostgreSQL server
    connect = psycopg2.connect(
        host = rds_host,
        database = rds_data,
        user = rds_user,
        password = rds_password,
        port = 5432,
    )
    connect.autocommit=True

    cursor = connect.cursor()
    print("Connected!")

    insert_query = "SELECT * FROM major_courses"
    cursor.execute(insert_query)
    rows = cursor.fetchall()
    for row in rows:
        print(row)
    print("DONE!")

    # Close connections
    cursor.close()
    connect.close()

except Exception as e:
    print(f"Failed! {e}")
