function getColor(metric) {
    return metric > 1000 ? '#800026' :
           metric > 500  ? '#BD0026' :
           metric > 200  ? '#E31A1C' :
           metric > 100  ? '#FC4E2A' :
           metric > 50   ? '#FD8D3C' :
           metric > 20   ? '#FEB24C' :
           metric > 10   ? '#FED976' :
                      '#FFEDA0';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.deaths),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

var countries = $.ajax({
          url:"http://127.0.0.1:5000/covid_data",
          dataType: "json",
          success: console.log("Country polygons data successfully loaded."),
          error: function (xhr) {
            alert(xhr.statusText)
          }
        })

$.when(countries).done(function() {
	var mapboxAccessToken =  'pk.eyJ1Ijoic3Bpa2UtaCIsImEiOiJjazd4cWVpYmkwMDAyM2ZvMXdnMjFlbmkwIn0.0TxyqnvQ0dSs8-fjCLLEQg'
	var map = L.map('map').setView([37.8, -96], 4);

	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
    	id: 'mapbox/light-v9',
    	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    	maxZoom: 18, 
    	tileSize: 512,
    	zoomOffset: -1
	}).addTo(map);

	L.geoJson(countries.responseJSON).addTo(map)
});
