const express = require('express');
const Datasotre = require('nedb');
const fetch = require('node-fetch');
const database = new Datasotre('database.db')
database.loadDatabase();

const app = express();
app.listen(8080, () => { console.log('listening at 8080)') });
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

app.get('/api', (request, response) => {
    database.find({}, (err, data) => {
        if (err) {
            response.end();
            return;
        }
        response.json(data);
    });
});


app.post('/api', (request, response) => {
    console.log('i have a new request');
    console.log(request.body);
    const data = request.body;
    const timestampe = Date.now();
    data.timestampe = timestampe;
    database.insert(data)
    response.json({
        status: 'success',
        latitude: data.latitude,
        longtitude: data.longitude,
    });
});

app.get('/weather/:latlon', async (request, response) => {
    const latlon = request.params.latlon.split(',');
    const lat = latlon[0];
    const lon = latlon[1];
    const weather_apiURL = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=1bd4b51b2a5fb52d9cdd064bacded988`;

    const weatherResponse = await fetch(weather_apiURL);
    const weatherData = await weatherResponse.json();

    const pollution_apiURL=`https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`;
    const pollutionResponse = await fetch(pollution_apiURL);
    const pollutionData= await pollutionResponse.json();

    const data ={
        'weather': weatherData,
        'pollution': pollutionData
    }

    response.json(data)
})