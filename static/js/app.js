
var mapboxAccessToken =  'pk.eyJ1Ijoic3Bpa2UtaCIsImEiOiJjazd4cWVpYmkwMDAyM2ZvMXdnMjFlbmkwIn0.0TxyqnvQ0dSs8-fjCLLEQg'
var map = L.map('map').setView([37.8, -96], 4);


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
	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
    	id: 'mapbox/light-v9',
    	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    	maxZoom: 18, 
    	tileSize: 512,
    	zoomOffset: -1
	}).addTo(map);

	L.geoJson(countries.responseJSON).addTo(map)

	var info = L.control();

	info.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
		this.update();
		return this._div;
	};

	// method that we will use to update the control based on feature properties passed
	info.update = function (props) {
		this._div.innerHTML = '<h4>US Population Density</h4>' +  (props ?
			'<b>' + props.name + '</b><br />' + props.deaths + ' deaths'
			: 'Hover over a Country');
	};

	info.addTo(map);
	
	function highlightFeature(e) {
		var layer = e.target;

		layer.setStyle({
			weight: 3,
			color: '#666',
			dashArray: '',
			fillOpacity: 0.6
		});

		if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
			layer.bringToFront();
		info.update(layer.feature.properties);
		}
	}	
			
	function resetHighlight(e) {
    	geojson.resetStyle(e.target);
		info.update();
	}	
	
	function zoomToFeature(e) {
    	map.fitBounds(e.target.getBounds());
	}
	
	function onEachFeature(feature, layer) {
   	 	layer.on({
        	mouseover: highlightFeature,
        	mouseout: resetHighlight,
        	click: zoomToFeature
    	});
	}

	geojson = L.geoJson(countries.responseJSON, {
		style: style,
		onEachFeature: onEachFeature
	}).addTo(map);

	var legend = L.control({position: 'bottomright'});

	legend.onAdd = function (map) {
    	var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 20, 50, 100, 200, 500, 1000],
        labels = [];

    	// loop through our density intervals and generate a label with a colored square for each interval
    	for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    	}	

    	return div;
	};

	legend.addTo(map);

	
});
