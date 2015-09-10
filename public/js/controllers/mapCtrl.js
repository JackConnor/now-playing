angular.module('mapCtrl', [])
  .controller('mapController', mapController);

function mapController($http, $routeParams){
  var self = this;

  self.getTheatre = function(){
    var theatre = $routeParams.id;
    $http.get('http://data.tmsapi.com/v1.1/theatres/'+theatre+'?api_key=qf6mzc3fkprbntfd95db3hkk')
      .success(function(data){
        console.log(data);
        self.theatreLocation = {lat: parseFloat(data.location.geoCode.latitude), lng: parseFloat(data.location.geoCode.longitude)}
        console.log(self.theatreLocation);

        self.theatreLatitude = parseInt(data.location.geoCode.latitude);
        self.theatreLongitude = parseInt(data.location.geoCode.longitude);


       //begin drawing directions on map
       var location = navigator.geolocation.getCurrentPosition(function(data){
         console.log(data);
         self.myLocation = {lat: data.coords.latitude, lng: data.coords.longitude}
         console.log(self.theatreLocation);
         var request = {
           //origin is equal to your location
           origin: self.myLocation,
           //destination is equal to where you are going
           //we want the self.theatreLocation
           destination: self.theatreLocation,
           travelMode: google.maps.DirectionsTravelMode.DRIVING
         };

         //begin placing single marker with directions
         var markerdest = new google.maps.Marker({
           position: self.theatreLocation,
           icon: {
             path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
             strokeColor: "#CF2F4D",
             scale: 4
           },
           map: window.map,
           title: 'Braveheart'
        });

        var markeryou = new google.maps.Marker({
               position: self.myLocation,
               icon: {
                 path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                 strokeColor: "#21927A",
                 scale: 4
               },
               map: window.map,
               title: 'You!'
             });
             

         window.directionsService.route(request, function(response, status){
           if(status == google.maps.DirectionsStatus.OK) {
             window.directionsDisplay.setDirections(response);
           }
         })
       })
     })
    //  directionsService.route(request, function (response, status) {
    //    if (status == google.maps.DirectionsStatus.OK) {
    //      directionsDisplay.setDirections(response);
    //    }
    //  });

  }



  console.log('mapppppppppppp');
}
