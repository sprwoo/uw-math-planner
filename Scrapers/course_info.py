from mainscraper import setup_bs, get_info
import csv, re
from typing import IO

titles = set()
NUMS = "0123456789"
REGEX = "[A-Z]{2,}(?= \\d{3})"

def get_titles(file: IO, fieldnames: list[str]) -> None:
    reader = csv.DictReader(file, delimiter=',', fieldnames=fieldnames)
    next(reader) # Skip headers
    
    for row in reader:
        matches = re.findall(REGEX, row['Requirements'])
        
        for match in matches:
            titles.add(match)

with open("./CSVs/major_requirements.csv", 'r', newline='', encoding='utf-8') as file:
    fieldnames = ["Major","Year","Link","Requirements"]
    get_titles(file, fieldnames)
    

with open("./CSVs/minor_requirements.csv", 'r', newline='', encoding='utf-8') as file:
    fieldnames = ["Minor","Year","Link","Requirements"]
    get_titles(file, fieldnames)

sorted_titles = list(titles)
sorted_titles.sort()
print(sorted_titles)

with open("./CSVs/course_info.csv", 'w', newline='', encoding='utf-8') as file:
    file.write("Course,Name,Description,Notes,Prerequisites,Corequisites,Antirequisites\n")
    for title in sorted_titles:
        soup = setup_bs("https://ucalendar.uwaterloo.ca/2324/COURSE/course-" + title + ".html")
        soup = soup.find_all('center')
        for req in soup:
            code, name, desc, note, prereq, coreq, antireq = get_info(req)
            file.write(code + ',"' + name + '","' + desc + '","' + note + '","' + prereq + '","' + coreq + '","' + antireq + '"\n')
    