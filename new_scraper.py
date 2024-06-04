from bs4 import BeautifulSoup
import requests

url = "https://academic-calendar-archive.uwaterloo.ca/undergraduate-studies/2023-2024/page/MATH-Comb-and-Opt-Degree-Requirements.html"
url_page = requests.get(url)
url_soup = BeautifulSoup(url_page.text, 'lxml')

sidebar_span = url_soup.find('span', id='ctl00_contentMain_lblContent')
lines = sidebar_span.find_all('ul', recursive=False)

for line in lines:
    print(line.get_text())

# It prints out the entire requirement part now