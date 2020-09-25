var URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

var earthquakes = new L.LayerGroup();

var darkView = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 524,
    maxZoom: 19,
    zoomOffset: -1,
    id: "dark-v10",
    accessToken: API_KEY
});

var lightView = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 524,
    maxZoom: 19,
    zoomOffset: -1,
    id: "light-v10",
    accessToken: API_KEY
});

var satelliteView = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 524,
    maxZoom: 19,
    zoomOffset: -1,
    id: "mapbox/satellite-streets-v11",
    accessToken: API_KEY
});

var streetView = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 524,
    maxZoom: 19,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
});

var baseMaps = {
    "Dark View": darkView,
    "Light View": lightView,
    "Satellite View": satelliteView,
    "Street View": streetView
};


var overlayMaps = {
    "Earthquakes": earthquakes,
};


var myMap = L.map("map", {
    center: [35.30, -92.00],
    zoom: 4,
    layers: [darkView, earthquakes]
});
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);



// D3: Grab data from the GeoJSON
d3.json(URL, function(data) {
    function markerSize(magnitude) {
        if (magnitude === 0) {
            return 1;
        }
        return magnitude * 5;
    }

    function style(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: fillColor(feature.properties.mag),
            color: "#000000",
            radius: markerSize(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }

    function fillColor(magnitude) {
        if (magnitude > 5) {
          return "#8B0000"
        }
        else if (magnitude > 4) {
          return "#FF4500"
        }
        else if (magnitude > 3) {
          return "#FFA500"
        }
        else if (magnitude > 2) {
          return "#FFFF00"
        }
        else if (magnitude > 1) {
          return "#F0E68C"
        }
        else {
          return "#FFFFF0"
        }
      }
 

    L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: style,
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h3> Location: " + feature.properties.place + "</h3> <hr> <h3> Date Occured: " + new Date(feature.properties.time) + "</h3> <hr> <h3>Magnitude: " + feature.properties.mag + "</h3>");
        }
    }).addTo(earthquakes);

    // Bam!
    earthquakes.addTo(myMap);



    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        const div = L.DomUtil.create("div", "info legend"), 
        magnitudeLevels = [0, 1, 2, 3, 4, 5];

        div.innerHTML += "<h3> Magnitude </h3> <hr>"

        for (var i = 0; i < magnitudeLevels.length; i++) {
            div.innerHTML +=
                '<i style="background: ' + fillColor(magnitudeLevels[i] + 1) + '"></i> ' +
                magnitudeLevels[i] + (magnitudeLevels[i + 1] ? " to " + magnitudeLevels[i + 1] + '<br>' : ' +');
        }
        return div;
    };

    // Bam!
    legend.addTo(myMap);
});