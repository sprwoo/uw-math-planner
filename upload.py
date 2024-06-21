import csv

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

with open('CSVs/course_requirements.csv') as file:
    data = list(csv.reader(file))
    for x in data:
        print(x)
