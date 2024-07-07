import requests
import json

import matplotlib
import matplotlib.pyplot as plt
   
  
# Importing Image module from PIL package  
from PIL import Image

import timeit

print(f'matplotlib backend: {matplotlib.get_backend()}')

import numpy as np

# Define the URL of the API endpoint
url = "http://localhost:8001/process-brain-data"  # Adjust this if your Flask app is running on a different port or host

# data = {
#     "subjects_id": "0293",
#     "trial_id": "13",
#     "plot_sensors": False,
#     "plot_annotation": False,
#     "picks": "hbo",
#     "selected_events": ['a', 'b'],
#     "initial_time": 0,
#     "end_time": None
# }

# # Convert the data to JSON format
# json_data = json.dumps(data)

# start_time = timeit.default_timer()

# # Send the POST request
# response = requests.post(url, json=json_data)

# # Check if the request was successful
# if response.status_code == 200:
#     # Print the processed data returned from the server
#     print("Processed data received from server:")
#     # data = response.json()
#     data = json.loads(response.text)
#     if 'error' in data:
#         # print error message
#         print(data[1])
#     else:
#         # Get image and display
#         image = np.array(data[1]).astype(np.uint8)
#         # save a image using extension 
#         image = Image.fromarray(image)
#         image.show()
#         print(f'Time: {timeit.default_timer() - start_time}')
#     input("Press Enter to continue...")
# else:
#     print("Failed to get response from server, status code:", response.status_code)

# Test loop
for i in ['a', 'b', 'c', 'd', 'e', 'f']:
    data = {
        "subjects_id": "0293",
        "trial_id": "13",
        "plot_sensors": False,
        "plot_annotation": False,
        "picks": "hbo",
        "selected_events": [i],
        "initial_time": 0,
        "end_time": None
    }

    # Convert the data to JSON format
    json_data = json.dumps(data)

    start_time = timeit.default_timer()

    # Send the POST request
    response = requests.post(url, json=json_data)

    # Check if the request was successful
    if response.status_code == 200:
        # Print the processed data returned from the server
        print(f"Processed data received from server procedure {i}:")
        # data = response.json()
        data = json.loads(response.text)
        if 'error' in data:
            # print error message
            print(data['error'])
        else:
            # Get image and display
            image = np.array(data[1]).astype(np.uint8)
            image = Image.fromarray(image)
            im1 = image.save(f"procedure_{i}.jpg") 
            print(f'Time: {timeit.default_timer() - start_time}')
    else:
        print(f"Failed to get response from server, status code: {response.status_code}, procedure: {i}")

