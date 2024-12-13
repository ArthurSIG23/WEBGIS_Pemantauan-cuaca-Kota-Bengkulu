// Inisialisasi Peta
var map = L.map('map', {
    center: [-3.80044, 102.26554],
    zoom: 12
});

// Tambahkan Tile Layer dari OpenStreetMap (Default)
const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Tambahkan Tile Layer dari Google Maps (Satellite)
const googleSatLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    attribution: '© Google Maps'
});

// Tambahkan Tile Layer dari Esri (World Imagery)
const esriLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles © Esri & the GIS community'
});

// Tambahkan Layer Awan dari OpenWeather (Clouds Layer)
const cloudLayer = L.tileLayer('https://tile.openweathermap.org/map/clouds/{z}/{x}/{y}.png?appid=accca6a0d7ffa9e19a08bc843b25cb66', {
    attribution: 'Data © OpenWeather',
    opacity: 0.6
});

// Data GeoJSON untuk Kecamatan Kota Bengkulu
const kecamatanPoints = {
    "type": "FeatureCollection",
    "features": [
        { "type": "Feature", "properties": { "name": "Kecamatan Teluk Segara" }, "geometry": { "type": "Point", "coordinates": [102.27146, -3.79189] }},
        { "type": "Feature", "properties": { "name": "Kecamatan Sungai Serut" }, "geometry": { "type": "Point", "coordinates": [102.29078, -3.80492] }},
        { "type": "Feature", "properties": { "name": "Kecamatan Gading Cempaka" }, "geometry": { "type": "Point", "coordinates": [102.31363, -3.82296] }},
        { "type": "Feature", "properties": { "name": "Kecamatan Kampung Melayu" }, "geometry": { "type": "Point", "coordinates": [102.32889, -3.889532] }},
        { "type": "Feature", "properties": { "name": "Kecamatan Ratu Samban" }, "geometry": { "type": "Point", "coordinates": [102.26913, -3.80268] }},
        { "type": "Feature", "properties": { "name": "Kecamatan Selebar" }, "geometry": { "type": "Point", "coordinates": [102.355433, -3.865610] }},
        { "type": "Feature", "properties": { "name": "Kecamatan Muara Bangka Hulu" }, "geometry": { "type": "Point", "coordinates": [102.27375, -3.81330] }},
        { "type": "Feature", "properties": { "name": "Kecamatan Ratu Agung" }, "geometry": { "type": "Point", "coordinates": [102.26765, -3.79940] }},
        { "type": "Feature", "properties": { "name": "Kecamatan Singaran Pati" }, "geometry": { "type": "Point", "coordinates": [102.28589, -3.81021] }},
        { "type": "Feature", "properties": { "name": "Kecamatan Lempuing" }, "geometry": { "type": "Point", "coordinates": [102.26082, -3.80654] }}
    ]
};

// Fungsi untuk mendapatkan cuaca dari API OpenWeather berdasarkan koordinat
const apiKey = 'accca6a0d7ffa9e19a08bc843b25cb66';

function fetchWeather(lat, lon) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    return fetch(weatherUrl)
        .then(response => response.json())
        .then(data => ({
            description: data.weather[0].description,
            temperature: (data.main.temp - 273.15).toFixed(2),
            humidity: data.main.humidity,
            windSpeed: data.wind.speed
        }))
        .catch(error => console.log('Error fetching weather data:', error));
}

// Menambahkan data GeoJSON kecamatan ke peta dengan informasi cuaca
L.geoJSON(kecamatanPoints, {
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
            icon: L.icon({
                iconUrl: 'https://cdn-icons-png.flaticon.com/512/252/252025.png',
                iconSize: [25, 25]
            })
        });
    },
    onEachFeature: async function (feature, layer) {
        const lat = feature.geometry.coordinates[1];
        const lon = feature.geometry.coordinates[0];
        const weather = await fetchWeather(lat, lon);

        const popupContent = `
            <b>${feature.properties.name}</b><br>
            <b>Cuaca:</b> ${weather.description}<br>
            <b>Suhu:</b> ${weather.temperature}°C<br>
            <b>Kelembapan:</b> ${weather.humidity}%<br>
            <b>Kecepatan Angin:</b> ${weather.windSpeed} m/s
        `;
        layer.bindPopup(popupContent);
    }
}).addTo(map);

// Kontrol Layer untuk Memilih Peta
const baseMaps = {
    "OpenStreetMap": osmLayer,
    "Google Satellite": googleSatLayer,
    "Esri World Imagery": esriLayer
};

const overlayMaps = {
    "Clouds Layer": cloudLayer
};

if (username === 'admin' && password === 'password') {
    sessionStorage.setItem('loggedIn', 'true'); // Simpan status login
    window.location.href = 'index.html';
}

L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(map);
