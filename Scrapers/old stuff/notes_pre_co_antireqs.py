from old_scraper import *
import csv
from typing import IO

def get_sections(file: IO, fieldnames: list[str]) -> None:
    reader = csv.DictReader(file, delimiter=',', fieldnames=fieldnames)
    next(reader) # Skip headers
    
    nums = "0123456789"
    
    for row in reader:
        courses = ''

        pre_num = False
        for letter in row['Course Requirements']:
            if letter == '\'' or letter == ' ' or letter == '[':
                continue
            elif letter in nums:
                pre_num = True;
            elif letter == ']':
                break
            elif pre_num == True:
                pre_num == False
                continue
            else:
                courses += letter

        courses = courses.split(",")
        for course in courses:
            if course == "Couldnotfindcoursesassociatedwiththisdegree:(.ChecktheofficialUndergraduateCalendar.":
                continue
            sections.add(course)

sections = set()
with open("course_requirements.csv", 'r', newline='', encoding='utf-8') as file:
    fieldnames = ["Year","Offered Major","Link","Course Requirements"]
    get_sections(file, fieldnames)
    

with open("minor_requirements.csv", 'r', newline='', encoding='utf-8') as file:
    fieldnames = ["Year","Offered Minor","Link","Course Requirements"]
    get_sections(file, fieldnames)

print(sections)
with open("course_info.csv", 'w', newline='', encoding='utf-8') as file:
    file.write("Course Code,Name,Description,Notes,Prerequisites,Corequisites,Antirequisites\n")
    for section in sections:
        soup = get_bs("https://ucalendar.uwaterloo.ca/2324/COURSE/course-" + section + ".html", 'center')
        for req in soup:
            code, name, desc, note, prereq, coreq, antireq = get_info(req)
            file.write(code + ',"' + name + '","' + desc + '","' + note + '","' + prereq + '","' + coreq + '","' + antireq + '"\n')

            # Fix random newlines (FIXED, FUCK CRLF CHARACTERS)
