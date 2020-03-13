var map = L.map('map').setView(51.505, -0.09], 13)
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
        map.panTo(L.latLng(position.coords.latitude, position.coords.longitude))
    })
}
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: 'Open street map'
}).addTo(map)

axios.get('http://127.0.0.1:5000/geojson-features')
    .then(response => {
        console.log(response.date)
        L.geoJSON(response.data, {}).addTo(map);
})
