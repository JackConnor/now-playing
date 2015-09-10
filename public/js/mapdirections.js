function initMap() {

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

  if (navigator.geolocation) { //Checks if browser supports geolocation
   navigator.geolocation.getCurrentPosition(function (position) {                                                              //This gets the
     var latitude = position.coords.latitude;                    //users current
     var longitude = position.coords.longitude;                 //location
     var coords = new google.maps.LatLng(latitude, longitude); //Creates variable for map coordinates
     var directionsService = new google.maps.DirectionsService();
     var directionsDisplay = new google.maps.DirectionsRenderer({
       polylineOptions:
       {
         strokeColor: "#666666",
         strokeWeight: 4
       }
     });
     var mapOptions = //Sets map options
     {
       zoom: 15,  //Sets zoom level (0-21)
       center: coords, //zoom in on users location
       styles: styleArray
     };
     map = new google.maps.Map(document.getElementById("map"), mapOptions);
     directionsDisplay.setMap(map);
     directionsDisplay.setOptions( { suppressMarkers: true } );
     var request = {
       //origin is equal to your location
       origin: coords,
       //destination is equal to where you are going
       //we will 'api in' the theatre coordinates right here:
       destination: {lat: 34.016, lng: -118.495},
       travelMode: google.maps.DirectionsTravelMode.DRIVING
     };
     var markeryou = new google.maps.Marker({
           position: coords,
           icon: {
             path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
             strokeColor: "#21927A",
             scale: 4
           },
           map: map,
           title: 'You!'
         });

      var markerdest = new google.maps.Marker({
            position: {lat: 34.016, lng: -118.495},
            icon: {
              path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
              strokeColor: "#CF2F4D",
              scale: 4
            },
            map: map,
            title: 'Your Movie!'
         });

     directionsService.route(request, function (response, status) {
       if (status == google.maps.DirectionsStatus.OK) {
         directionsDisplay.setDirections(response);
       }
     });
   });
 }
}
