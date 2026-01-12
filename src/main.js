import "./style.css";
import { WeatherService } from "./meteo-service.js";

const service = new WeatherService();
service.getData();

// service.getData()
//     .then(transformedData => {
//         console.log(transformedData);
//         // Aquí puedes usar los datos transformados
//     })
//     .catch(error => console.error('Error:', error));

// .then(weatherData => displayWeather(weatherData));



// function displayWeather (weatherData) {

//         console.log('display', weatherData);

// }