import "./style.css";
import { WeatherService } from "./meteo-service.js";
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, plugins, Legend, TimeScale } from 'chart.js';
import 'chartjs-adapter-moment';



const service = new WeatherService();
service.getData().then(meteoData => displayWeather(meteoData));

//---------------------------------------------------------- AGRUPAR POR DIA------------------------------------------------------//

function groupByDate(meteoData) {
    const grouped = {};

    for (const item of meteoData) {
        const date = item.time.split("T")[0]; // yyyy-mm-dd

        if (!grouped[date]) {
            grouped[date] = [];
        }
        grouped[date].push(item);
    }

    return grouped;
}

//-----------------para mostrar oggi e domani en vez del dia---------------------------------//

function parseLocalDate(dateStr) {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d); // ← local time
}

//---------------------------para mostrar los datos en las cards--------------------------------//
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

    const grouped = groupByDate(meteoData);

    for (const dateKey in grouped) {

        // Contenedor x DIA
        const dayWrapper = document.createElement('div');
        dayWrapper.classList.add('day-group');

        // Título con fecha
        const title = document.createElement('h3');

        const dateObj = parseLocalDate(dateKey);

        //--------------------Adaptar la fecha---------------------------//
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        let dayText;
        if (dateObj.getTime() === today.getTime()) {
            //oggi
            dayText = `Oggi ${dateObj.getDate()}`;
        } else if (dateObj.getTime() === tomorrow.getTime()) {
            dayText = `Domani ${dateObj.getDate()}`;
        } else {
            dayText = dateObj.toLocaleDateString('it-IT', {
                weekday: 'long',
                day: '2-digit',
                month: '2-digit'
            });
        }

        title.textContent = dayText;
        dayWrapper.appendChild(title);

        //---------------------------------------- Contenedor de horas
        const hoursContainer = document.createElement('div');
        hoursContainer.classList.add('hours-container');

        //---------------------------------------- Iteramos horas
        grouped[dateKey].forEach(data => {
            const block = document.createElement('div');
            block.classList.add('hour-block');

            //---------------------------------------- icono
            const img = document.createElement('img');
            img.src = './icons/' + data.code + 'd.png';
            img.classList.add('icon-small');
            block.appendChild(img);

            //-------------------------------- número grande (temperatura o lluvia, eliges)
            const label = document.createElement('span');
            label.classList.add('big-number');
            label.textContent = Math.round(data.temperature) + '°C';
            block.appendChild(label);

            //--------------------------------------- hora debajo
            const hour = document.createElement('span');
            hour.classList.add('hour');
            const hStr = new Date(data.time).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
            hour.textContent = hStr;
            block.appendChild(hour);

            //---------------------------------- tooltip al pasar
            block.title = `
🌡 Temp: ${data.temperature}°C
💧 Rain: ${data.rain}mm
💨 Wind: ${data.wind}km/h
        `.trim();

            hoursContainer.appendChild(block);
        });

        dayWrapper.appendChild(hoursContainer);
        container.appendChild(dayWrapper);
    }
}


//-----------------------------------------getting los datos---------------------------------------------------//

function getTemperaturePoints(meteoData) {
    const points = [];
    for (const data of meteoData) {
        points.push({
            x: data.time,
            y: data.temperature
        });
    }
    return points;
}

function getRainPoints(meteoData) {

    return meteoData.map(data => {
        return { x: data.time, y: data.rain }
    })

}

function getWindPoints(meteoData) {
    return meteoData.map(data => ({ x: data.time, y: data.wind }));
}

//--------------------------------------fatta in classe---------------------------------------------------------------------//
// function testChart(canvasId, dataPoints) {

//     console.log("data points", dataPoints);
//     Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, TimeScale);
//     const labels = [];

//     const data = {
//         labels: labels,
//         datasets: [{
//             label: 'Meteo Genova',
//             data: dataPoints,
//             fill: false,
//             borderColor: 'rgb(75, 192, 192)',
//             tension: 0.1
//         }]
//     };

//     const config = {
//         type: 'line',
//         data: data, 
//         options: {
//         scales: {
//             x: {
//                 type: 'time',
//             }
//         }
//     } 
//     };


//     const canvas = document.getElementById(canvasId)
//     new Chart(canvas, config);
// }


//--------------------------------------------MEJORADA CON LA IA AL 14.01.2026 -----------------------------------------//

function testChart(canvasId, dataPoints) {

    Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Legend, TimeScale);

    let labelText = "";
    let lineColor = "";

    // Cambiamos el título y color según el canvas
    if (canvasId === 'temperature-chart') {
        labelText = "Temperatura (°C)";
        lineColor = "rgb(255, 99, 132)";   // rojo
    }
    else if (canvasId === 'rain-chart') {
        labelText = "Pioggia (mm)";
        lineColor = "rgb(54, 162, 235)";   // azul
    }
    else if (canvasId === 'wind-chart') {
        labelText = "Viento (km/h)";
        lineColor = "rgb(255, 159, 64)";   // naranja
    }

    const data = {
        datasets: [{
            label: '',
            data: dataPoints,
            fill: false,
            borderColor: lineColor,
            pointRadius: 3,
            tension: 0.3
        }]
    };

    const config = {
        type: 'line',
        data: data,
        options: {
            plugins: {
                title: {
                    display: true,
                    text: labelText,
                    font: { size: 18 }
                },
                legend: {
                    display: true
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        displayFormats: {
                            hour: 'DD/MM HH:mm',
                            day: 'DD/MM HH:mm'
                        },
                        tooltipFormat: 'DD-MM HH:mm'
                    }
                }
            }
        }
    };

    const canvas = document.getElementById(canvasId);
    new Chart(canvas, config);
}
