import os
import requests
import json
from dotenv import load_dotenv

# Load environment variables from .env file
# This ensures your EDAMAM_APP_ID and EDAMAM_APP_KEY are loaded.
load_dotenv()

# Your Edamam credentials
# Make sure these are correctly set in your .env file:
# EDAMAM_APP_ID="your_app_id"
# EDAMAM_APP_KEY="your_app_key"
EDAMAM_APP_ID = os.getenv("EDAMAM_APP_ID")
EDAMAM_APP_KEY = os.getenv("EDAMAM_API_KEY") # Assuming this is your API key

# --- IMPORTANT: Correct Endpoint for Food Database API ---
# This is the endpoint for parsing food ingredients in the Food Database API.
endpoint = "https://api.edamam.com/api/food-database/v2/parser"

# Attach credentials as query string
params = {
    "app_id": EDAMAM_APP_ID,
    "app_key": EDAMAM_APP_KEY,
    "ingr": "apple" # A simple ingredient to test the Food Database API
}

# No JSON payload is needed for a simple GET request to the parser endpoint
# The Food Database API's parser endpoint is typically a GET request.
# We are not sending a complex plan, just querying for an ingredient.
payload = {} # Empty payload as it's a GET request for this endpoint
headers = {"Content-Type": "application/json"} # Still good practice to include

print("Starting Edamam Food Database API test...")

# Check if credentials are loaded
if not EDAMAM_APP_ID or not EDAMAM_APP_KEY:
    print("Error: EDAMAM_APP_ID or EDAMAM_APP_KEY not found in environment variables.")
    print("Please ensure they are set correctly in your .env file.")
else:
    print(f"Using App ID: {EDAMAM_APP_ID}")
    print(f"Attempting to connect to Food Database API with query: 'apple'...")

    try:
        # Make the GET request to the Food Database API
        # Note: For the 'parser' endpoint, it's a GET request, not POST.
        response = requests.get(endpoint, params=params, headers=headers)

        print("Status Code:", response.status_code)

        # Try to parse JSON, otherwise print raw text
        try:
            response_json = response.json()
            print("Response JSON:", json.dumps(response_json, indent=2)) # Pretty print JSON
            if response.status_code == 200:
                print("\nFood Database API Test Successful!")
                if "parsed" in response_json and response_json["parsed"]:
                    print(f"Successfully parsed: {response_json['parsed'][0]['food']['label']}")
                elif "hints" in response_json and response_json["hints"]:
                    print(f"Successfully received hints: {response_json['hints'][0]['food']['label']}")
                else:
                    print("API call successful, but no specific food data found for 'apple'.")
            else:
                print("\nFood Database API Test Failed!")
                print("Check your API credentials and Edamam plan details.")

        except json.JSONDecodeError:
            print("Raw Response (not JSON):", response.text)
            print("Could not decode JSON response. This might indicate an API error or an invalid response format.")

    except requests.exceptions.RequestException as e:
        print(f"\nAn error occurred during the API request: {e}")
        print("Please check your internet connection and the API endpoint URL.")

print("\n--- Important Note ---")
print("If you intended to use the Meal Planner API, please verify if your Edamam plan includes access to it.")
print("The Food Database API is generally available on the free tier for basic food parsing.")