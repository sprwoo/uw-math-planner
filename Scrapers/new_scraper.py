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
    # Get the main section element
    main_section = soup.find('span', id='ctl00_contentMain_lblContent')

    # The three html tags the site uses
    html_tags = ["ul", "ol", "p"]

    # Look for each in order of most common to least
    for tag in html_tags:
        if (tag != "p"):
            lines = main_section.find_all(tag, recursive=False)
            if len(lines) > 0:
                return lines[0].get_text()
        else:
            # Special case for "p" because sites with <p> is just a lot of yap
            lines = main_section.find_all(tag, recursive=True)
            tmp = []
            for line in lines:
                tmp.append(line.get_text())
            return tmp
        
    return None

def requirement_dict(lines: str) -> dict:
    '''Takes the string of requirements and turns it into a dictionary with the headers as keys and courses as values'''
    organized_data = {}
    valid_keys = ["One", "Two", "Three", "Four", "All", "Elective", "Any", "following", 
                  "minimum", "academic standing", "courses", "offers", "ACTSC 231"] # All of the potential headers (Don't mind that last one, CPA wants to be special)
    count = 1 # Keep track of the numbers
    key = None
    string = ""
    for letter in lines:
        if letter == '\r' or letter == '\n':
            string = string.strip()
            if string:
                if any(valid_key in string for valid_key in valid_keys):
                    key = f"{count}. {string}"
                    count += 1
                    organized_data[key] = []
                else: # If a key is not found, just append it into the dictionary as a value
                    organized_data[key].append(string)
            string = ""
        else:
            string += letter
    
    if string.strip():
        key = f"{count}. {string}"
        organized_data[key] = []
    return organized_data

def get_majors(year: int) -> list[str]:
    """Returns all the availiable majors for a year"""
    # Set up URL
    url_for_list = "https://academic-calendar-archive.uwaterloo.ca/undergraduate-studies/" + year + "/page/MATH-List-of-Academic-Programs-or-Plans.html"

    # Get all the names
    major_names = setup_bs(url_for_list)
    major_names = major_names.find_all('a')

    # Remove everything before "Amendments"
    i = 0
    for name in major_names:
        if "Amendments" in name.get_text():
            break
        i += 1
    major_names = major_names[i + 1:]
    
    return major_names

if __name__ == "__main__":
    soup = setup_bs("https://academic-calendar-archive.uwaterloo.ca/undergraduate-studies/2022-2023/page/MATH-Actuarial-Science-Mathematical-Finance1.html")
    lines = get_section(soup)
    #print(lines)
    if lines:
        organized_data = requirement_dict(lines)
    else:
        organized_data = "No courses"
    #print(organized_data)
    for k, v in organized_data.items():
        print(f"{k}: {v}")
