import "./style.css";
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, plugins, Legend } from 'chart.js';
import { WeatherService } from "./meteo-service.js";

const service = new WeatherService();
service.getData().then(meteoData => displayWeather(meteoData));


function displayWeather(meteoData) {

    const temperaturePoints = getTemperaturePoints(meteoData);
    const rainPoints = getRainPoints(meteoData);
    const windPoints = getWindPoints(meteoData);

    testChart('temperature-chart', temperaturePoints)
    testChart('rain-chart', rainPoints)
    testChart('wind-chart', windPoints)

    console.log('display', meteoData);
    const container = document.getElementById('app');
    container.classList.add('card-container')
    container.innerHTML = '';

    for (const data of meteoData) {

        const card = document.createElement('div');
        card.classList.add('card-meteo');

        const spanTime = document.createElement('span');
        const date = new Date(data.time);
        const dateStr = date.toLocaleDateString('it-IT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        const timeStr = date.toLocaleTimeString('it-IT', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        spanTime.innerHTML = `Date: ${dateStr} - Hour: ${timeStr}`;
        card.appendChild(spanTime);

        const spanTemp = document.createElement('span');
        spanTemp.innerHTML = 'Temperature: ' + data.temperature + ' °C';
        card.appendChild(spanTemp);

        const spanRain = document.createElement('span');
        spanRain.innerHTML = 'Rain: ' + data.rain + ' mm';
        card.appendChild(spanRain);

        const spanCode = document.createElement('span');
        spanCode.innerHTML = 'Code: '+ data.code + ' wmo';
        card.appendChild(spanCode);
        // const spanCode = document.createElement('span');
        // const codeText = data.code.split(' ').slice(0, -1).join(' ');
        // spanCode.innerHTML = 'Code: ' + codeText;
        // card.appendChild(spanCode);

        const spanWind = document.createElement('span');
        spanWind.innerHTML = 'Wind: ' + data.wind + ' km/h';
        card.appendChild(spanWind);

        container.appendChild(card)


    }

}
function getTemperaturePoints(meteoData) {
    const points = [];
    for (const data of meteoData) {
        points.push({
            x: data.time,
            y: data.temperature
        });
    }
    // console.log('Temperature points: ', points);
    return points;
}

function getRainPoints(meteoData) {
    const points = [];
    for (const data of meteoData) {
        points.push({
            x: data.time,
            y: data.rain
        });
    }
    // console.log('Rain points: ', points);
    return points;
}

function getWindPoints(meteoData) {
    const points = [];
    for (const data of meteoData) {
        points.push({
            x: data.time,
            y: data.wind
        });  
    }
    // console.log('Wind points: ', points);
    return points;
}
//--------------------------------------fatta in classe---------------------------------------------------------------------//
// function testChart(canvasId, dataPoints) {

//     console.log("data points", dataPoints);

//     Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale);
//     const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
//     const data = {
//         labels: labels,
//         datasets: [{
//             label: 'Meteo Genova',
//             data: [65, 59, 80, 81, 56, 55, 40],
//             fill: false,
//             borderColor: 'rgb(75, 192, 192)',
//             tension: 0.1
//         }]
//     };

//     const config = {
//         type: 'line',
//         data: data,
//     };
//     const canvas = document.getElementById(canvasId)
//     new Chart(canvas, config);
// }
// Guardar referencias a los gráficos creados

//------------------------------------------- Mejorada con IA  -----------------------------------------------------------------------//
const chartInstances = {};

function testChart(canvasId, dataPoints) {
    console.log("data points", dataPoints);
    
    Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title);
    
    // Crear arrays vacíos para labels y valores
    const labels = [];
    const values = [];
    
    // Recorrer dataPoints y extraer las fechas y valores
    for (let i = 0; i < dataPoints.length; i++) {
        const point = dataPoints[i];
        
        // Formatear la fecha para el label
        const date = new Date(point.x);
        const dateFormatted = date.toLocaleDateString('it-IT', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
        labels.push(dateFormatted);
        
        // Agregar el valor numérico
        values.push(point.y);
    }
    
    // Determinar el label y color según el canvas
    let datasetLabel = 'Meteo Genova';
    let borderColor = 'rgb(75, 192, 192)';
    
    if (canvasId === 'temperature-chart') {
        datasetLabel = 'Temperature (°C)';
        borderColor = 'rgb(255, 99, 132)';
    } else if (canvasId === 'rain-chart') {
        datasetLabel = 'Rain (mm)';
        borderColor = 'rgb(54, 162, 235)';
    } else if (canvasId === 'wind-chart') {
        datasetLabel = 'Wind (km/h)';
        borderColor = 'rgb(75, 192, 192)';
    }
    
    const data = {
        labels: labels,
        datasets: [{
            label: datasetLabel,
            data: values,
            fill: false,
            borderColor: borderColor,
            backgroundColor: borderColor,
            borderWidth: 2,
            pointRadius: 2,
            tension: 0.1
        }]
    };
    
    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins:{
                title:{
                display: true,
                text: datasetLabel,
                font:{
                    size:18
                }
            },
            legend: {
                display: true
            }
        },
        scales:{}
    }
}
    
    const canvas = document.getElementById(canvasId);
    
    // Destruir el gráfico anterior si existe
    // if (chartInstances[canvasId]) {
    //     chartInstances[canvasId].destroy();
    // }
    
    // Crear y guardar el nuevo gráfico
    chartInstances[canvasId] = new Chart(canvas, config);
    // console.log( chartInstances);
    
}

