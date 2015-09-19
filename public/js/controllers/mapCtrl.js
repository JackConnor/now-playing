angular.module('mapCtrl', [])
  .controller('mapController', mapController);

function mapController($http, $routeParams){
  var self = this;
  navigator.geolocation.getCurrentPosition(function(data){
    var currentLoc = {lat: data.coords.latitude, lng: data.coords.longitude}
    $http.get("https://data.tmsapi.com/v1.1/theatres?lat="+currentLoc.lat+"&lng="+currentLoc.lng+"&radius=20&api_key=qf6mzc3fkprbntfd95db3hkk")
      .then(function(data){
        console.log(data);
        var theatresArray = [];
        for (var i = 0; i < data.data.length; i++) {
          var theatreItem = {
            lat: parseFloat(data.data[i].location.geoCode.latitude), lng: parseFloat(data.data[i].location.geoCode.longitude), name: data.data[i].name,
            distance: data.data[i].location.distance,
            theatreId: data.data[i].theatreId}
          theatresArray.push(theatreItem);
        }
        function compare(a,b) {
          if (a.distance < b.distance)
            return -1;
          if (a.distance > b.distance)
            return 1;
          return 0;
        }

        //begin all markers on map in load-view
        var myLoc = new google.maps.Marker({
            position: {lat: currentLoc.lat, lng: currentLoc.lng},
            icon: {
              path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
              strokeColor: "#21927a",
              scale: 4
            },
            map: map,
            title: "Your Location",
          });
        theatresArray.sort(compare);
        console.log(theatresArray);
          var marker1 = new google.maps.Marker({
              position: {lat: theatresArray[1].lat, lng: theatresArray[1].lng},
              icon: {
                path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                strokeColor: "#CF2F4D",
                scale: 4
              },
              map: map,
              title: theatresArray[1].name,
            });
            var infoWindow1 = new google.maps.InfoWindow({
              content: "<h4>"+theatresArray[1].name+"</h4>"+
                "<button class='direction' id='dir1'>Get Directions</button>"+
                "<button class='showtimes' id='"+theatresArray[1].theatreId+"'>See All Showtimes</button>"
            })
            marker1.addListener('click', function(){
              infoWindow1.open(map, marker1);
              $('#dir1').on('click', function(){
                console.log(theatresArray[1]);
                window.location.href = "#/map/"+theatresArray[1].theatreId;
              });
              $('#'+theatresArray[1].theatreId).on('click', function(){
                window.location.href = "/#/showtimes/"+theatresArray[1].theatreId
              })
            })

          var marker2 = new google.maps.Marker({
              position: {lat: theatresArray[2].lat, lng: theatresArray[2].lng},
              icon: {
                path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                strokeColor: "#CF2F4D",
                scale: 4
              },
              map: map,
              title: theatresArray[2].name,
            });
            var infoWindow2 = new google.maps.InfoWindow({
              content: "<h4>"+theatresArray[2].name+"</h4>"+
                "<button class='direction' id='dir2'>Get Directions</button>"+
                "<button class='showtimes' id='"+theatresArray[2].theatreId+"'>See All Showtimes</button>"
            })
            marker2.addListener('click', function(){
              infoWindow2.open(map, marker2);
              $('#dir2').on('click', function(){
                console.log(theatresArray[2]);
                window.location.href = "#/map/"+theatresArray[2].theatreId;
              });
              $('#'+theatresArray[2].theatreId).on('click', function(){
                window.location.href = "/#/showtimes/"+theatresArray[2].theatreId
              })
            })

          var marker3 = new google.maps.Marker({
              position: {lat: theatresArray[3].lat, lng: theatresArray[3].lng},
              icon: {
                path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                strokeColor: "#CF2F4D",
                scale: 4
              },
              map: map,
              title: theatresArray[3].name,
            });
            var infoWindow3 = new google.maps.InfoWindow({
              content: "<h4>"+theatresArray[3].name+"</h4>"+
                "<button class='direction' id='dir3'>Get Directions</button>"+
                "<button class='showtimes' id='"+theatresArray[3].theatreId+"'>See All Showtimes</button>"
            })
            marker3.addListener('click', function(){
              infoWindow3.open(map, marker3);
              $('#dir3').on('click', function(){
                console.log(theatresArray[3]);
                window.location.href = "#/map/"+theatresArray[3].theatreId;
              });
              $('#'+theatresArray[3].theatreId).on('click', function(){
                window.location.href = "/#/showtimes/"+theatresArray[3].theatreId
              })
            })


          var marker4 = new google.maps.Marker({
              position: {lat: theatresArray[4].lat, lng: theatresArray[4].lng},
              icon: {
                path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                strokeColor: "#CF2F4D",
                scale: 4
              },
              map: map,
              title: theatresArray[4].name,
            });
            var infoWindow4 = new google.maps.InfoWindow({
              content: "<h4>"+theatresArray[4].name+"</h4>"+
                "<button class='direction' id='dir4'>Get Directions</button>"+
                "<button class='showtimes' id='"+theatresArray[4].theatreId+"'>See All Showtimes</button>"
            })
            marker4.addListener('click', function(){
              infoWindow4.open(map, marker4);
              $('#dir4').on('click', function(){
                console.log(theatresArray[4]);
                window.location.href = "#/map/"+theatresArray[4].theatreId;
              });
              $('#'+theatresArray[4].theatreId).on('click', function(){
                window.location.href = "/#/showtimes/"+theatresArray[4].theatreId
              })
            })
          var marker5 = new google.maps.Marker({
              position: {lat: theatresArray[5].lat, lng: theatresArray[5].lng},
              icon: {
                path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                strokeColor: "#CF2F4D",
                scale: 4
              },
              map: map,
              title: theatresArray[5].name,
            });
            var infoWindow5 = new google.maps.InfoWindow({
              content: "<h4>"+theatresArray[5].name+"</h4>"+
                "<button class='direction' id='dir5'>Get Directions</button>"+
                "<button class='showtimes' id='"+theatresArray[5].theatreId+"'>See All Showtimes</button>"
            })
            marker5.addListener('click', function(){
              infoWindow5.open(map, marker3);
              $('#dir5').on('click', function(){
                console.log(theatresArray[5]);
                window.location.href = "#/map/"+theatresArray[5].theatreId;
              });
              $('#'+theatresArray[5].theatreId).on('click', function(){
                window.location.href = "/#/showtimes/"+theatresArray[5].theatreId
              })
            })

          var marker6 = new google.maps.Marker({
              position: {lat: theatresArray[6].lat, lng: theatresArray[6].lng},
              icon: {
                path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                strokeColor: "#CF2F4D",
                scale: 4
              },
              map: map,
              title: theatresArray[6].name,
            });
            var infoWindow6 = new google.maps.InfoWindow({
              content: "<h4>"+theatresArray[6].name+"</h4>"+
                "<button class='direction' id='dir6'>Get Directions</button>"+
                "<button class='showtimes' id='"+theatresArray[6].theatreId+"'>See All Showtimes</button>"
            })
            marker6.addListener('click', function(){
              infoWindow6.open(map, marker6);
              $('#dir6').on('click', function(){
                console.log(theatresArray[6]);
                window.location.href = "#/map/"+theatresArray[6].theatreId;
              });
              $('#'+theatresArray[6].theatreId).on('click', function(){
                window.location.href = "/#/showtimes/"+theatresArray[6].theatreId
              })
            })

          var marker7 = new google.maps.Marker({
              position: {lat: theatresArray[7].lat, lng: theatresArray[7].lng},
              icon: {
                path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                strokeColor: "#CF2F4D",
                scale: 4
              },
              map: map,
              title: theatresArray[7].name,
            });
            var infoWindow7 = new google.maps.InfoWindow({
              content: "<h4>"+theatresArray[7].name+"</h4>"+
                "<button class='direction' id='dir7'>Get Directions</button>"+
                "<button class='showtimes' id='"+theatresArray[7].theatreId+"'>See All Showtimes</button>"
            })
            marker7.addListener('click', function(){
              infoWindow7.open(map, marker7);
              $('#dir7').on('click', function(){
                console.log(theatresArray[7]);
                window.location.href = "#/map/"+theatresArray[7].theatreId;
              });
              $('#'+theatresArray[7].theatreId).on('click', function(){
                window.location.href = "/#/showtimes/"+theatresArray[7].theatreId
              })
            })
          var marker8 = new google.maps.Marker({
              position: {lat: theatresArray[8].lat, lng: theatresArray[8].lng},
              icon: {
                path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                strokeColor: "#CF2F4D",
                scale: 4
              },
              map: map,
              title: theatresArray[8].name,
            });
            var infoWindow8 = new google.maps.InfoWindow({
              content: "<h4>"+theatresArray[8].name+"</h4>"+
                "<button class='direction' id='dir8'>Get Directions</button>"+
                "<button class='showtimes' id='"+theatresArray[8].theatreId+"'>See All Showtimes</button>"
            })
            marker8.addListener('click', function(){
              infoWindow8.open(map, marker8);
              $('#dir8').on('click', function(){
                console.log(theatresArray[8]);
                window.location.href = "#/map/"+theatresArray[8].theatreId;
              });
              $('#'+theatresArray[8].theatreId).on('click', function(){
                window.location.href = "/#/showtimes/"+theatresArray[8].theatreId
              })
            })
          var marker9 = new google.maps.Marker({
              position: {lat: theatresArray[9].lat, lng: theatresArray[9].lng},
              icon: {
                path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                strokeColor: "#CF2F4D",
                scale: 4
              },
              map: map,
              title: theatresArray[9].name,
            });
            var infoWindow9 = new google.maps.InfoWindow({
              content: "<h4>"+theatresArray[9].name+"</h4>"+
                "<button class='direction' id='dir9'>Get Directions</button>"+
                "<button class='showtimes' id='"+theatresArray[9].theatreId+"'>See All Showtimes</button>"
            })
            marker9.addListener('click', function(){
              infoWindow9.open(map, marker9);
              $('#dir9').on('click', function(){
                console.log(theatresArray[9]);
                window.location.href = "#/map/"+theatresArray[9].theatreId;
              });
              $('#'+theatresArray[9].theatreId).on('click', function(){
                window.location.href = "/#/showtimes/"+theatresArray[9].theatreId
              })
            })

          var marker10 = new google.maps.Marker({
              position: {lat: theatresArray[10].lat, lng: theatresArray[10].lng},
              icon: {
                path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                strokeColor: "#CF2F4D",
                scale: 4
              },
              map: map,
              title: theatresArray[10].name,
            });
            var infoWindow10 = new google.maps.InfoWindow({
              content:
              //begin html content for infowindow
              "<div class='popoutBox'>"+
                "<h4>"+theatresArray[10].name+"</h4>"+
                "<ul class="+theatresArray[10].theatreId+"></ul>" +
                "<button class='direction' id='dir10'>Get Directions</button>" +
                "<button class='showtimes' id='"+theatresArray[10].theatreId+"'>See All Showtimes</button>"+
              "<div>"
            })
            marker10.addListener('click', function(){
              //api call to get showtime data
              $http.get('http://data.tmsapi.com/v1.1/theatres/8749/showings?startDate=2015-09-19&api_key=qf6mzc3fkprbntfd95db3hkk')
                .then(function(showtimes){
                  console.log(showtimes);
                  infoWindow10.open(map, marker10);
                  $('#dir10').on('click', function(){
                    window.location.href = "#/map/"+theatresArray[10].theatreId;
                  });
                  $('#'+theatresArray[10].theatreId).on('click', function(){
                    window.location.href = "/#/showtimes/"+theatresArray[10].theatreId
                  });
                  $('.'+theatresArray[10].theatreId).append(
                    '<li>'+showtimes.data[0].title+'</li>'+
                    '<li>'+showtimes.data[1].title+'</li>'
                  )
                })
                })
              //end api stuff
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
    if(currentUrl == 'https://localhost:5000/#/map'){
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
