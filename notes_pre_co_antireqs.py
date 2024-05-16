from scraper import *

with open("UW-Undergrad-Calendar/CSVs/notes-pre-co-anti-req.csv", 'w', newline='', encoding='utf-8') as file:
    file.write("Name,Description,Notes,Prerequisites,Corequisites,Antirequisites\n")
    # courses = get_prereq("https://ucalendar.uwaterloo.ca/2324/COURSE/course-CO.html")
    reqs_soup = get_bs("https://ucalendar.uwaterloo.ca/2324/COURSE/course-CO.html", 'center')
    for req in reqs_soup:
        name, desc, note, prereq, coreq, antireq = get_prereq(req)
        file.write(name + ',\"' + desc + '\",\"' + note + '\",\"' + prereq + '\",\"' + coreq + '\",\"' + antireq + "\"\n")