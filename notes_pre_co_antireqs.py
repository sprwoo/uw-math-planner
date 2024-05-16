from scraper import *

with open("UW-Undergrad-Calendar/CSVs/course_info.csv", 'w', newline='', encoding='utf-8') as file:
    file.write("Course Code,Name,Description,Notes,Prerequisites,Corequisites,Antirequisites\n")
    reqs_soup = get_bs("https://ucalendar.uwaterloo.ca/2324/COURSE/course-CO.html", 'center')
    for req in reqs_soup:
        code, name, desc, note, prereq, coreq, antireq = get_prereq(req)
        file.write(code + ',' + name + ',\"' + desc + '\",\"' + note + '\",\"' + prereq + '\",\"' + coreq + '\",\"' + antireq + "\"\n")
