  // Create the base layer.
  var baseMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });


  // Create our map to display on load.
  var myMap = L.map("map", {
    center: [40.7, -94.5],
    zoom: 5
  })

  baseMap.addTo(myMap);

// add fucntion to show earthquake depth by color
function getColor(depth){
    if(depth > 90){
        return "#993366"
    } else if (depth > 70) {
        return "#cc0000"
    } else if (depth > 50){
        return "#ff9933"
    } else if (depth > 30) {
        return "#99cc00"
    } else if (depth > 10) {
        return "#00ff00"
    } else {
        return "#00ffff"
    }
}

// add a function to show zide by mahnitude
function getRadius(magnitude){
    if (magnitude === 0) {
        return 1
    }
    return magnitude * 4
}


// use an API call to the Earthquake API to get earthquake data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data){
    console.log(data);

// A function to determine the marker size and color 
    function styleInfo(feature){
        return{
            stroke: true,
            fillOpacity: 1,
            opacity: 1,
            color: "#000000",
            fillColor: getColor(feature.geometry.coordinates[2]),
            radius: getRadius(feature.properties.mag),
            weight: 0.5
        }
    }

    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return L.circleMarker(latlng);
        }, 
        style: styleInfo,
        onEachFeature: function(feature, layer){
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Depth: " + feature.geometry.coordinates[2] + "<br>Location: " + feature.properties.place);
        }

    }).addTo(myMap);

// add a legend to the map
    let legend = L.control({
     position: "bottomright"
    });

    legend.onAdd = function(){
    let container = L.DomUtil.create("div", "info legend");
    let grades = [-10, 10, 30, 50, 70, 90];
    let colors = ['#98ee00', '#d4ee00', '#eecc00', '#ee9c00', '#ea822c', '#ea2c2c'];
    for(let index = 0; index < grades.length; index++) {
        container.innerHTML += `<i style="background: ${colors[index]}"></i> ${grades[index]} &ndash; ${grades[index + 1]}<br>`
    }
    return container;
    }

    legend.addTo(myMap);
})