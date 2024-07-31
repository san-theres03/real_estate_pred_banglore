// Get the selected BHK value from radio buttons
function getBHKValue() {
  var uiBHK = document.getElementsByName("uiBHK");
  for (var i = 0; i < uiBHK.length; i++) {
      if (uiBHK[i].checked) {
          return parseInt(uiBHK[i].value);
      }
  }
  return -1; // Invalid Value
}

// Get the selected Bath value from radio buttons
function getBathValue() {
  var uiBathrooms = document.getElementsByName("uiBathrooms");
  for (var i = 0; i < uiBathrooms.length; i++) {
      if (uiBathrooms[i].checked) {
          return parseInt(uiBathrooms[i].value);
      }
  }
  return -1; // Invalid Value
}

// Function to handle the click event of the "Estimate Price" button
function onClickedEstimatePrice() {
  console.log("Estimate price button clicked");
  
  // Get values from the form
  var sqft = document.getElementById("uiSqft").value;
  var bhk = getBHKValue();
  var bathrooms = getBathValue();
  var location = document.getElementById("uiLocations").value;
  var estPrice = document.getElementById("uiEstimatedPrice");

  // Validate input values
  if (isNaN(sqft) || sqft <= 0) {
      alert("Please enter a valid square feet value.");
      return;
  }
  if (bhk === -1) {
      alert("Please select a BHK value.");
      return;
  }
  if (bathrooms === -1) {
      alert("Please select a number of bathrooms.");
      return;
  }
  if (!location) {
      alert("Please select a location.");
      return;
  }

  // Log the request payload
  console.log("Sending request with:", {
      total_sqft: parseFloat(sqft),
      bhk: bhk,
      bath: bathrooms,
      location: location
  });

  // URL for the backend API
  var url = "http://127.0.0.1:5000/predict_home_price"; // Adjust if using a different endpoint

  // Send POST request to the backend
  $.post(url, {
      total_sqft: parseFloat(sqft),
      bhk: bhk,
      bath: bathrooms,
      location: location
  })
  .done(function(data) {
      // Update the UI with the response
      console.log("Response Data:", data);
      estPrice.innerHTML = "<h2>" + data.estimated_price.toString() + " Lakh</h2>";
  })
  .fail(function(jqXHR, textStatus, errorThrown) {
      // Log errors for debugging
      console.log("Request Failed:", textStatus, errorThrown);
      alert("Failed to get the estimated price. Please try again.");
  });
}

// Initialize the page by loading location options
function onPageLoad() {
  console.log("document loaded");

  var url = "http://127.0.0.1:5000/get_location_names"; // Adjust if using a different endpoint

  $.get(url, function(data) {
      console.log("Got response for get_location_names request");
      if (data && data.locations) {
          var locations = data.locations;
          var uiLocations = document.getElementById("uiLocations");
          $('#uiLocations').empty();
          $('#uiLocations').append(new Option("Choose a Location", "", true, true));
          for (var i = 0; i < locations.length; i++) {
              var opt = new Option(locations[i], locations[i]);
              $('#uiLocations').append(opt);
          }
      }
  })
  .fail(function(jqXHR, textStatus, errorThrown) {
      console.log("Failed to load locations:", textStatus, errorThrown);
      alert("Failed to load locations. Please try again.");
  });
}

// Attach onPageLoad to window.onload
window.onload = onPageLoad;
