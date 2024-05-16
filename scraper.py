from bs4 import BeautifulSoup
import requests
import pandas as pd
import re

def is_valid_course(course_code):
    pattern = r'^[A-Za-z]{2,}\s\d{3}[A-Za-z]?$'
    return re.match(pattern, course_code, re.IGNORECASE) is not None

# Sets up BeautifulSoup
# url is the url to scrape for, find is the header we want to look for
def get_bs(url, find):
    url_page = requests.get(url)
    url_soup = BeautifulSoup(url_page.text, 'lxml')
    url_courses = url_soup.find_all(find)
    return url_courses

# Prints out the list of majors/minors/courses
def __repr(names):
    for name in names:
        print(name.get_text())
        print(name.get('href'))

def print_if_exists(check):
    if check:
        print(check)

# Returns all the availiable majors for a year
def get_majors(year):
    # Set up URL
    url_for_list = "https://academic-calendar-archive.uwaterloo.ca/undergraduate-studies/" + year + "/page/MATH-List-of-Academic-Programs-or-Plans.html"
    #print(url_for_list)

    # Get all the names
    major_names = get_bs(url_for_list, 'a')

    # Remove everything before "Amendments"
    i = 0
    for name in major_names:
        if "Amendments" in name.get_text():
            break
        i += 1
    major_names = major_names[i + 1:]

    # __repr(major_names)

    return major_names

# Returns the course requirements for a specific degree
def get_courses(degree):
    # Set up URL
    link_header = "https://academic-calendar-archive.uwaterloo.ca"
    choice_url = link_header + degree.get('href')

    # Set up BeautifulSoup
    choice_courses = get_bs(choice_url, 'a')

    # Filter out invalid courses
    tmp = {}
    for course in choice_courses:
        if is_valid_course(course.get_text()):
            tmp[course.get_text()] = course.get('href')
    choice_courses = tmp

    # __repr(choice_courses)
    return choice_courses

def get_minors(year):
    # Get Minors/Certifications/Options/Diplomas
    # Set up URL
    minor_url = "https://academic-calendar-archive.uwaterloo.ca/undergraduate-studies/" + year + "/page/Minors-Options-Diplomas-Certificates.html"

    # Set up BeautifulSoup
    minor_names = get_bs(minor_url, 'a')

    # Get rid of everything before admendments and a few others
    i = 0
    for name in minor_names:
        if "Amendments" in name.get_text():
            break
        i += 1
    minor_names = minor_names[i + 5:]

    # __repr(minor_names)
    return minor_names

def get_prereq(req):
    code = req.find('a').get('name')

    name = req.find_all(class_='divTableCell colspan-2')
    desc = name[1].get_text()
    name = name[0].get_text()
    
    info = req.find_all('em')
    
    note = info[0].get_text().strip()
    prereq = ''
    coreq = ''
    antireq = ''
    for tag in info:
        if ("Prereq" in tag.get_text()):
            prereq = tag.get_text().strip()
        if ("Coreq" in tag.get_text()):
            coreq = tag.get_text().strip()
        if ("Antireq" in tag.get_text()):
            antireq = tag.get_text().strip()
    
    '''print(name)
    print(code)
    print(desc)
    print_if_exists(note)
    print_if_exists(prereq)
    print_if_exists(coreq)
    print_if_exists(antireq)
    print("\n")'''

    return name, desc, note, prereq, coreq, antireq