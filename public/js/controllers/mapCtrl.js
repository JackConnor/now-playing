angular.module('mapCtrl', [])
  .controller('mapController', mapController);

function mapController($http, $routeParams){
  ///////begin experimental map thing

  //////end experiemntal map thing
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
  var infoWindow = [];
  var functionBox = [];
  var miniInfo = [];

  var currentTime = hour+":"+minute;
  var todaysDate = year+"-"+month+"-"+day;

  ///start function to keep map a constant dimension ratio
  function setMap(){

    $('#map').css("height", 90+"%");
    console.log('map at full height');
  }
  // $(window).on('resize orientationChange', setMap)
  setMap();
  /////end viewport function

  navigator.geolocation.getCurrentPosition(function(data){
    window.Object.locationStuff = data;
    var currentLoc = {lat: data.coords.latitude, lng: data.coords.longitude}
    $http.get("https://data.tmsapi.com/v1.1/theatres?lat="+currentLoc.lat+"&lng="+currentLoc.lng+"&radius=20&api_key=qf6mzc3fkprbntfd95db3hkk")
      .then(function(data){
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
        for (var i = 0; i < 16; i++) {
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
            ////begin creating mini popUp infor windows for onload
            var shortNameArray = theatresArray[i].name.split(' ');
            var shortName = shortNameArray[0]+" "+shortNameArray[1];
            miniInfo[i] = new google.maps.InfoWindow({
              content: '<div class="miniMarker">'+shortName+'</div>'
            })
            miniInfo[i].open(map, marker[i]);
          }
          myMini = new google.maps.InfoWindow({
            content: '<div class="miniMarker">You be here, biatch</div>'
          })
          myMini.open(map, myLoc)
        //end for loop below
      })
      .then(function(){
          //begin hardCoded infowindow/marker events
          ///begin theater marker 0
          console.log('were into the event listener function');
            marker[0].addListener('click', function(){
              $http.get('https://data.tmsapi.com/v1.1/theatres/'+theatresArray[0].theatreId+'/showings?startDate='+todaysDate+'&api_key=qf6mzc3fkprbntfd95db3hkk')
                .then(function(showtimes){
                  console.log(showtimes);
                  infoWindow[0].open(map, marker[0]);
                  console.log(showtimes);
                  ////begin creating in-modal list of showtimes when clicked-on
                    if(showtimes.data.length > 0){
                      for (var i = 0; i < 6; i++) {
                        var time = showtimes.data[i].showtimes[0].dateTime.split('');
                        var filteredTime = time.slice(time.length-5, time.length).join('');
                        $('.'+theatresArray[1].theatreId).append(
                          '<li>'+showtimes.data[i].title+' '+filteredTime+'</li>')}
                    } else {
                      $('.'+theatresArray[0].theatreId).append(
                      '<li>Sorry, no movies showing today</li>')
                    }
                    ////end creating in-modal list
                    //begin adding event listeners for in-modal scrolling
                    var movieCache = [];
                    $('#dir0').on('click', function(){
                      //returns directions
                        window.location.href = "#/map/"+theatresArray[0].theatreId;
                      });
                    $('#moreMove0').on('click', function(){
                      //scrolls down in your in-modal showtimes viewer
                      movieCache.push(showtimes.data[0]);
                      showtimes.data.shift();
                      var time = showtimes.data[0].showtimes[0].dateTime.split('');
                      var filteredTime = time.slice(time.length-5, time.length).join('');
            //this removes first item from list/cache and adds a new one to the end of modal list
                     $('.'+theatresArray[0].theatreId).find('li')[0].remove();
                     $('.'+theatresArray[0].theatreId).append(
                       '<li>'+showtimes.data[0].title+' '+filteredTime+'</li>')
                    })
                    //begin the "go up " button where you can see start times you already scanned through
                    $('#backMove0').on('click', function(){
                      if(movieCache.length > 0){
                        showtimes.data.splice(0,0, movieCache[movieCache.length-1]);
                        movieCache.pop();
                        //begin finding time
                        var time = showtimes.data[0].showtimes[0].dateTime.split('');
                        var filteredTime = time.slice(time.length-5, time.length).join('');
                        //end finding time
                        if(showtimes.data.length > 5){
                          $('.'+theatresArray[0].theatreId).find('li')[4].remove();
                        }
                        $('.'+theatresArray[0].theatreId).prepend(
                          '<li>'+showtimes.data[0].title+' '+filteredTime+'</li>'
                        );
                      }
                    })
                })
            })
            ///begin add listener to infoWindows (mini)
            miniInfo[0].addListener('click', function(){
              console.log('yea ya');
            })
            miniInfo[1].addListener('click', function(){
              console.log('yea ya');
            })
            miniInfo[2].addListener('click', function(){
              console.log('yea ya');
            })
            miniInfo[3].addListener('click', function(){
              console.log('yea ya');
            })
            miniInfo[4].addListener('click', function(){
              console.log('yea ya');
            })
            miniInfo[5].addListener('click', function(){
              console.log('yea ya');
            })
            miniInfo[6].addListener('click', function(){
              console.log('yea ya');
            })
            miniInfo[7].addListener('click', function(){
              console.log('yea ya');
            })
            miniInfo[8].addListener('click', function(){
              console.log('yea ya');
            })
            miniInfo[9].addListener('click', function(){
              console.log('yea ya');
            })
            console.log(minInfo[9]);

            ///begin theater marker 1
            marker[1].addListener('click', function(){
              console.log('testing testing');
              $http.get('https://data.tmsapi.com/v1.1/theatres/'+theatresArray[1].theatreId+'/showings?startDate='+todaysDate+'&api_key=qf6mzc3fkprbntfd95db3hkk')
                .then(function(showtimes){
                  console.log(showtimes);
                  infoWindow[1].open(map, marker[1]);
                  console.log(showtimes);
                  ////begin creating in-modal list of showtimes when clicked-on
                    if(showtimes.data.length > 0){
                      for (var i = 0; i < 6; i++) {
                        var time = showtimes.data[i].showtimes[0].dateTime.split('');
                        var filteredTime = time.slice(time.length-5, time.length).join('');
                        $('.'+theatresArray[1].theatreId).append(
                          '<li>'+showtimes.data[i].title+' '+filteredTime+'</li>')}
                    } else {
                      $('.'+theatresArray[1].theatreId).append(
                      '<li>Sorry, no movies showing today</li>')
                    }
                    ////end creating in-modal list
                    //begin adding event listeners for in-modal scrolling
                    var movieCache = [];
                    $('#dir1').on('click', function(){
                      //returns directions
                        window.location.href = "#/map/"+theatresArray[1].theatreId;
                      });
                    $('#moreMove1').on('click', function(){
                      //scrolls down in your in-modal showtimes viewer
                      movieCache.push(showtimes.data[0]);
                      showtimes.data.shift();
                      var time = showtimes.data[0].showtimes[0].dateTime.split('');
                      var filteredTime = time.slice(time.length-5, time.length).join('');
            //this removes first item from list/cache and adds a new one to the end of modal list
                     $('.'+theatresArray[1].theatreId).find('li')[0].remove();
                     $('.'+theatresArray[1].theatreId).append(
                       '<li>'+showtimes.data[0].title+' '+filteredTime+'</li>')
                    })
                    //begin the "go up " button where you can see start times you already scanned through
                    $('#backMove1').on('click', function(){
                      if(movieCache.length > 0){
                        showtimes.data.splice(0,0, movieCache[movieCache.length-1]);
                        movieCache.pop();
                        //begin finding time
                        var time = showtimes.data[0].showtimes[0].dateTime.split('');
                        var filteredTime = time.slice(time.length-5, time.length).join('');
                        //end finding time
                        if(showtimes.data.length > 5){
                          $('.'+theatresArray[1].theatreId).find('li')[4].remove();
                        }
                        $('.'+theatresArray[1].theatreId).prepend(
                          '<li>'+showtimes.data[0].title+' '+filteredTime+'</li>'
                        );
                      }
                    })
                })
            })
            ///begin theater marker 2
            marker[2].addListener('click', function(){
              console.log('testing testing');
              $http.get('https://data.tmsapi.com/v1.1/theatres/'+theatresArray[2].theatreId+'/showings?startDate='+todaysDate+'&api_key=qf6mzc3fkprbntfd95db3hkk')
                .then(function(showtimes){
                  console.log(showtimes);
                  infoWindow[2].open(map, marker[2]);
                  console.log(showtimes);
                  ////begin creating in-modal list of showtimes when clicked-on
                    if(showtimes.data.length > 0){
                      for (var i = 0; i < 6; i++) {
                        var time = showtimes.data[i].showtimes[0].dateTime.split('');
                        var filteredTime = time.slice(time.length-5, time.length).join('');
                        $('.'+theatresArray[2].theatreId).append(
                          '<li>'+showtimes.data[i].title+' '+filteredTime+'</li>')}
                    } else {
                      $('.'+theatresArray[2].theatreId).append(
                      '<li>Sorry, no movies showing today</li>')
                    }
                    ////end creating in-modal list
                    //begin adding event listeners for in-modal scrolling
                    var movieCache = [];
                    $('#dir2').on('click', function(){
                      //returns directions
                        window.location.href = "#/map/"+theatresArray[2].theatreId;
                      });
                    $('#moreMove2').on('click', function(){
                      //scrolls down in your in-modal showtimes viewer
                      movieCache.push(showtimes.data[0]);
                      showtimes.data.shift();
                      var time = showtimes.data[0].showtimes[0].dateTime.split('');
                      var filteredTime = time.slice(time.length-5, time.length).join('');
            //this removes first item from list/cache and adds a new one to the end of modal list
                     $('.'+theatresArray[2].theatreId).find('li')[0].remove();
                     $('.'+theatresArray[2].theatreId).append(
                       '<li>'+showtimes.data[0].title+' '+filteredTime+'</li>')
                    })
                    //begin the "go up " button where you can see start times you already scanned through
                    $('#backMove2').on('click', function(){
                      if(movieCache.length > 0){
                        showtimes.data.splice(0,0, movieCache[movieCache.length-1]);
                        movieCache.pop();
                        //begin finding time
                        var time = showtimes.data[0].showtimes[0].dateTime.split('');
                        var filteredTime = time.slice(time.length-5, time.length).join('');
                        //end finding time
                        if(showtimes.data.length > 5){
                          $('.'+theatresArray[2].theatreId).find('li')[4].remove();
                        }
                        $('.'+theatresArray[2].theatreId).prepend(
                          '<li>'+showtimes.data[0].title+' '+filteredTime+'</li>'
                        );
                      }
                    })
                })
            })
            ///begin theater marker 3
            marker[3].addListener('click', function(){
              console.log('testing testing');
              $http.get('https://data.tmsapi.com/v1.1/theatres/'+theatresArray[3].theatreId+'/showings?startDate='+todaysDate+'&api_key=qf6mzc3fkprbntfd95db3hkk')
                .then(function(showtimes){
                  console.log(showtimes);
                  infoWindow[3].open(map, marker[3]);
                  console.log(showtimes);
                  ////begin creating in-modal list of showtimes when clicked-on
                    if(showtimes.data.length > 0){
                      for (var i = 0; i < 6; i++) {
                        var time = showtimes.data[i].showtimes[0].dateTime.split('');
                        var filteredTime = time.slice(time.length-5, time.length).join('');
                        $('.'+theatresArray[3].theatreId).append(
                          '<li>'+showtimes.data[i].title+' '+filteredTime+'</li>')}
                    } else {
                      $('.'+theatresArray[3].theatreId).append(
                      '<li>Sorry, no movies showing today</li>')
                    }
                    ////end creating in-modal list
                    //begin adding event listeners for in-modal scrolling
                    var movieCache = [];
                    $('#dir3').on('click', function(){
                      //returns directions
                        window.location.href = "#/map/"+theatresArray[3].theatreId;
                      });
                    $('#moreMove3').on('click', function(){
                      //scrolls down in your in-modal showtimes viewer
                      movieCache.push(showtimes.data[0]);
                      showtimes.data.shift();
                      var time = showtimes.data[0].showtimes[0].dateTime.split('');
                      var filteredTime = time.slice(time.length-5, time.length).join('');
            //this removes first item from list/cache and adds a new one to the end of modal list
                     $('.'+theatresArray[3].theatreId).find('li')[0].remove();
                     $('.'+theatresArray[3].theatreId).append(
                       '<li>'+showtimes.data[0].title+' '+filteredTime+'</li>')
                    })
                    //begin the "go up " button where you can see start times you already scanned through
                    $('#backMove3').on('click', function(){
                      if(movieCache.length > 0){
                        showtimes.data.splice(0,0, movieCache[movieCache.length-1]);
                        movieCache.pop();
                        //begin finding time
                        var time = showtimes.data[0].showtimes[0].dateTime.split('');
                        var filteredTime = time.slice(time.length-5, time.length).join('');
                        //end finding time
                        if(showtimes.data.length > 5){
                          $('.'+theatresArray[3].theatreId).find('li')[4].remove();
                        }
                        $('.'+theatresArray[3].theatreId).prepend(
                          '<li>'+showtimes.data[0].title+' '+filteredTime+'</li>'
                        );
                      }
                    })
                })
            })
            ///begin theater marker 4
            marker[4].addListener('click', function(){
              console.log('testing testing');
              $http.get('https://data.tmsapi.com/v1.1/theatres/'+theatresArray[4].theatreId+'/showings?startDate='+todaysDate+'&api_key=qf6mzc3fkprbntfd95db3hkk')
                .then(function(showtimes){
                  console.log(showtimes);
                  infoWindow[4].open(map, marker[4]);
                  console.log(showtimes);
                  ////begin creating in-modal list of showtimes when clicked-on
                    if(showtimes.data.length > 0){
                      for (var i = 0; i < 6; i++) {
                        var time = showtimes.data[i].showtimes[0].dateTime.split('');
                        var filteredTime = time.slice(time.length-5, time.length).join('');
                        $('.'+theatresArray[4].theatreId).append(
                          '<li>'+showtimes.data[i].title+' '+filteredTime+'</li>')}
                    } else {
                      $('.'+theatresArray[4].theatreId).append(
                      '<li>Sorry, no movies showing today</li>')
                    }
                    ////end creating in-modal list
                    //begin adding event listeners for in-modal scrolling
                    var movieCache = [];
                    $('#dir4').on('click', function(){
                      //returns directions
                        window.location.href = "#/map/"+theatresArray[4].theatreId;
                      });
                    $('#moreMove4').on('click', function(){
                      //scrolls down in your in-modal showtimes viewer
                      movieCache.push(showtimes.data[0]);
                      showtimes.data.shift();
                      var time = showtimes.data[0].showtimes[0].dateTime.split('');
                      var filteredTime = time.slice(time.length-5, time.length).join('');
            //this removes first item from list/cache and adds a new one to the end of modal list
                     $('.'+theatresArray[4].theatreId).find('li')[0].remove();
                     $('.'+theatresArray[4].theatreId).append(
                       '<li>'+showtimes.data[0].title+' '+filteredTime+'</li>')
                    })
                    //begin the "go up " button where you can see start times you already scanned through
                    $('#backMove4').on('click', function(){
                      if(movieCache.length > 0){
                        showtimes.data.splice(0,0, movieCache[movieCache.length-1]);
                        movieCache.pop();
                        //begin finding time
                        var time = showtimes.data[0].showtimes[0].dateTime.split('');
                        var filteredTime = time.slice(time.length-5, time.length).join('');
                        //end finding time
                        if(showtimes.data.length > 5){
                          $('.'+theatresArray[4].theatreId).find('li')[4].remove();
                        }
                        $('.'+theatresArray[4].theatreId).prepend(
                          '<li>'+showtimes.data[0].title+' '+filteredTime+'</li>'
                        );
                      }
                    })
                })
            })
            ///begin theater marker 5
            marker[5].addListener('click', function(){
              console.log('testing testing');
              $http.get('https://data.tmsapi.com/v1.1/theatres/'+theatresArray[5].theatreId+'/showings?startDate='+todaysDate+'&api_key=qf6mzc3fkprbntfd95db3hkk')
                .then(function(showtimes){
                  console.log(showtimes);
                  infoWindow[5].open(map, marker[5]);
                  console.log(showtimes);
                  ////begin creating in-modal list of showtimes when clicked-on
                    if(showtimes.data.length > 0){
                      for (var i = 0; i < 6; i++) {
                        var time = showtimes.data[i].showtimes[0].dateTime.split('');
                        var filteredTime = time.slice(time.length-5, time.length).join('');
                        $('.'+theatresArray[5].theatreId).append(
                          '<li>'+showtimes.data[i].title+' '+filteredTime+'</li>')}
                    } else {
                      $('.'+theatresArray[5].theatreId).append(
                      '<li>Sorry, no movies showing today</li>')
                    }
                    ////end creating in-modal list
                    //begin adding event listeners for in-modal scrolling
                    var movieCache = [];
                    $('#dir5').on('click', function(){
                      //returns directions
                        window.location.href = "#/map/"+theatresArray[5].theatreId;
                      });
                    $('#moreMove5').on('click', function(){
                      //scrolls down in your in-modal showtimes viewer
                      movieCache.push(showtimes.data[0]);
                      showtimes.data.shift();
                      var time = showtimes.data[0].showtimes[0].dateTime.split('');
                      var filteredTime = time.slice(time.length-5, time.length).join('');
            //this removes first item from list/cache and adds a new one to the end of modal list
                     $('.'+theatresArray[5].theatreId).find('li')[0].remove();
                     $('.'+theatresArray[5].theatreId).append(
                       '<li>'+showtimes.data[0].title+' '+filteredTime+'</li>')
                    })
                    //begin the "go up " button where you can see start times you already scanned through
                    $('#backMove5').on('click', function(){
                      if(movieCache.length > 0){
                        showtimes.data.splice(0,0, movieCache[movieCache.length-1]);
                        movieCache.pop();
                        //begin finding time
                        var time = showtimes.data[0].showtimes[0].dateTime.split('');
                        var filteredTime = time.slice(time.length-5, time.length).join('');
                        //end finding time
                        if(showtimes.data.length > 5){
                          $('.'+theatresArray[5].theatreId).find('li')[4].remove();
                        }
                        $('.'+theatresArray[5].theatreId).prepend(
                          '<li>'+showtimes.data[0].title+' '+filteredTime+'</li>'
                        );
                      }
                    })
                })
            })
            ///begin theater marker 6
            marker[6].addListener('click', function(){
              console.log('testing testing');
              $http.get('https://data.tmsapi.com/v1.1/theatres/'+theatresArray[6].theatreId+'/showings?startDate='+todaysDate+'&api_key=qf6mzc3fkprbntfd95db3hkk')
                .then(function(showtimes){
                  console.log(showtimes);
                  infoWindow[6].open(map, marker[6]);
                  console.log(showtimes);
                  ////begin creating in-modal list of showtimes when clicked-on
                    if(showtimes.data.length > 0){
                      for (var i = 0; i < 6; i++) {
                        var time = showtimes.data[i].showtimes[0].dateTime.split('');
                        var filteredTime = time.slice(time.length-5, time.length).join('');
                        $('.'+theatresArray[6].theatreId).append(
                          '<li>'+showtimes.data[i].title+' '+filteredTime+'</li>')}
                    } else {
                      $('.'+theatresArray[6].theatreId).append(
                      '<li>Sorry, no movies showing today</li>')
                    }
                    ////end creating in-modal list
                    //begin adding event listeners for in-modal scrolling
                    var movieCache = [];
                    $('#dir6').on('click', function(){
                      //returns directions
                        window.location.href = "#/map/"+theatresArray[6].theatreId;
                      });
                    $('#moreMove6').on('click', function(){
                      //scrolls down in your in-modal showtimes viewer
                      movieCache.push(showtimes.data[0]);
                      showtimes.data.shift();
                      var time = showtimes.data[0].showtimes[0].dateTime.split('');
                      var filteredTime = time.slice(time.length-5, time.length).join('');
            //this removes first item from list/cache and adds a new one to the end of modal list
                     $('.'+theatresArray[6].theatreId).find('li')[0].remove();
                     $('.'+theatresArray[6].theatreId).append(
                       '<li>'+showtimes.data[0].title+' '+filteredTime+'</li>')
                    })
                    //begin the "go up " button where you can see start times you already scanned through
                    $('#backMove6').on('click', function(){
                      if(movieCache.length > 0){
                        showtimes.data.splice(0,0, movieCache[movieCache.length-1]);
                        movieCache.pop();
                        //begin finding time
                        var time = showtimes.data[0].showtimes[0].dateTime.split('');
                        var filteredTime = time.slice(time.length-5, time.length).join('');
                        //end finding time
                        if(showtimes.data.length > 5){
                          $('.'+theatresArray[6].theatreId).find('li')[4].remove();
                        }
                        $('.'+theatresArray[6].theatreId).prepend(
                          '<li>'+showtimes.data[0].title+' '+filteredTime+'</li>'
                        );
                      }
                    })
                })
            })
            ///begin theater marker 7
            marker[7].addListener('click', function(){
              console.log('testing testing');
              $http.get('https://data.tmsapi.com/v1.1/theatres/'+theatresArray[7].theatreId+'/showings?startDate='+todaysDate+'&api_key=qf6mzc3fkprbntfd95db3hkk')
                .then(function(showtimes){
                  console.log(showtimes);
                  infoWindow[7].open(map, marker[7]);
                  console.log(showtimes);
                  ////begin creating in-modal list of showtimes when clicked-on
                    if(showtimes.data.length > 0){
                      for (var i = 0; i < 6; i++) {
                        var time = showtimes.data[i].showtimes[0].dateTime.split('');
                        var filteredTime = time.slice(time.length-5, time.length).join('');
                        $('.'+theatresArray[7].theatreId).append(
                          '<li>'+showtimes.data[i].title+' '+filteredTime+'</li>')}
                    } else {
                      $('.'+theatresArray[7].theatreId).append(
                      '<li>Sorry, no movies showing today</li>')
                    }
                    ////end creating in-modal list
                    //begin adding event listeners for in-modal scrolling
                    var movieCache = [];
                    $('#dir7').on('click', function(){
                      //returns directions
                        window.location.href = "#/map/"+theatresArray[7].theatreId;
                      });
                    $('#moreMove7').on('click', function(){
                      //scrolls down in your in-modal showtimes viewer
                      movieCache.push(showtimes.data[0]);
                      showtimes.data.shift();
                      var time = showtimes.data[0].showtimes[0].dateTime.split('');
                      var filteredTime = time.slice(time.length-5, time.length).join('');
            //this removes first item from list/cache and adds a new one to the end of modal list
                     $('.'+theatresArray[7].theatreId).find('li')[0].remove();
                     $('.'+theatresArray[7].theatreId).append(
                       '<li>'+showtimes.data[0].title+' '+filteredTime+'</li>')
                    })
                    //begin the "go up " button where you can see start times you already scanned through
                    $('#backMove7').on('click', function(){
                      if(movieCache.length > 0){
                        showtimes.data.splice(0,0, movieCache[movieCache.length-1]);
                        movieCache.pop();
                        //begin finding time
                        var time = showtimes.data[0].showtimes[0].dateTime.split('');
                        var filteredTime = time.slice(time.length-5, time.length).join('');
                        //end finding time
                        if(showtimes.data.length > 5){
                          $('.'+theatresArray[7].theatreId).find('li')[4].remove();
                        }
                        $('.'+theatresArray[7].theatreId).prepend(
                          '<li>'+showtimes.data[0].title+' '+filteredTime+'</li>'
                        );
                      }
                    })
                })
            })
            ///begin theater marker 8
            marker[8].addListener('click', function(){
              console.log('testing testing');
              $http.get('https://data.tmsapi.com/v1.1/theatres/'+theatresArray[8].theatreId+'/showings?startDate='+todaysDate+'&api_key=qf6mzc3fkprbntfd95db3hkk')
                .then(function(showtimes){
                  console.log(showtimes);
                  infoWindow[8].open(map, marker[8]);
                  console.log(showtimes);
                  ////begin creating in-modal list of showtimes when clicked-on
                    if(showtimes.data.length > 0){
                      for (var i = 0; i < 6; i++) {
                        var time = showtimes.data[i].showtimes[0].dateTime.split('');
                        var filteredTime = time.slice(time.length-5, time.length).join('');
                        $('.'+theatresArray[8].theatreId).append(
                          '<li>'+showtimes.data[i].title+' '+filteredTime+'</li>')}
                    } else {
                      $('.'+theatresArray[8].theatreId).append(
                      '<li>Sorry, no movies showing today</li>')
                    }
                    ////end creating in-modal list
                    //begin adding event listeners for in-modal scrolling
                    var movieCache = [];
                    $('#dir8').on('click', function(){
                      //returns directions
                        window.location.href = "#/map/"+theatresArray[8].theatreId;
                      });
                    $('#moreMove8').on('click', function(){
                      //scrolls down in your in-modal showtimes viewer
                      movieCache.push(showtimes.data[0]);
                      showtimes.data.shift();
                      var time = showtimes.data[0].showtimes[0].dateTime.split('');
                      var filteredTime = time.slice(time.length-5, time.length).join('');
            //this removes first item from list/cache and adds a new one to the end of modal list
                     $('.'+theatresArray[8].theatreId).find('li')[0].remove();
                     $('.'+theatresArray[8].theatreId).append(
                       '<li>'+showtimes.data[0].title+' '+filteredTime+'</li>')
                    })
                    //begin the "go up " button where you can see start times you already scanned through
                    $('#backMove8').on('click', function(){
                      if(movieCache.length > 0){
                        showtimes.data.splice(0,0, movieCache[movieCache.length-1]);
                        movieCache.pop();
                        //begin finding time
                        var time = showtimes.data[0].showtimes[0].dateTime.split('');
                        var filteredTime = time.slice(time.length-5, time.length).join('');
                        //end finding time
                        if(showtimes.data.length > 5){
                          $('.'+theatresArray[8].theatreId).find('li')[4].remove();
                        }
                        $('.'+theatresArray[8].theatreId).prepend(
                          '<li>'+showtimes.data[0].title+' '+filteredTime+'</li>'
                        );
                      }
                    })
                })
            })
            ///begin theater marker 9
            marker[9].addListener('click', function(){
              console.log('testing testing');
              $http.get('https://data.tmsapi.com/v1.1/theatres/'+theatresArray[9].theatreId+'/showings?startDate='+todaysDate+'&api_key=qf6mzc3fkprbntfd95db3hkk')
                .then(function(showtimes){
                  console.log(showtimes);
                  infoWindow[9].open(map, marker[9]);
                  console.log(showtimes);
                  ////begin creating in-modal list of showtimes when clicked-on
                    if(showtimes.data.length > 0){
                      for (var i = 0; i < 6; i++) {
                        var time = showtimes.data[i].showtimes[0].dateTime.split('');
                        var filteredTime = time.slice(time.length-5, time.length).join('');
                        $('.'+theatresArray[9].theatreId).append(
                          '<li>'+showtimes.data[i].title+' '+filteredTime+'</li>')}
                    } else {
                      $('.'+theatresArray[9].theatreId).append(
                      '<li>Sorry, no movies showing today</li>')
                    }
                    ////end creating in-modal list
                    //begin adding event listeners for in-modal scrolling
                    var movieCache = [];
                    $('#dir9').on('click', function(){
                      //returns directions
                        window.location.href = "#/map/"+theatresArray[9].theatreId;
                      });
                    $('#moreMove9').on('click', function(){
                      //scrolls down in your in-modal showtimes viewer
                      movieCache.push(showtimes.data[0]);
                      showtimes.data.shift();
                      var time = showtimes.data[0].showtimes[0].dateTime.split('');
                      var filteredTime = time.slice(time.length-5, time.length).join('');
            //this removes first item from list/cache and adds a new one to the end of modal list
                     $('.'+theatresArray[9].theatreId).find('li')[0].remove();
                     $('.'+theatresArray[9].theatreId).append(
                       '<li>'+showtimes.data[0].title+' '+filteredTime+'</li>')
                    })
                    //begin the "go up " button where you can see start times you already scanned through
                    $('#backMove9').on('click', function(){
                      if(movieCache.length > 0){
                        showtimes.data.splice(0,0, movieCache[movieCache.length-1]);
                        movieCache.pop();
                        //begin finding time
                        var time = showtimes.data[0].showtimes[0].dateTime.split('');
                        var filteredTime = time.slice(time.length-5, time.length).join('');
                        //end finding time
                        if(showtimes.data.length > 5){
                          $('.'+theatresArray[9].theatreId).find('li')[4].remove();
                        }
                        $('.'+theatresArray[9].theatreId).prepend(
                          '<li>'+showtimes.data[0].title+' '+filteredTime+'</li>'
                        );
                      }
                    })
                })
            })
            ///begin theater marker 10
            marker[10].addListener('click', function(){
              console.log('testing testing');
              $http.get('https://data.tmsapi.com/v1.1/theatres/'+theatresArray[10].theatreId+'/showings?startDate='+todaysDate+'&api_key=qf6mzc3fkprbntfd95db3hkk')
                .then(function(showtimes){
                  console.log(showtimes);
                  infoWindow[10].open(map, marker[10]);
                  console.log(showtimes);
                  ////begin creating in-modal list of showtimes when clicked-on
                    if(showtimes.data.length > 0){
                      for (var i = 0; i < 6; i++) {
                        var time = showtimes.data[i].showtimes[0].dateTime.split('');
                        var filteredTime = time.slice(time.length-5, time.length).join('');
                        $('.'+theatresArray[10].theatreId).append(
                          '<li>'+showtimes.data[i].title+' '+filteredTime+'</li>')}
                    } else {
                      $('.'+theatresArray[10].theatreId).append(
                      '<li>Sorry, no movies showing today</li>')
                    }
                    ////end creating in-modal list
                    //begin adding event listeners for in-modal scrolling
                    var movieCache = [];
                    $('#dir10').on('click', function(){
                      //returns directions
                        window.location.href = "#/map/"+theatresArray[10].theatreId;
                      });
                    $('#moreMove10').on('click', function(){
                      //scrolls down in your in-modal showtimes viewer
                      movieCache.push(showtimes.data[0]);
                      showtimes.data.shift();
                      var time = showtimes.data[0].showtimes[0].dateTime.split('');
                      var filteredTime = time.slice(time.length-5, time.length).join('');
            //this removes first item from list/cache and adds a new one to the end of modal list
                     $('.'+theatresArray[10].theatreId).find('li')[0].remove();
                     $('.'+theatresArray[10].theatreId).append(
                       '<li>'+showtimes.data[0].title+' '+filteredTime+'</li>')
                    })
                    //begin the "go up " button where you can see start times you already scanned through
                    $('#backMove10').on('click', function(){
                      if(movieCache.length > 0){
                        showtimes.data.splice(0,0, movieCache[movieCache.length-1]);
                        movieCache.pop();
                        //begin finding time
                        var time = showtimes.data[0].showtimes[0].dateTime.split('');
                        var filteredTime = time.slice(time.length-5, time.length).join('');
                        //end finding time
                        if(showtimes.data.length > 5){
                          $('.'+theatresArray[10].theatreId).find('li')[4].remove();
                        }
                        $('.'+theatresArray[10].theatreId).prepend(
                          '<li>'+showtimes.data[0].title+' '+filteredTime+'</li>'
                        );
                      }
                    })
                })
            })
            ///begin theater marker 11
            marker[11].addListener('click', function(){
              console.log('testing testing');
              $http.get('https://data.tmsapi.com/v1.1/theatres/'+theatresArray[11].theatreId+'/showings?startDate='+todaysDate+'&api_key=qf6mzc3fkprbntfd95db3hkk')
                .then(function(showtimes){
                  console.log(showtimes);
                  infoWindow[11].open(map, marker[11]);
                  console.log(showtimes);
                  ////begin creating in-modal list of showtimes when clicked-on
                    if(showtimes.data.length > 0){
                      for (var i = 0; i < 6; i++) {
                        var time = showtimes.data[i].showtimes[0].dateTime.split('');
                        var filteredTime = time.slice(time.length-5, time.length).join('');
                        $('.'+theatresArray[11].theatreId).append(
                          '<li>'+showtimes.data[i].title+' '+filteredTime+'</li>')}
                    } else {
                      $('.'+theatresArray[11].theatreId).append(
                      '<li>Sorry, no movies showing today</li>')
                    }
                    ////end creating in-modal list
                    //begin adding event listeners for in-modal scrolling
                    var movieCache = [];
                    $('#dir11').on('click', function(){
                      //returns directions
                        window.location.href = "#/map/"+theatresArray[11].theatreId;
                      });
                    $('#moreMove11').on('click', function(){
                      //scrolls down in your in-modal showtimes viewer
                      movieCache.push(showtimes.data[0]);
                      showtimes.data.shift();
                      var time = showtimes.data[0].showtimes[0].dateTime.split('');
                      var filteredTime = time.slice(time.length-5, time.length).join('');
            //this removes first item from list/cache and adds a new one to the end of modal list
                     $('.'+theatresArray[11].theatreId).find('li')[0].remove();
                     $('.'+theatresArray[11].theatreId).append(
                       '<li>'+showtimes.data[0].title+' '+filteredTime+'</li>')
                    })
                    //begin the "go up " button where you can see start times you already scanned through
                    $('#backMove11').on('click', function(){
                      if(movieCache.length > 0){
                        showtimes.data.splice(0,0, movieCache[movieCache.length-1]);
                        movieCache.pop();
                        //begin finding time
                        var time = showtimes.data[0].showtimes[0].dateTime.split('');
                        var filteredTime = time.slice(time.length-5, time.length).join('');
                        //end finding time
                        if(showtimes.data.length > 5){
                          $('.'+theatresArray[11].theatreId).find('li')[4].remove();
                        }
                        $('.'+theatresArray[11].theatreId).prepend(
                          '<li>'+showtimes.data[0].title+' '+filteredTime+'</li>'
                        );
                      }
                    })
                })
            })
            ///begin theater marker 12
            marker[12].addListener('click', function(){
              console.log('testing testing');
              $http.get('https://data.tmsapi.com/v1.1/theatres/'+theatresArray[12].theatreId+'/showings?startDate='+todaysDate+'&api_key=qf6mzc3fkprbntfd95db3hkk')
                .then(function(showtimes){
                  console.log(showtimes);
                  infoWindow[12].open(map, marker[12]);
                  console.log(showtimes);
                  ////begin creating in-modal list of showtimes when clicked-on
                    if(showtimes.data.length > 0){
                      for (var i = 0; i < 6; i++) {
                        var time = showtimes.data[i].showtimes[0].dateTime.split('');
                        var filteredTime = time.slice(time.length-5, time.length).join('');
                        $('.'+theatresArray[12].theatreId).append(
                          '<li>'+showtimes.data[i].title+' '+filteredTime+'</li>')}
                    } else {
                      $('.'+theatresArray[12].theatreId).append(
                      '<li>Sorry, no movies showing today</li>')
                    }
                    ////end creating in-modal list
                    //begin adding event listeners for in-modal scrolling
                    var movieCache = [];
                    $('#dir12').on('click', function(){
                      //returns directions
                        window.location.href = "#/map/"+theatresArray[12].theatreId;
                      });
                    $('#moreMove12').on('click', function(){
                      //scrolls down in your in-modal showtimes viewer
                      movieCache.push(showtimes.data[0]);
                      showtimes.data.shift();
                      var time = showtimes.data[0].showtimes[0].dateTime.split('');
                      var filteredTime = time.slice(time.length-5, time.length).join('');
            //this removes first item from list/cache and adds a new one to the end of modal list
                     $('.'+theatresArray[12].theatreId).find('li')[0].remove();
                     $('.'+theatresArray[12].theatreId).append(
                       '<li>'+showtimes.data[0].title+' '+filteredTime+'</li>')
                    })
                    //begin the "go up " button where you can see start times you already scanned through
                    $('#backMove12').on('click', function(){
                      if(movieCache.length > 0){
                        showtimes.data.splice(0,0, movieCache[movieCache.length-1]);
                        movieCache.pop();
                        //begin finding time
                        var time = showtimes.data[0].showtimes[0].dateTime.split('');
                        var filteredTime = time.slice(time.length-5, time.length).join('');
                        //end finding time
                        if(showtimes.data.length > 5){
                          $('.'+theatresArray[12].theatreId).find('li')[4].remove();
                        }
                        $('.'+theatresArray[12].theatreId).prepend(
                          '<li>'+showtimes.data[0].title+' '+filteredTime+'</li>'
                        );
                      }
                    })
                })
            })
            ///begin theater marker 13
            marker[13].addListener('click', function(){
              console.log('testing testing');
              $http.get('https://data.tmsapi.com/v1.1/theatres/'+theatresArray[13].theatreId+'/showings?startDate='+todaysDate+'&api_key=qf6mzc3fkprbntfd95db3hkk')
                .then(function(showtimes){
                  console.log(showtimes);
                  infoWindow[13].open(map, marker[13]);
                  console.log(showtimes);
                  ////begin creating in-modal list of showtimes when clicked-on
                    if(showtimes.data.length > 0){
                      for (var i = 0; i < 6; i++) {
                        var time = showtimes.data[i].showtimes[0].dateTime.split('');
                        var filteredTime = time.slice(time.length-5, time.length).join('');
                        $('.'+theatresArray[13].theatreId).append(
                          '<li>'+showtimes.data[i].title+' '+filteredTime+'</li>')}
                    } else {
                      $('.'+theatresArray[13].theatreId).append(
                      '<li>Sorry, no movies showing today</li>')
                    }
                    ////end creating in-modal list
                    //begin adding event listeners for in-modal scrolling
                    var movieCache = [];
                    $('#dir13').on('click', function(){
                      //returns directions
                        window.location.href = "#/map/"+theatresArray[13].theatreId;
                      });
                    $('#moreMove13').on('click', function(){
                      //scrolls down in your in-modal showtimes viewer
                      movieCache.push(showtimes.data[0]);
                      showtimes.data.shift();
                      var time = showtimes.data[0].showtimes[0].dateTime.split('');
                      var filteredTime = time.slice(time.length-5, time.length).join('');
            //this removes first item from list/cache and adds a new one to the end of modal list
                     $('.'+theatresArray[13].theatreId).find('li')[0].remove();
                     $('.'+theatresArray[13].theatreId).append(
                       '<li>'+showtimes.data[0].title+' '+filteredTime+'</li>')
                    })
                    //begin the "go up " button where you can see start times you already scanned through
                    $('#backMove13').on('click', function(){
                      if(movieCache.length > 0){
                        showtimes.data.splice(0,0, movieCache[movieCache.length-1]);
                        movieCache.pop();
                        //begin finding time
                        var time = showtimes.data[0].showtimes[0].dateTime.split('');
                        var filteredTime = time.slice(time.length-5, time.length).join('');
                        //end finding time
                        if(showtimes.data.length > 5){
                          $('.'+theatresArray[13].theatreId).find('li')[4].remove();
                        }
                        $('.'+theatresArray[13].theatreId).prepend(
                          '<li>'+showtimes.data[0].title+' '+filteredTime+'</li>'
                        );
                      }
                    })
                })
            })
            ///begin theater marker 14
            marker[14].addListener('click', function(){
              console.log('testing testing');
              $http.get('https://data.tmsapi.com/v1.1/theatres/'+theatresArray[14].theatreId+'/showings?startDate='+todaysDate+'&api_key=qf6mzc3fkprbntfd95db3hkk')
                .then(function(showtimes){
                  console.log(showtimes);
                  infoWindow[14].open(map, marker[14]);
                  console.log(showtimes);
                  ////begin creating in-modal list of showtimes when clicked-on
                    if(showtimes.data.length > 0){
                      for (var i = 0; i < 6; i++) {
                        var time = showtimes.data[i].showtimes[0].dateTime.split('');
                        var filteredTime = time.slice(time.length-5, time.length).join('');
                        $('.'+theatresArray[14].theatreId).append(
                          '<li>'+showtimes.data[i].title+' '+filteredTime+'</li>')}
                    } else {
                      $('.'+theatresArray[14].theatreId).append(
                      '<li>Sorry, no movies showing today</li>')
                    }
                    ////end creating in-modal list
                    //begin adding event listeners for in-modal scrolling
                    var movieCache = [];
                    $('#dir14').on('click', function(){
                      //returns directions
                        window.location.href = "#/map/"+theatresArray[14].theatreId;
                      });
                    $('#moreMove14').on('click', function(){
                      //scrolls down in your in-modal showtimes viewer
                      movieCache.push(showtimes.data[0]);
                      showtimes.data.shift();
                      var time = showtimes.data[0].showtimes[0].dateTime.split('');
                      var filteredTime = time.slice(time.length-5, time.length).join('');
            //this removes first item from list/cache and adds a new one to the end of modal list
                     $('.'+theatresArray[14].theatreId).find('li')[0].remove();
                     $('.'+theatresArray[14].theatreId).append(
                       '<li>'+showtimes.data[0].title+' '+filteredTime+'</li>')
                    })
                    //begin the "go up " button where you can see start times you already scanned through
                    $('#backMove14').on('click', function(){
                      if(movieCache.length > 0){
                        showtimes.data.splice(0,0, movieCache[movieCache.length-1]);
                        movieCache.pop();
                        //begin finding time
                        var time = showtimes.data[0].showtimes[0].dateTime.split('');
                        var filteredTime = time.slice(time.length-5, time.length).join('');
                        //end finding time
                        if(showtimes.data.length > 5){
                          $('.'+theatresArray[14].theatreId).find('li')[4].remove();
                        }
                        $('.'+theatresArray[14].theatreId).prepend(
                          '<li>'+showtimes.data[0].title+' '+filteredTime+'</li>'
                        );
                      }
                    })
                })
            })

            ///end of .then() callback
      })
      ///end navigator.geolocation callback
  })

  self.counter = true;

  var currentUrl = window.location.href;

  //self.getTheatre is the method for retrieveing a single theater's directions when a clicked on from list view, or to Load theaters by proximity
  self.theatreIf = function(){
    if(currentUrl == 'https://localhost:5000/#/map'){
      return true;
    } else {
      return false
    }
  }
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
            //
            // navigator.geolocation.getCurrentPosition(function(data){
            self.currentLocation = {lat: position.coords.latitude, lng: position.coords.longitude};

            var url = "https://data.tmsapi.com/v1.1/theatres?lat="+self.currentLocation.lat+'&lng='+self.currentLocation.lng+'&api_key=qf6mzc3fkprbntfd95db3hkk'

            $http.get(url)
             .success(function(data){
               self.rawData = data;
               var filteredData = [];
               var idCount = 1;

             }, function(err) {
               console.log(err);
             })
            // })
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
