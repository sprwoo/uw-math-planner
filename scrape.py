import urllib.request
from urllib.request import urlopen
from bs4 import BeautifulSoup
import requests
from requests_html import HTMLSession
import pandas as pd
import re
import csv

#html request functions & rendering dynamic content
codes = ["ACTSC", "AMATH", "CO", "CS", "MATBUS", "MAT", "PMATH", "STAT"]

filename = 'all_math.csv'
f = open(filename, 'a')
headers = 'Course,Code,Name\n'
f.write(headers)


for code in codes: 
    url_to_scrape = "https://ucalendar.uwaterloo.ca/2223/COURSE/course-"+code+".html"
    session = HTMLSession()
    response = session.get(url_to_scrape)
    response.html.render()

    #parsing html data
    soup = BeautifulSoup(response.html.html, 'html.parser')

    tables = soup.find_all('div', class_ ="divTable")

    for table in tables:
        course = table.find('div', 'divTableCell')
        if course:
            course_text = course.text.strip()
            # Extract course code and numeric code using regex
            match = re.match(r"([A-Za-z]+) (\d+)", course_text)
            if match:
                course_code = match.group(1)
                numeric_code = match.group(2)
        name = table.find('div', 'divTableCell colspan-2').text
        name = name.replace(",", "")
        f.write(course_code +', '+ numeric_code +', '+ name + '\n')
    
f.close()