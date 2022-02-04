import json
from urllib.request import urlopen

import random
import requests

with open('key') as f:
    api_key = f.read()

def randomize_cities(list_of_cities):

    # randomize the city - country pair

    result = key, first_value = random.choice(list(list_of_cities.items()))

    return result

def setup():

    # get data of cities and countries
    with urlopen("http://techslides.com/demos/country-capitals.json") as response:
        source = response.read()

    data = json.loads(source)

    # add the city - country pairs to a list_of_cities
    list_of_cities = {}

    for city in data:
        list_of_cities[city['CapitalName']] = city['CountryName']

    return list_of_cities

def handle_requests(random_city):

    try:
        # form the API request link
        complete_request_link = "https://api.openweathermap.org/data/2.5/weather?q=" + random_city[0] + "&units=metric&appid=" + api_key
    
        # get the data
        request_result = requests.get(complete_request_link)

        # store the data as json
        request_data_as_json = request_result.json()
 
        # extract the temperature for both city - country pairs
        city_temperature = request_data_as_json['main']['temp']
    except:
        print("Something went wrong when getting weather data")
        city_temperature = -273.00
        return city_temperature
    else:
        return city_temperature

def get_correct_answer(weather_data_one, weather_data_two):

    result = -1

    if weather_data_one > weather_data_two:
        result = 1

    else: result = 0

    return int(result)

def gameloop():
    
    user_score = 0
    
    while(1):

        randomized_city_one = randomize_cities(list_of_cities)
        weather_data_one = handle_requests(randomized_city_one)

        randomized_city_two = randomize_cities(list_of_cities)
        weather_data_two = handle_requests(randomized_city_two)

        correct_answer = get_correct_answer(weather_data_one, weather_data_two)

        print("Is the weather in " + randomized_city_one[0] + ", " + randomized_city_one[1] + " higher (1) or lower (0) than in " + randomized_city_two[0] + ", " + randomized_city_two[1])
        print("The temperature in " + randomized_city_one[0] + ", " + randomized_city_one[1] + " is " + str(weather_data_one) + " Degrees Celsius")

        user_input = int(input("The answer is Higher (1) or Lower (0) > "))

        if user_input == correct_answer:
            user_score += 1
    
        else: 
            print("Answer incorrect, your score: " + str(user_score))
            print(weather_data_one)
            print(weather_data_two)
            break


# setup

list_of_cities = setup()
gameloop()

