angular.module('mapCtrl', [])
  .controller('mapController', mapController);

function mapController($http, $routeParams){
  //begin global variables
  var self = this;
  var theatresArray = [];
  //find current time and date

  var today = new Date();
  var year = today.getFullYear();
  var month = today.getMonth()+1;
  var day = today.getDate();
  var hour = today.getHours();
  var minute = today.getMinutes();

  if(minute < 10){
    minute = "0"+minute;
  }
  var marker = [];
  console.log(marker);
  var infoWindow = [];
  var functionBox = [];

  var currentTime = hour+":"+minute;
  console.log(currentTime);
  var todaysDate = year+"-"+month+"-"+day;
  console.log(year+"-"+month+"-"+day);

  navigator.geolocation.getCurrentPosition(function(data){
    var currentLoc = {lat: data.coords.latitude, lng: data.coords.longitude}
    $http.get("https://data.tmsapi.com/v1.1/theatres?lat="+currentLoc.lat+"&lng="+currentLoc.lng+"&radius=20&api_key=qf6mzc3fkprbntfd95db3hkk")
      .then(function(data){
        //infoWindow and marker google map holder arrays

        console.log(currentTime);
        console.log(marker);
        ///////mark your current postion
        var myLoc = new google.maps.Marker({
            position: {lat: currentLoc.lat, lng: currentLoc.lng},
            icon: {
              path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
              strokeColor: "#21927a",
              scale: 4
            },
            map: map,
            title: "You are here",
          });
        //end placing current location
        //Below, begin pushing all theaters to the theater array, to populate map
        for (var i = 0; i < 8; i++) {
          var theatreItem = {
            lat: parseFloat(data.data[i].location.geoCode.latitude), lng: parseFloat(data.data[i].location.geoCode.longitude), name: data.data[i].name,
            distance: data.data[i].location.distance,
            theatreId: data.data[i].theatreId
          }
          theatresArray.push(theatreItem);
          console.log(marker);
          ////begin creating the marker which will be placed on map
          marker[i] = new google.maps.Marker({
              position: {lat: theatresArray[i].lat, lng: theatresArray[i].lng},
              icon: {
                path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                strokeColor: "#CF2F4D",
                scale: 4
              },
              map: map,
              title: theatresArray[i].name,
            });
            ///end creating the marker
            //begin creating the infoWindow that will popup on click
            infoWindow[i] = new google.maps.InfoWindow({
              content:
              //begin html content for infowindow
              "<div class='popoutBox' id='popoutBox"+i+"'>"+
                "<h4>"+theatresArray[i].name+"</h4>"+
                "<p>Upcoming Movietimes</p>"+
                "<ul class="+theatresArray[i].theatreId+">"+
                "</ul>" +
                "<button id='backMove"+i+"'>see earlier showtimes/|\\</button>" +
                "<br>" +
                "<button id='moreMove"+i+"'>see later showtimes\\|/</button>" +
                "<br>" +
                "<button class='direction' id='dir"+i+"'>Get Directions</button>" +
                "<button class='showtimes' id='"+theatresArray[i].theatreId+"'>See All Showtimes</button>"+
              "<div>"
            })//end creating the infoWindow
          }

        //end for loop below
      })
      .then(function(){
        for (var j = 0; j < 8; j++) {
          //begin hardCoded infowindow/marker events
          marker[0].addListener('click', function(){
              infoWindow[j].open(map, marker[j])
          })
        }

      })
      // for (var i = 0; i < 8; i++) {
      //   console.log('whatup');
      //   console.log(marker[i]);
      //   console.log(marker);
      // }
        // marker[i].addListener('click', function(){
        //   var x = i;
        //   console.log(x+" baby");
        // for (var j = 0; j < 8; j++) {
        //   var a = "a";
        //   var b = "b"
        //   var j = j;
        //   console.log(j)
        //   console.log(marker[j]);
        //   var markerThis = marker[j];
        //   var windowThis = infoWindow[j];
        //   console.log(windowThis);
        //   console.log(markerThis);
        //   markerThis.addListener('click', function(){
        //     console.log(markerThis);
        //     console.log(windowThis);
        //     windowThis.open(map, markerThis);
        //     // console.log(infoWindow);
        //     // console.log(j);
        //     // console.log(infoWindow[j]);
        //     // console.log(infoWindow[0]);
        //   })
        // }
      // })
  })


  self.counter = true;

  function setMap(){
    $('#map').css("height", 100+"%");
  }
  setMap();

  var currentUrl = window.location.href;

  //self.getTheatre is the method for retrieveing a single theater's directions when a clicked on from list view, or to Load theaters by proximity
  self.getTheatre = function(){
    var theatre = $routeParams.id
      //begin if statement
      ////////////////////
    if(currentUrl == 'https://localhost:5000/#/map'){
      ///ad "onload" stuff here
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

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

            navigator.geolocation.getCurrentPosition(function(data){
              self.currentLocation = {lat: data.coords.latitude, lng: data.coords.longitude};

              var url = "https://data.tmsapi.com/v1.1/theatres?lat="+self.currentLocation.lat+'&lng='+self.currentLocation.lng+'&api_key=qf6mzc3fkprbntfd95db3hkk'

              $http.get(url)
               .success(function(data){
                 self.rawData = data;
                 var filteredData = [];
                 var idCount = 1;

               }, function(err) {
                 console.log(err);
               })
            })
          })
        }
////end "on launch" portion of if-statement
    } else {
      ///begin "single theater directions" portion of if-statement
      //add single theater directions here
      $http.get('https://data.tmsapi.com/v1.1/theatres/'+theatre+'?api_key=qf6mzc3fkprbntfd95db3hkk')
        .success(function(data){
          self.theatreLocation = {lat: parseFloat(data.location.geoCode.latitude), lng: parseFloat(data.location.geoCode.longitude)}

          self.theatreLatitude = parseInt(data.location.geoCode.latitude);
          self.theatreLongitude = parseInt(data.location.geoCode.longitude);

          //begin if statements

         //begin drawing directions on map
         var location = navigator.geolocation.getCurrentPosition(function(data){
           self.myLocation = {lat: data.coords.latitude, lng: data.coords.longitude}
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
  //end self.getTheatre
}
