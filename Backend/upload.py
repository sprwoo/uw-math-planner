import csv
import psycopg2
import os
from dotenv import load_dotenv, dotenv_values

load_dotenv()

# RDS connection details
rds_host = os.getenv("host")
rds_data = os.getenv("db")
rds_user = os.getenv("user")
rds_password = os.getenv("password")

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

    # Reset the table
    cursor.execute("DROP TABLE IF EXISTS major_courses")
    table_create = """ create table major_courses(id SERIAL PRIMARY KEY, Major text, Year text, Link text, Requirements text)   """
    cursor.execute(table_create)

    # Open the CSV and begin writing to database
    with open("CSVs/course_requirements.csv", 'r', newline='', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            insert_query = "INSERT INTO major_courses (Major, Year, Link, Requirements) VALUES (%s, %s, %s, %s)"
            print(row["Major"], row["Year"], row["Link"], row["Requirements"])
            cursor.execute(insert_query, (row["Major"], row["Year"], row["Link"], row["Requirements"]))
    print("DONE!")

    # Close connections
    cursor.close()
    connect.close()

except Exception as e:
    print(f"Failed! {e}")
