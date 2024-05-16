from scraper import *
from typing import Callable

link_header = "https://academic-calendar-archive.uwaterloo.ca"

def scrape(years: int, func: Callable[[int], list[str]]):
    years = str(y) + "-" + str(y + 1)
    degree_list = func(years)
    for degree in degree_list:
        if degree.get('href') is None:
            continue

        name = degree.get_text().strip()
        name = name.replace(',', '')

        link = degree.get('href').strip()

        courses = get_courses(degree)
        if not courses:
            courses = "Could not find courses associated with this degree :(. Check the official Undergraduate Calendar."
        file.write(years + "," + name + "," + link_header + link + ",\"" + str(courses) + "\"\n")

with open("UW-Undergrad-Calendar/CSVs/course_requirements.csv", 'w', newline='', encoding='utf-8') as file:
    file.write("Year,Offered Major,Link,Course Requirements\n")
    for y in range(2019,2024):
        scrape(y, get_majors)
    
with open("UW-Undergrad-Calendar/CSVs/minor_requirements.csv", 'w', newline='', encoding='utf-8') as file:
    file.write("Year,Offered Minor,Link,Course Requirements\n")
    for y in range(2019, 2024):
        scrape(y, get_minors)