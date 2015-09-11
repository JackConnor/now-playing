angular.module('mapCtrl', [])
  .controller('mapController', mapController);

function mapController($http, $routeParams){
  var self = this;
  navigator.geolocation.getCurrentPosition(function(data){
    $http.get("http://data.tmsapi.com/v1.1/theatres?lat=34.0131228&lng=-118.49513040000001&radius=20&api_key=qf6mzc3fkprbntfd95db3hkk")
      .then(function(data){
        console.log(data.data);
        var theatresArray = [];
        for (var i = 0; i < data.data.length; i++) {
          console.log(data.data[i].location.geoCode.latitude);
          console.log(data.data[i].location.geoCode.longitude);

          var theatreItem = {lat: parseFloat(data.data[i].location.geoCode.latitude), lng: parseFloat(data.data[i].location.geoCode.longitude), name: data.data[i].name, distance: data.data[i].location.distance}
          theatresArray.push(theatreItem);
          console.log(theatreItem);
        }
        console.log(theatresArray);
        function compare(a,b) {
          if (a.distance < b.distance)
            return -1;
          if (a.distance > b.distance)
            return 1;
          return 0;
        }

        theatresArray.sort(compare);
        console.log(theatresArray);
        for (var i = 0; i < 11; i++) {
          var name = "marker"+i;
          var name = new google.maps.Marker({
              position: {lat: theatresArray[i].lat, lng: theatresArray[i].lng},
              icon: {
                path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                strokeColor: "#CF2F4D",
                scale: 4
              },
              map: map,
              title: 'Arclight Santa Monica'
            });
        }
      })
  })


  self.counter = true;

  function setMap(){
    $('#map').css("height", 100+"%");
  }
  setMap();

  console.log(window.location.href);
  var currentUrl = window.location.href;
  console.log(currentUrl);

  //self.getTheatre is the method for retrieveing a single theater's directions when a clicked on from list view, or to Load theaters by proximity
  self.getTheatre = function(){
    var theatre = $routeParams.id
      //begin if statement
      ////////////////////
    if(currentUrl == 'http://localhost:5000/#/map'){
      console.log('on map');

      ///ad "onload" stuff here
      if (navigator.geolocation) {
        console.log('geoloc working');
          navigator.geolocation.getCurrentPosition(function(position) {
            pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            console.log(pos);

            ///begin auto-population of map markers on launch
            var currentDate = new Date();
            self.currentDate = currentDate;
            var year = currentDate.getFullYear();
            var month = function(){
              if(currentDate.getMonth() < 10){
                var fullMonth = "0" + (currentDate.getMonth()+1);
                var fullMonthInt = parseInt(fullMonth);
                return fullMonth
              } else {
                return currentDate.getMonth()
              };
            }
            var day = currentDate.getDate();
            var formatDate = year + "-"+month()+"-"+day;
            self.formatDate = formatDate;
            console.log(self.formatDate);

            navigator.geolocation.getCurrentPosition(function(data){
              self.currentLocation = {lat: data.coords.latitude, lng: data.coords.longitude};
              console.log(self.currentLocation);

              var url = "https://data.tmsapi.com/v1.1/theatres?lat="+self.currentLocation.lat+'&lng='+self.currentLocation.lng+'&api_key=qf6mzc3fkprbntfd95db3hkk'

              $http.get(url)
               .success(function(data){
                 console.log(data);
                 self.rawData = data;
                 var filteredData = [];
                 var idCount = 1;
                //  for (var i = 0; i < self.rawData.length; i++) {
                //    console.log('hi');
                 //
                //   }
                //  filteredData.sort(function(a, b) {
                //   return parseFloat(a.startTime) - parseFloat(b.startTime);
                //  });
                //  console.log(filteredData);
                //  self.data = filteredData;
               }, function(err) {
                 console.log(err);
               })
            })


            // var marker1 = new google.maps.Marker({
            //       position: pos,
            //       icon: {
            //         path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            //         strokeColor: "#CF2F4D",
            //         scale: 4
            //       },
            //       map: map,
            //       title: 'AMC Santa Monica'
            //     });
            //
            // // generic marker #2
            // var marker2 = new google.maps.Marker({
            //     position: {lat: 34.0153, lng: 241.506},
            //     icon: {
            //       path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            //       strokeColor: "#CF2F4D",
            //       scale: 4
            //     },
            //     map: map,
            //     title: 'Arclight Santa Monica'
            //   });
          })
        }
////end "on launch" portion of if-statement
    } else {
      ///begin "single theater directions" portion of if-statement
      console.log('getting directions');
      //add single theater directions here
      $http.get('https://data.tmsapi.com/v1.1/theatres/'+theatre+'?api_key=qf6mzc3fkprbntfd95db3hkk')
        .success(function(data){
          console.log(data);
          self.theatreLocation = {lat: parseFloat(data.location.geoCode.latitude), lng: parseFloat(data.location.geoCode.longitude)}
          console.log(self.theatreLocation);

          self.theatreLatitude = parseInt(data.location.geoCode.latitude);
          self.theatreLongitude = parseInt(data.location.geoCode.longitude);

          //begin if statements

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
         ///end drawing directions onto map

       })
    }
  }



  console.log('mapppppppppppp');
}
