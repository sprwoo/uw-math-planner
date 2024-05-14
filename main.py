from scraper import *

with open("test.csv", 'w', newline='', encoding='utf-8') as file:
    for y in range(2019,2024):
        years = str(y) + "-" + str(y + 1)

        major_list = get_majors(years)
        course_requirement_list = []
        for major in major_list:
            courses = get_courses(major)
            file.write(years + "," + str(major) + ",\"" + str(courses) + "\"\n")
    