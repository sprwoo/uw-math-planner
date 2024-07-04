from new_scraper import *
from typing import Callable

link_header = "https://academic-calendar-archive.uwaterloo.ca"

def scrape(years: int, func: Callable[[int], list[str]]) -> None:
    """
    Wrapper function for datascraping. Generalized so both majors and minors can use this. 
    Writes into a CSV file.
    """

    # Get the years
    years = str(years) + "-" + str(years + 1)

    # Retrieve all the offered majors/minors for that year
    degree_list = func(years)

    for degree in degree_list:
        print(degree)
        print(degree.get_text())
        print(degree.get('a'))
        if degree.get('href') is None:
            print("error")
            continue
        
        # Get the name of the degree for the CSV
        name = degree.get_text().strip()
        name = name.replace(',', '')

        # I don't wanna deal with how SE's page is set up. Also, it's pretty much all predetermined so no freedom for you SE nerds :(
        if name == "Software Engineering": 
            continue
        
        link = degree.get('href').strip()

        soup = setup_bs(link_header + link)
        courses = get_section(soup)
        organized_data = requirement_dict(courses)

        print(">>>")
        print(name)
        print(link_header + link)
        print(organized_data)

        if not organized_data:
            organized_data = "Could not find courses associated with this degree :(. Check the official Undergraduate Calendar."
        file.write(f"{name},{years},{link_header}{link},\"{str(organized_data)}\"\n")

with open("UW-Undergrad-Calendar/CSVs/major_requirements.csv", 'w', newline='', encoding='utf-8') as file:
    file.write("Major,Year,Link,Requirements\n")
    for y in range(2022,2024):
        scrape(y, get_majors)
# scrape -> [get_majors -> [setup_bs], setup_bs, get_section, requirement_dict]

# with open("UW-Undergrad-Calendar/CSVs/other_minors.csv", 'w', newline='', encoding='utf-8') as file:
#     file.write("Minor,Year,Link,Requirements\n")
#     for y in range(2022, 2024):
#         scrape(y, get_minors)

# with open("UW-Undergrad-Calendar/CSVs/minor_requirements.csv", 'w', newline='', encoding='utf-8') as file:
#     file.write("Minor,Year,Link,Requirements\n")
#     for y in range(2022, 2024):
#         scrape(y, get_math_minors)