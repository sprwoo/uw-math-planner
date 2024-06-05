from bs4 import BeautifulSoup
import requests

# Setup Beautiful Soup
url = "https://academic-calendar-archive.uwaterloo.ca/undergraduate-studies/2023-2024/page/MATH-Combinatorics-and-Optimization2.html"
url_page = requests.get(url)
url_soup = BeautifulSoup(url_page.text, 'lxml')

# Gets the span where all the requirements are listed
sidebar_span = url_soup.find('span', id='ctl00_contentMain_lblContent')
lines = sidebar_span.find_all('ul', recursive=False)

# Remove all the tags
lines = lines[0].get_text()

# Get all the requirements into one list
requirements = []
string = ""
for letter in lines:
    if letter == '\r' or letter == '\n':
        if string.strip():
            requirements.append(string.strip())
        string = ""
    else:
        string += letter

# Turn the list of requirements into a dictionary 
organized_data = {}
valid_keys = ["One", "Two", "Three", "Four", "All", "Elective"] # All of the potential headers
count = 1 # Keep track of the numbers

for item in requirements:
    # If any of the keys in valid_keys are found within an element, we create a new dictionary key
    if any(valid_key in item for valid_key in valid_keys):
        key = f"{count}. {item}"
        count += 1
        organized_data[key] = []
    else: # If a key is not found, just append it into the dictionary as a value
        if key:
            organized_data[key].append(item)

# Print
for key, value in organized_data.items():
    if value:
        print(f"{key}: {value}")
    else:
        print(f"{key}")
    print(">>>")