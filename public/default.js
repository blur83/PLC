var mymap = L.map('mapid').setView([0, 0], 10);
const attribution = '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> Contributors';
const titleURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(titleURL, { attribution });
tiles.addTo(mymap);

let firstTime = true;

if ('geolocation' in navigator) {
    console.log('geolocation available');
    navigator.geolocation.getCurrentPosition(async pos => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;
        document.getElementById('lat').textContent = latitude;
        document.getElementById('lon').textContent = longitude;
        L.marker([latitude, longitude]).addTo(mymap);
        //send data

        const data = { latitude, longitude };
        // console.log(data);

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };
        // fetch('/api', options).then(response => console.log(response));

        const weatherfetch = await fetch(`/weather/${latitude},${longitude}`);
        const weatherdata = await weatherfetch.json();
        
        console.log(weatherdata);
        document.getElementById('city').textContent=weatherdata.weather.name;
        document.getElementById('temp').textContent=(weatherdata.weather.main.temp-273.15).toFixed(2);
        document.getElementById('pm').textContent=weatherdata.pollution;

        //zone
        if (firstTime) {
            mymap.setView([latitude, longitude], 15);
            firstTime = false;
        }
    });
} else {
    console.log('geolocaiton not available');
    alert("unknown geolocation");
}

