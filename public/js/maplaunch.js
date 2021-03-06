function initMap() {
// Specify features and elements to define styles.
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

// Create a map object and specify the DOM element for display.
var map = new google.maps.Map(document.getElementById('map'), {
  center: {lat: 0, lng: 0},
  scrollwheel: true,
  styles: styleArray,
  zoom: 16
});

var pos = null;

// var info = new google.maps.InfoWindow({map: map});

// get geolocation info, center map on you!, and creates infowindow above you
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      console.log(pos);

      // infoWindow.setPosition(pos);
      // infoWindow.setContent('You!');
      map.setCenter(pos);

      console.log(pos);
      var marker1 = new google.maps.Marker({
            position: pos,
            icon: {
              path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
              strokeColor: "#CF2F4D",
              scale: 4
            },
            map: map,
            title: 'AMC Santa Monica'
          });

      // generic marker #2
      var marker2 = new google.maps.Marker({
          position: {lat: 34.0153, lng: 241.506},
          icon: {
            path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            strokeColor: "#CF2F4D",
            scale: 4
          },
          map: map,
          title: 'Arclight Santa Monica'
        });
    })
    // , function() {
    //   handleLocationError(true, infoWindow, map.getCenter());
    // });
  } else {
    // Browser doesn't support Geolocation
    // handleLocationError(false, infoWindow, map.getCenter());
  };


// function handleLocationError(browserHasGeolocation, infoWindow, pos) {
//   infoWindow.setPosition(pos);
//   infoWindow.setContent(browserHasGeolocation ?
//                         'Error: The Geolocation service failed.' :
//                         'Error: Your browser doesn\'t support geolocation.');
// };

// generic marker #1 in process of adding clickable description

}
