angular.module('mapCtrl', [])
  .controller('mapController', mapController);

function mapController($http, $routeParams){
  var self = this;

  self.getTheatre = function(){
    var theatre = $routeParams.id;
    $http.get('http://data.tmsapi.com/v1.1/theatres/'+theatre+'?api_key=qf6mzc3fkprbntfd95db3hkk')
      .success(function(data){
        console.log(data);
        self.theatreLocation = {lat: data.location.geoCode.latitude, long: data.location.geoCode.longitude}
        console.log(self.theatreLocation);
        self.theatreLatitude = data.location.geoCode.latitude;
        self.theatreLongitude = data.location.geoCode.longitude;
      })

  }

  console.log('mapppppppppppp');
}
