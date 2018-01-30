import document from "document";
import * as messaging from "messaging";

// Import the weather module
import Weather from '../common/weather/device';

// Create the weather object
let weather = new Weather();
// Set the provider : yahoo / owm / wunderground / darksky
weather.setProvider("yahoo"); 
// set your api key
weather.setApiKey("mykey");
// set the maximum age of the data
weather.setMaximumAge(25 * 1000); 

// Display the weather data received from the companion
weather.onsuccess = (data) => {
  console.log("Weather on device " + JSON.stringify(data));
  document.getElementById("GW_TEMPK").innerText = data.temperatureC.toFixed(1) + "°C";
  document.getElementById("GW_DESCRIPTION").innerText = data.description;
  document.getElementById("GW_SUNRISE").innerText = data.sunrise;
  document.getElementById("GW_SUNSET").innerText = data.sunset;
  document.getElementById("GW_NAME").innerText = data.location;
}

weather.onerror = (error) => {
  console.log("Weather error " + JSON.stringify(error));
}

// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  // Fetch the weather every 15 sec
  setInterval(() => weather.fetch(), 15 * 1000);
  weather.fetch();
}

// There is a bug with the current version of fitbit OS (1.1 beta2)
// so the following line are needed if you don't have already attached a function the onmessage event
messaging.peerSocket.onmessage = function(evt) {
}
