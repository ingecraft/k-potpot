var mapboxAccessToken =  'pk.eyJ1Ijoic3Bpa2UtaCIsImEiOiJjazd4cWVpYmkwMDAyM2ZvMXdnMjFlbmkwIn0.0TxyqnvQ0dSs8-fjCLLEQg'
var map = L.map('map').setView([37.8, -96], 4);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
    id: 'mapbox/light-v9',
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18, 
    tileSize: 512,
    zoomOffset: -1
}).addTo(map);

