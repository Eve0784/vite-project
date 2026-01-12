export class WeatherService {

    static url = "https://api.open-meteo.com/v1/forecast?latitude=44.411&longitude=8.896&hourly=temperature_2m,rain,weather_code,wind_speed_10m";

    constructor() {}

    getData (){
        return fetch(WeatherService.url) 
        .then(resp => resp.json())
        .then(data => this.transformData(data))
        .then(transformedData => console.log(transformedData));
        
    }

   transformData(data){
        const times = data.hourly.time;
        const temperatures = data.hourly.temperature_2m;
        const rains = data.hourly.rain;
        const codes = data.hourly.weather_code;
        const winds = data.hourly.wind_speed_10m;

        const result = times.map((time, index) => ({
            time, 
            temperature: temperatures[index],
            rain: rains[index],
            code: codes[index],
            wind: winds[index]
        }));
        return  result;

        // console.log(result);
       }
}