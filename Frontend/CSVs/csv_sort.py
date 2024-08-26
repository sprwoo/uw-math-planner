import csv

def sort_csv(input_file, output_file):
    # Read the CSV file
    with open(input_file, mode='r', newline='', encoding='utf-8') as csvfile:
        reader = csv.reader(csvfile)
        header = next(reader)  
        sorted1 = sorted(reader, key=lambda row: row[1])
        sorted2 = sorted(sorted1, key=lambda row: row[0])
    
    # Write the sorted rows to a new CSV file
    with open(output_file, mode='w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(header)  
        writer.writerows(sorted2)  

input_file = 'CSVs/major_requirements.csv'
output_file = 'CSVs/major_requirements.csv'
sort_csv(input_file, output_file)

print("Done!")