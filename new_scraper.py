from typing import List
from bs4 import BeautifulSoup
import requests

def setup_bs(url: str) -> BeautifulSoup:
    '''Set up BeautifulSoup with the url'''
    url_page = requests.get(url)
    url_soup = BeautifulSoup(url_page.text, 'lxml')
    return url_soup

def get_section(soup: BeautifulSoup) -> str:
    '''Gets the span where all the requirements are listed, then returns all the content as a string of all the requirements'''
    main_section = soup.find('span', id='ctl00_contentMain_lblContent')
    lines = main_section.find_all('ul', recursive=False)
    lines = lines[0].get_text()
    return lines

def requirement_dict(lines: str) -> dict:
    '''Takes the string of requirements and turns it into a dictionary with the headers as keys and courses as values'''
    # Clean up the string and turn it into 
    requirements = []
    organized_data = {}
    valid_keys = ["One", "Two", "Three", "Four", "All", "Elective"] # All of the potential headers
    count = 1 # Keep track of the numbers
    string = ""
    for letter in lines:
        if letter == '\r' or letter == '\n':
            if string.strip():
                if any(valid_key in string for valid_key in valid_keys):
                    key = f"{count}. {string}"
                    count += 1
                    organized_data[key] = []
                else: # If a key is not found, just append it into the dictionary as a value
                    if key:
                        organized_data[key].append(string)
            string = ""
        else:
            string += letter
        
    return organized_data

def __repr(data: dict) -> None:
    '''Prints out a dictionary'''
    for key, value in organized_data.items():
        if value:
            print(f"{key}: {value}")
        else:
            print(f"{key}")
        print("\n")

soup = setup_bs("https://academic-calendar-archive.uwaterloo.ca/undergraduate-studies/2023-2024/page/MATH-Combinatorics-and-Optimization2.html")
lines = get_section(soup)
organized_data = requirement_dict(lines)
__repr(organized_data)
