from scraper import *

with open("UW-Undergrad-Calendar/course_requirements.csv", 'w', newline='', encoding='utf-8') as file:
    file.write("Year,Offered Major,Course Requirements\n")
    for y in range(2019,2024):
        years = str(y) + "-" + str(y + 1)

        major_list = get_majors(years)
        course_requirement_list = []
        for major in major_list:
            courses = get_courses(major)
            major_name = str(major)
            major_name = major_name.replace('<br/>\n', '')
            file.write(years + "," + major_name + ",\"" + str(courses) + "\"\n")
    