from bs4 import BeautifulSoup
import requests

#def make(thing):
    

url = "https://academic-calendar-archive.uwaterloo.ca/undergraduate-studies/2023-2024/page/MATH-Combinatorics-and-Optimization2.html"
url_page = requests.get(url)
url_soup = BeautifulSoup(url_page.text, 'lxml')

top_level_items = url_soup.find_all('li')
i = 0
for name in top_level_items:
    if "Amendments" in name.get_text():
        break
    i += 1
top_level_items = top_level_items[i + 1:]

headers = []

for li in top_level_items:
    # Extract the text of the <li>
    li_text = li.get_text()
    # Check if the <li> contains a specific pattern
    if any(keyword in li_text.lower() for keyword in ["one of", "all of", "three", "one", "five"]):
        # Append the header to the list
        headers.append(li_text)

# Print the headers
thinger = []
for header in headers:
    word = ""
    thing = {}
    for letter in header:
        if letter == "\n" or letter == "\r":
            if len(word.strip()) > 0:
                thing.append(word)
            word = ""
        else:
            word += letter
    if thing:
        thinger.append(thing)

for thing in thinger:
    print(thing)

