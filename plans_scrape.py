import urllib.request
from urllib.request import urlopen
from bs4 import BeautifulSoup
import requests
from requests_html import HTMLSession
import pandas as pd
import re
import csv

#html request functions & rendering dynamic content
codes = ["Actuarial-Science1", "AM-Degree-Requirements-Applied-Mathematics", "Biostatistics1", "Combinatorics-and-Optimization2"
         "Computational-Mathematics1", "Data-Science1", "Mathematical-Economics-Degree-Requirements", "Actuarial-Science-Mathematical-Finance1"
         "Mathematical-Optimization1", "AM-Degree-Requirements-Mathematical-Physics", "MS-Degree-Requirements-Mathematical-Studies"
         "Mathematics-Teaching-co-op", "Pure-Mathematics1", "Statistics1"]

names = ["Actuarial Science", "Applied Mathematics", "Biostatistics", "Combinatorics and Optimization", "Computational Mathematics"
         "Data Science", "Mathematical Economics", "Mathematical Finance", "Mathematical Optimization", "Mathematical Physics"
         "Mathematical Studies", "Mathematical Teaching", "Pure Mathematics", "Statistics"]

i = 0
for code in codes:
    print(names[i])
    '''
    filename = names[i] + '.csv'
    
    f = open(filename, 'a')
    headers = 'Course,Code,Name\n'
    f.write(headers)
    '''
    i += 1
    url_to_scrape = "https://academic-calendar-archive.uwaterloo.ca/undergraduate-studies/2023-2024/page/MATH-" + code + ".html"
    session = HTMLSession()
    response = session.get(url_to_scrape)
    response.html.render()

    # Parsing html data
    soup = BeautifulSoup(response.html.html, 'html.parser')

    # Find all <li> tags
    li_tags = soup.find_all('li')

    # Exclude <li> tags within the sidebar
    sidebar_span = soup.find('span', id='ctl00_lblTableOfContents')
    if sidebar_span:
        sidebar_li_tags = sidebar_span.find_all('li')
        for sidebar_li_tag in sidebar_li_tags:
            if sidebar_li_tag in li_tags:
                li_tags.remove(sidebar_li_tag)

    for li_tag in li_tags:
        # Check if the parent tag of the <li> tag is <ol>
        if li_tag.parent.name == 'ol':
            break  # Break out of the loop
        print(li_tag.text)

    # Close the file
    #f.close()
