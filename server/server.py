from flask import Flask, request, jsonify
from flask_cors import CORS
import util

app = Flask(__name__)
CORS(app)


@app.route('/get_location_names', methods=['GET'])
def get_location_names():
    response = jsonify({
        'locations': util.get_location_names()
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/predict_home_price', methods=['POST'])
def predict_home_price():
    try:
        # Debug print statements
        print("Request Data:", request.form)

        total_sqft = float(request.form['total_sqft'])
        location = request.form['location']
        BHK = int(request.form['bhk'])
        bath = int(request.form['bath'])

        # Debug print statement
        print(f"Total Sqft: {total_sqft}, Location: {location}, BHK: {BHK}, Bath: {bath}")

        response = jsonify({
            'estimated_price': util.get_estimated_price(location, total_sqft, BHK, bath)
        })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    except Exception as e:
        print(f"Error: {str(e)}")  # Print error message for debugging
        return jsonify({'error': str(e)}), 400


if __name__ == "__main__":
    print("Starting Python Flask Server for Home Price Prediction...")
    util.load_saved_artifacts()
    app.run(debug=True)

