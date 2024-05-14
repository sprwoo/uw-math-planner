import urllib.request
from urllib.request import urlopen
from bs4 import BeautifulSoup
from requests_html import HTMLSession
import pandas as pd
import re
import csv
from scraper import *

for y in range(2019,2024):
    years = str(y) + "-" + str(y + 1)
    csvname = years + ".csv"
    #file = open(csvname, 'a')
    #file.write("Major,Courses\n")

    major_list = get_majors(years)
    course_requirement_list = []
    for major in major_list:
        courses = get_courses(major)
        course_requirement_list.append(courses)
    data = {
        "majors" : major_list,
        "Courses": course_requirement_list
    }
    df = pd.DataFrame(data)

    df.to_csv(csvname, index=False)
