from bs4 import BeautifulSoup
import requests

url = "https://academic-calendar-archive.uwaterloo.ca/undergraduate-studies/2023-2024/page/MATH-Computer-Science-Plan-Requirements.html"
url_page = requests.get(url)
url_soup = BeautifulSoup(url_page.text, 'lxml')

sidebar_span = url_soup.find('span', id='ctl00_contentMain_lblContent')
lines = sidebar_span.find_all('ul', recursive=False)

lines = lines[0].get_text()

requirements = []
string = ""
for letter in lines:
    if letter == '\r' or letter == '\n':
        if string.strip():
            requirements.append(string.strip())
        string = ""
    else:
        string += letter

# GPT goated ngl
organized_data = {}
key = None
count = 1

for item in requirements:
    if item in ["One of", "All of", "One additional course chosen from", "Elective breadth requirements", "Elective depth requirements"]:
        key = item if item not in organized_data else f"{item} {count}"
        if key in organized_data:
            count += 1
            key = f"{item} {count}"
        organized_data[key] = []
    else:
        if key:
            organized_data[key].append(item)

for k, v in organized_data.items():
    print(f"{k}: {v}")