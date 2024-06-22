import csv
import psycopg2
import os
from dotenv import load_dotenv, dotenv_values

# Had to change the orders
# with open('CSVs/course_requirements.csv') as file:
#     data = list(csv.reader(file))
    
# with open('CSVs/course_requirements.csv', 'w', newline='') as file:
#     csv_output = csv.writer(file)
    
#     for row in data:
#         csv_output.writerow([row[1], row[0], row[2], row[3]])

# with open('CSVs/minor_requirements.csv') as file:
#     data = list(csv.reader(file))
    
# with open('CSVs/minor_requirements.csv', 'w', newline='') as file:
#     csv_output = csv.writer(file)
    
#     for row in data:
#         csv_output.writerow([row[1], row[0], row[2], row[3]])

load_dotenv()

# RDS connection details
rds_host = os.getenv("host")
rds_data = os.getenv("db")
rds_user = os.getenv("user")
rds_password = os.getenv("password")

try :
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

    table_create = """ create table customerInfo(id SERIAL PRIMARY KEY, name text, age float )   """
    cursor.execute(table_create)

    insert_query = """insert into customerInfo (name, age) values ('abc', 22)  """
    cursor.execute(insert_query)
    print("DONE!")

    connect.close()

except Exception as e:
    print(f"Failed! {e}")

# insert_query = "INSERT INTO table (name, years, link, requirements) VALUES (%s, %s, %s, %s)"
# cursor.execute(insert_query, 
#                r"Actuarial Science,2022-2023,\
#                https://academic-calendar-archive.uwaterloo.ca/undergraduate-studies/2022-2023/page/MATH-Actuarial-Science1.html, things")

# connect.commit()
# print("Success!")

# cursor.close()
# connect.close()

# with open('CSVs/course_requirements.csv') as file:
#     data = list(csv.reader(file))[1:]
#     for x in data:
#         insert_query = "INSERT INTO table (name, years, link, requirements) VALUES (%s, %s, %s, %s)"
    
