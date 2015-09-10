function initialize() {

  var styleArray = [
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape.natural",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#e0efef"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "hue": "#1900ff"
            },
            {
                "color": "#c0e8e8"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "lightness": 100
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "lightness": 700
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#7dcdcd"
            }
        ]
    }
  ];

    var map;
    var bounds = new google.maps.LatLngBounds();
    var mapOptions = {
        styles: styleArray
    };
    var time = new Date();

    // Display a map on the page
    map = new google.maps.Map(document.getElementById("map"), mapOptions);

    // Multiple Markers
    var markers = [
        ['AMC Santa Monica',34.016,-118.495],
        ['Arclight Santa Monica', 34.0153,241.506]
        ['Theatre Santa Monica', 34.017,242]
    ];

    // Info Window Content
    var infoWindowContent = [
        ['<div>' +
        '<h1>AMC Santa Monica</h1>' +
        '<p>Avengers 3: Age of Ultron - 3:30PM</p>' +
        '<p>Avengers 3: Age of Ultron - 4:15PM</p>' +
        '<p>Straight Outta Compton - 4:45PM</p>' +
        '</div>'],

        ['<div>' +
        '<h1>Arclight Santa Monica</h1>' +
        '<p>Straight Outta Compton - 3:45PM</p>' +
        '<p>Straight Outta Compton - 3:45PM</p>' +
        '<p>Avengers 3: Age of Ultron - 4:15PM</p>' +
        '</div>']
    ];

    // Display multiple markers on a map
    var infoWindow = new google.maps.InfoWindow(), marker, i;

    // Loop through our array of markers & place each one on the map
    for( i = 0; i < markers.length; i++ ) {
        var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
        bounds.extend(position);
        marker = new google.maps.Marker({
            position: position,
            icon: {
              path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
              strokeColor: "#CF2F4D",
              scale: 4
            },
            map: map,
            title: markers[i][0]
        });

        // Allow each marker to have an info window
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infoWindow.setContent(infoWindowContent[i][0]);
                infoWindow.open(map, marker);
            }
        })(marker, i));

        // Automatically center the map fitting all markers on the screen
        map.fitBounds(bounds);
    }

    // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
    var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
        this.setZoom(14);
        google.maps.event.removeListener(boundsListener);
    });

}
