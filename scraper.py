from bs4 import BeautifulSoup
import requests
import pandas as pd
import re

def is_valid_course(course_code):
    pattern = r'^[A-Za-z]{2,}\s\d{3}[A-Za-z]?$'
    return re.match(pattern, course_code, re.IGNORECASE) is not None

# Returns all the availiable majors for a year
def get_majors(year):
    # Set up URL
    url_for_list = "https://academic-calendar-archive.uwaterloo.ca/undergraduate-studies/" + year + "/page/MATH-List-of-Academic-Programs-or-Plans.html"
    #print(url_for_list)

    # Set up BeautifulSoup
    listpage = requests.get(url_for_list)
    listsoup = BeautifulSoup(listpage.text, "lxml")

    # Get all the names
    major_names = listsoup.find_all('a')

    # Remove everything before "Amendments"
    i = 0
    for name in major_names:
        if "Amendments" in name.get_text():
            break
        i += 1
    major_names = major_names[i + 1:]

    # Print
    '''for name in major_names:
        print(name.get_text())'''

    return major_names

# Returns the course requirements for a specific degree
def get_courses(degree):
    # Set up URL
    link_header = "https://academic-calendar-archive.uwaterloo.ca"
    choice_url = link_header + degree.get('href')

    # Set up BeautifulSoup
    choice_page = requests.get(choice_url)
    choice_soup = BeautifulSoup(choice_page.text, 'lxml')
    choice_courses = choice_soup.find_all('a')

    # Filter out invalid courses
    tmp = {}
    for course in choice_courses:
        if is_valid_course(course.get_text()):
            tmp[course.get_text()] = course.get('href')
    choice_courses = tmp

    # Print
    '''for name in choice_courses:
        print(name.get_text())
        print(name.get('href'))'''
    return choice_courses

def get_minors(year):
    # Get Minors/Certifications/Options/Diplomas
    # Set up URL
    minor_url = "https://academic-calendar-archive.uwaterloo.ca/undergraduate-studies/" + year + "/page/Minors-Options-Diplomas-Certificates.html"

    # Set up BeautifulSoup
    minor_page = requests.get(minor_url)
    minor_soup = BeautifulSoup(minor_page.text, 'lxml')
    minor_names = minor_soup.find_all('a')

    # Get rid of everything before admendments and a few others
    i = 0
    for name in minor_names:
        if "Amendments" in name.get_text():
            break
        i += 1
    minor_names = minor_names[i + 5:]

    # Print
    '''for name in minor_names:
    print(name.get_text())'''

    return minor_names