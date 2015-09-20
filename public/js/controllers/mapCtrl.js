angular.module('mapCtrl', [])
  .controller('mapController', mapController);

function mapController($http, $routeParams){
  var self = this;
  navigator.geolocation.getCurrentPosition(function(data){
    var currentLoc = {lat: data.coords.latitude, lng: data.coords.longitude}
    $http.get("https://data.tmsapi.com/v1.1/theatres?lat="+currentLoc.lat+"&lng="+currentLoc.lng+"&radius=20&api_key=qf6mzc3fkprbntfd95db3hkk")
      .then(function(data){
        console.log(data);
        var theatresArray = [null];
        for (var i = 0; i < data.data.length; i++) {
          var theatreItem = {
            lat: parseFloat(data.data[i].location.geoCode.latitude), lng: parseFloat(data.data[i].location.geoCode.longitude), name: data.data[i].name,
            distance: data.data[i].location.distance,
            theatreId: data.data[i].theatreId}
          theatresArray.push(theatreItem);
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
        console.log(theatresArray);
        console.log('testing 1');

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
            /////////begin/////
            //////////////////
            var infoWindow1 = new google.maps.InfoWindow({
              content:
              //begin html content for infowindow
              "<div class='popoutBox' id='popoutBox1'>"+
                "<h4>"+theatresArray[1].name+"</h4>"+
                "<p>Upcoming Movietimes</p>"+
                "<ul class="+theatresArray[1].theatreId+">"+
                "</ul>" +
                "<button id='backMove1'>see earlier showtimes/|\\</button>" +
                "<br>" +
                "<button id='moreMove1'>see later showtimes\\|/</button>" +
                "<br>" +
                "<button class='direction' id='dir1'>Get Directions</button>" +
                "<button class='showtimes' id='"+theatresArray[1].theatreId+"'>See All Showtimes</button>"+
              "<div>"
            })
            marker1.addListener('click', function(){
              //api call to get showtime data
              $http.get('https://data.tmsapi.com/v1.1/theatres/'+theatresArray[1].theatreId+'/showings?startDate=2015-09-19&api_key=qf6mzc3fkprbntfd95db3hkk')
                .then(function(showtimes){
                  console.log(showtimes);
                  infoWindow1.open(map, marker1);
                  $('#dir1').on('click', function(){
                    window.location.href = "#/map/"+theatresArray[1].theatreId;
                  });
                  $('#'+theatresArray[1].theatreId).on('click', function(){
                    window.location.href = "/#/showtimes/"+theatresArray[1].theatreId
                  });
                  var movieCache = [];
                  $('#moreMove1').on('click', function(){
                    console.log(showtimes.data.length);
                    movieCache.push(showtimes.data[0]);
                    //movieCache will hold all "scrolled-through" listings
                    console.log(movieCache);
                    showtimes.data.shift();
                    console.log(showtimes.data.length);
                    console.log($('.'+theatresArray[1].theatreId).find('li')[0]);
                    //this removes first item from list/cache and adds a new one to the end of modal list
                   $('.'+theatresArray[1].theatreId).find('li')[0].remove();
                   $('.'+theatresArray[1].theatreId).append(
                     '<li>'+showtimes.data[5].title+' '+showtimes.data[5].showtimes[0].dateTime+'</li>')
                  })
                  //begin the "go up " button where you can see start times you already scanned through
                  $('#backMove1').on('click', function(){
                    var counterCounter = 0;
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
                      counterCounter++;
                    } else {
                      console.log('no earlier movie times');
                    }

                  })
                  if(showtimes.data.length > 0 && showtimes.data.length < 6){
                    for (var i = 0; i < showtimes.data.length; i++) {
                      var time = showtimes.data[i].showtimes[0].dateTime.split('');
                      var filteredTime = time.slice(time.length-5, time.length).join('');
                      //end finding time
                      $('.'+theatresArray[1].theatreId).append(
                        '<li>'+showtimes.data[i].title+' '+filteredTime+'</li>')
                    }
                  } else if(showtimes.data.length > 0 && showtimes.data.length > 5){
                    for (var i = 0; i < 6; i++) {
                      var time = showtimes.data[i].showtimes[0].dateTime.split('');
                      var filteredTime = time.slice(time.length-5, time.length).join('');
                      //finish filtering time for syntax
                      $('.'+theatresArray[1].theatreId).append(
                        '<li>'+showtimes.data[i].title+' '+filteredTime+'</li>')
                    }
                  }else {
                    $('.'+theatresArray[1].theatreId).append(
                      '<li>Sorry, no movies showing today</li>')
                  }
                })
              })
              /////////end/////
              //////////////////
              console.log('testing 2');

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
            /////////begin/////
            //////////////////
            var infoWindow2 = new google.maps.InfoWindow({
              content:
              //begin html content for infowindow
              "<div class='popoutBox' id='popoutBox2'>"+
                "<h4>"+theatresArray[2].name+"</h4>"+
                "<p>Upcoming Movietimes</p>"+
                "<ul class="+theatresArray[2].theatreId+">"+
                "</ul>" +
                "<button id='backMove2'>see earlier showtimes/|\\</button>" +
                "<br>" +
                "<button id='moreMove2'>see later showtimes\\|/</button>" +
                "<br>" +
                "<button class='direction' id='dir2'>Get Directions</button>" +
                "<button class='showtimes' id='"+theatresArray[2].theatreId+"'>See All Showtimes</button>"+
              "<div>"
            })
            marker2.addListener('click', function(){
              //api call to get showtime data
              $http.get('https://data.tmsapi.com/v1.1/theatres/'+theatresArray[2].theatreId+'/showings?startDate=2015-09-19&api_key=qf6mzc3fkprbntfd95db3hkk')
                .then(function(showtimes){
                  console.log(showtimes);
                  infoWindow2.open(map, marker2);
                  $('#dir2').on('click', function(){
                    window.location.href = "#/map/"+theatresArray[2].theatreId;
                  });
                  $('#'+theatresArray[2].theatreId).on('click', function(){
                    window.location.href = "/#/showtimes/"+theatresArray[2].theatreId
                  });
                  var movieCache = [];
                  $('#moreMove2').on('click', function(){
                    console.log(showtimes.data.length);
                    movieCache.push(showtimes.data[0]);
                    //movieCache will hold all "scrolled-through" listings
                    console.log(movieCache);
                    showtimes.data.shift();
                    console.log(showtimes.data.length);
                    console.log($('.'+theatresArray[2].theatreId).find('li')[0]);
                    //this removes first item from list/cache and adds a new one to the end of modal list
                   $('.'+theatresArray[2].theatreId).find('li')[0].remove();
                   $('.'+theatresArray[2].theatreId).append(
                     '<li>'+showtimes.data[5].title+' '+showtimes.data[5].showtimes[0].dateTime+'</li>')
                  })
                  //begin the "go up " button where you can see start times you already scanned through
                  $('#backMove2').on('click', function(){
                    var counterCounter = 0;
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
                      counterCounter++;
                    } else {
                      console.log('no earlier movie times');
                    }

                  })
                  if(showtimes.data.length > 0 && showtimes.data.length < 6){
                    for (var i = 0; i < showtimes.data.length; i++) {
                      var time = showtimes.data[i].showtimes[0].dateTime.split('');
                      var filteredTime = time.slice(time.length-5, time.length).join('');
                      //end finding time
                      $('.'+theatresArray[2].theatreId).append(
                        '<li>'+showtimes.data[i].title+' '+filteredTime+'</li>')
                    }
                  } else if(showtimes.data.length > 0 && showtimes.data.length > 5){
                    for (var i = 0; i < 6; i++) {
                      var time = showtimes.data[i].showtimes[0].dateTime.split('');
                      var filteredTime = time.slice(time.length-5, time.length).join('');
                      //finish filtering time for syntax
                      $('.'+theatresArray[2].theatreId).append(
                        '<li>'+showtimes.data[i].title+' '+filteredTime+'</li>')
                    }
                  }else {
                    $('.'+theatresArray[2].theatreId).append(
                      '<li>Sorry, no movies showing today</li>')
                  }
                })
              })
              /////////end/////
              //////////////////
              console.log('testing 3');

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

            /////////begin/////
            //////////////////
            var infoWindow3 = new google.maps.InfoWindow({
              content:
              //begin html content for infowindow
              "<div class='popoutBox' id='popoutBox3'>"+
                "<h4>"+theatresArray[3].name+"</h4>"+
                "<p>Upcoming Movietimes</p>"+
                "<ul class="+theatresArray[3].theatreId+">"+
                "</ul>" +
                "<button id='backMove3'>see earlier showtimes/|\\</button>" +
                "<br>" +
                "<button id='moreMove3'>see later showtimes\\|/</button>" +
                "<br>" +
                "<button class='direction' id='dir3'>Get Directions</button>" +
                "<button class='showtimes' id='"+theatresArray[3].theatreId+"'>See All Showtimes</button>"+
              "<div>"
            })
            marker3.addListener('click', function(){
              //api call to get showtime data
              $http.get('https://data.tmsapi.com/v1.1/theatres/'+theatresArray[3].theatreId+'/showings?startDate=2015-09-19&api_key=qf6mzc3fkprbntfd95db3hkk')
                .then(function(showtimes){
                  console.log(showtimes);
                  infoWindow3.open(map, marker3);
                  $('#dir3').on('click', function(){
                    window.location.href = "#/map/"+theatresArray[3].theatreId;
                  });
                  $('#'+theatresArray[3].theatreId).on('click', function(){
                    window.location.href = "/#/showtimes/"+theatresArray[3].theatreId
                  });
                  var movieCache = [];
                  $('#moreMove3').on('click', function(){
                    console.log(showtimes.data.length);
                    movieCache.push(showtimes.data[0]);
                    //movieCache will hold all "scrolled-through" listings
                    console.log(movieCache);
                    showtimes.data.shift();
                    console.log(showtimes.data.length);
                    console.log($('.'+theatresArray[3].theatreId).find('li')[0]);
                    //this removes first item from list/cache and adds a new one to the end of modal list
                   $('.'+theatresArray[3].theatreId).find('li')[0].remove();
                   $('.'+theatresArray[3].theatreId).append(
                     '<li>'+showtimes.data[5].title+' '+showtimes.data[5].showtimes[0].dateTime+'</li>')
                  })
                  //begin the "go up " button where you can see start times you already scanned through
                  $('#backMove3').on('click', function(){
                    var counterCounter = 0;
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
                      counterCounter++;
                    } else {
                      console.log('no earlier movie times');
                    }

                  })
                  if(showtimes.data.length > 0 && showtimes.data.length < 6){
                    for (var i = 0; i < showtimes.data.length; i++) {
                      var time = showtimes.data[i].showtimes[0].dateTime.split('');
                      var filteredTime = time.slice(time.length-5, time.length).join('');
                      //end finding time
                      $('.'+theatresArray[3].theatreId).append(
                        '<li>'+showtimes.data[i].title+' '+filteredTime+'</li>')
                    }
                  } else if(showtimes.data.length > 0 && showtimes.data.length > 5){
                    for (var i = 0; i < 6; i++) {
                      var time = showtimes.data[i].showtimes[0].dateTime.split('');
                      var filteredTime = time.slice(time.length-5, time.length).join('');
                      //finish filtering time for syntax
                      $('.'+theatresArray[3].theatreId).append(
                        '<li>'+showtimes.data[i].title+' '+filteredTime+'</li>')
                    }
                  }else {
                    $('.'+theatresArray[3].theatreId).append(
                      '<li>Sorry, no movies showing today</li>')
                  }
                })
              })
              /////////end/////
              //////////////////
              console.log('testing 3');

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

            /////////begin/////
            //////////////////
            var infoWindow4 = new google.maps.InfoWindow({
              content:
              //begin html content for infowindow
              "<div class='popoutBox' id='popoutBox4'>"+
                "<h4>"+theatresArray[4].name+"</h4>"+
                "<p>Upcoming Movietimes</p>"+
                "<ul class="+theatresArray[4].theatreId+">"+
                "</ul>" +
                "<button id='backMove4'>see earlier showtimes/|\\</button>" +
                "<br>" +
                "<button id='moreMove4'>see later showtimes\\|/</button>" +
                "<br>" +
                "<button class='direction' id='dir4'>Get Directions</button>" +
                "<button class='showtimes' id='"+theatresArray[4].theatreId+"'>See All Showtimes</button>"+
              "<div>"
            })
            marker4.addListener('click', function(){
              //api call to get showtime data
              $http.get('https://data.tmsapi.com/v1.1/theatres/'+theatresArray[4].theatreId+'/showings?startDate=2015-09-19&api_key=qf6mzc3fkprbntfd95db3hkk')
                .then(function(showtimes){
                  console.log(showtimes);
                  infoWindow4.open(map, marker4);
                  $('#dir4').on('click', function(){
                    window.location.href = "#/map/"+theatresArray[4].theatreId;
                  });
                  $('#'+theatresArray[4].theatreId).on('click', function(){
                    window.location.href = "/#/showtimes/"+theatresArray[4].theatreId
                  });
                  var movieCache = [];
                  $('#moreMove4').on('click', function(){
                    console.log(showtimes.data.length);
                    movieCache.push(showtimes.data[0]);
                    //movieCache will hold all "scrolled-through" listings
                    console.log(movieCache);
                    showtimes.data.shift();
                    console.log(showtimes.data.length);
                    console.log($('.'+theatresArray[4].theatreId).find('li')[0]);
                    //this removes first item from list/cache and adds a new one to the end of modal list
                   $('.'+theatresArray[4].theatreId).find('li')[0].remove();
                   $('.'+theatresArray[4].theatreId).append(
                     '<li>'+showtimes.data[5].title+' '+showtimes.data[5].showtimes[0].dateTime+'</li>')
                  })
                  //begin the "go up " button where you can see start times you already scanned through
                  $('#backMove4').on('click', function(){
                    var counterCounter = 0;
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
                      counterCounter++;
                    } else {
                      console.log('no earlier movie times');
                    }

                  })
                  if(showtimes.data.length > 0 && showtimes.data.length < 6){
                    for (var i = 0; i < showtimes.data.length; i++) {
                      var time = showtimes.data[i].showtimes[0].dateTime.split('');
                      var filteredTime = time.slice(time.length-5, time.length).join('');
                      //end finding time
                      $('.'+theatresArray[4].theatreId).append(
                        '<li>'+showtimes.data[i].title+' '+filteredTime+'</li>')
                    }
                  } else if(showtimes.data.length > 0 && showtimes.data.length > 5){
                    for (var i = 0; i < 6; i++) {
                      var time = showtimes.data[i].showtimes[0].dateTime.split('');
                      var filteredTime = time.slice(time.length-5, time.length).join('');
                      //finish filtering time for syntax
                      $('.'+theatresArray[4].theatreId).append(
                        '<li>'+showtimes.data[i].title+' '+filteredTime+'</li>')
                    }
                  }else {
                    $('.'+theatresArray[4].theatreId).append(
                      '<li>Sorry, no movies showing today</li>')
                  }
                })
              })
              /////////end/////
              /////////////////

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

            /////////begin/////
            //////////////////
            var infoWindow5 = new google.maps.InfoWindow({
              content:
              //begin html content for infowindow
              "<div class='popoutBox' id='popoutBox5'>"+
                "<h4>"+theatresArray[5].name+"</h4>"+
                "<p>Upcoming Movietimes</p>"+
                "<ul class="+theatresArray[5].theatreId+">"+
                "</ul>" +
                "<button id='backMove5'>see earlier showtimes/|\\</button>" +
                "<br>" +
                "<button id='moreMove5'>see later showtimes\\|/</button>" +
                "<br>" +
                "<button class='direction' id='dir5'>Get Directions</button>" +
                "<button class='showtimes' id='"+theatresArray[5].theatreId+"'>See All Showtimes</button>"+
              "<div>"
            })
            marker5.addListener('click', function(){
              //api call to get showtime data
              $http.get('https://data.tmsapi.com/v1.1/theatres/'+theatresArray[5].theatreId+'/showings?startDate=2015-09-19&api_key=qf6mzc3fkprbntfd95db3hkk')
                .then(function(showtimes){
                  console.log(showtimes);
                  infoWindow5.open(map, marker5);
                  $('#dir5').on('click', function(){
                    window.location.href = "#/map/"+theatresArray[5].theatreId;
                  });
                  $('#'+theatresArray[5].theatreId).on('click', function(){
                    window.location.href = "/#/showtimes/"+theatresArray[5].theatreId
                  });
                  var movieCache = [];
                  $('#moreMove5').on('click', function(){
                    console.log(showtimes.data.length);
                    movieCache.push(showtimes.data[0]);
                    //movieCache will hold all "scrolled-through" listings
                    console.log(movieCache);
                    showtimes.data.shift();
                    console.log(showtimes.data.length);
                    console.log($('.'+theatresArray[5].theatreId).find('li')[0]);
                    //this removes first item from list/cache and adds a new one to the end of modal list
                   $('.'+theatresArray[5].theatreId).find('li')[0].remove();
                   $('.'+theatresArray[5].theatreId).append(
                     '<li>'+showtimes.data[5].title+' '+showtimes.data[5].showtimes[0].dateTime+'</li>')
                  })
                  //begin the "go up " button where you can see start times you already scanned through
                  $('#backMove5').on('click', function(){
                    var counterCounter = 0;
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
                      counterCounter++;
                    } else {
                      console.log('no earlier movie times');
                    }

                  })
                  if(showtimes.data.length > 0 && showtimes.data.length < 6){
                    for (var i = 0; i < showtimes.data.length; i++) {
                      var time = showtimes.data[i].showtimes[0].dateTime.split('');
                      var filteredTime = time.slice(time.length-5, time.length).join('');
                      //end finding time
                      $('.'+theatresArray[5].theatreId).append(
                        '<li>'+showtimes.data[i].title+' '+filteredTime+'</li>')
                    }
                  } else if(showtimes.data.length > 0 && showtimes.data.length > 5){
                    for (var i = 0; i < 6; i++) {
                      var time = showtimes.data[i].showtimes[0].dateTime.split('');
                      var filteredTime = time.slice(time.length-5, time.length).join('');
                      //finish filtering time for syntax
                      $('.'+theatresArray[5].theatreId).append(
                        '<li>'+showtimes.data[i].title+' '+filteredTime+'</li>')
                    }
                  }else {
                    $('.'+theatresArray[5].theatreId).append(
                      '<li>Sorry, no movies showing today</li>')
                  }
                })
              })
              /////////end/////
              //////////////////

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

            /////////begin/////
            //////////////////
            var infoWindow6 = new google.maps.InfoWindow({
              content:
              //begin html content for infowindow
              "<div class='popoutBox' id='popoutBox6'>"+
                "<h4>"+theatresArray[6].name+"</h4>"+
                "<p>Upcoming Movietimes</p>"+
                "<ul class="+theatresArray[6].theatreId+">"+
                "</ul>" +
                "<button id='backMove6'>see earlier showtimes/|\\</button>" +
                "<br>" +
                "<button id='moreMove6'>see later showtimes\\|/</button>" +
                "<br>" +
                "<button class='direction' id='dir6'>Get Directions</button>" +
                "<button class='showtimes' id='"+theatresArray[6].theatreId+"'>See All Showtimes</button>"+
              "<div>"
            })
            marker6.addListener('click', function(){
              //api call to get showtime data
              $http.get('https://data.tmsapi.com/v1.1/theatres/'+theatresArray[6].theatreId+'/showings?startDate=2015-09-19&api_key=qf6mzc3fkprbntfd95db3hkk')
                .then(function(showtimes){
                  console.log(showtimes);
                  infoWindow6.open(map, marker6);
                  $('#dir6').on('click', function(){
                    window.location.href = "#/map/"+theatresArray[6].theatreId;
                  });
                  $('#'+theatresArray[6].theatreId).on('click', function(){
                    window.location.href = "/#/showtimes/"+theatresArray[6].theatreId
                  });
                  var movieCache = [];
                  $('#moreMove6').on('click', function(){
                    console.log(showtimes.data.length);
                    movieCache.push(showtimes.data[0]);
                    //movieCache will hold all "scrolled-through" listings
                    console.log(movieCache);
                    showtimes.data.shift();
                    console.log(showtimes.data.length);
                    console.log($('.'+theatresArray[6].theatreId).find('li')[0]);
                    //this removes first item from list/cache and adds a new one to the end of modal list
                   $('.'+theatresArray[6].theatreId).find('li')[0].remove();
                   $('.'+theatresArray[6].theatreId).append(
                     '<li>'+showtimes.data[5].title+' '+showtimes.data[5].showtimes[0].dateTime+'</li>')
                  })
                  //begin the "go up " button where you can see start times you already scanned through
                  $('#backMove6').on('click', function(){
                    var counterCounter = 0;
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
                      counterCounter++;
                    } else {
                      console.log('no earlier movie times');
                    }

                  })
                  if(showtimes.data.length > 0 && showtimes.data.length < 6){
                    for (var i = 0; i < showtimes.data.length; i++) {
                      var time = showtimes.data[i].showtimes[0].dateTime.split('');
                      var filteredTime = time.slice(time.length-5, time.length).join('');
                      //end finding time
                      $('.'+theatresArray[6].theatreId).append(
                        '<li>'+showtimes.data[i].title+' '+filteredTime+'</li>')
                    }
                  } else if(showtimes.data.length > 0 && showtimes.data.length > 5){
                    for (var i = 0; i < 6; i++) {
                      var time = showtimes.data[i].showtimes[0].dateTime.split('');
                      var filteredTime = time.slice(time.length-5, time.length).join('');
                      //finish filtering time for syntax
                      $('.'+theatresArray[6].theatreId).append(
                        '<li>'+showtimes.data[i].title+' '+filteredTime+'</li>')
                    }
                  }else {
                    $('.'+theatresArray[6].theatreId).append(
                      '<li>Sorry, no movies showing today</li>')
                  }
                })
              })
              /////////end/////
              //////////////////

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

            /////////begin/////
            //////////////////
            var infoWindow7 = new google.maps.InfoWindow({
              content:
              //begin html content for infowindow
              "<div class='popoutBox' id='popoutBox7'>"+
                "<h4>"+theatresArray[7].name+"</h4>"+
                "<p>Upcoming Movietimes</p>"+
                "<ul class="+theatresArray[7].theatreId+">"+
                "</ul>" +
                "<button id='backMove7'>see earlier showtimes/|\\</button>" +
                "<br>" +
                "<button id='moreMove7'>see later showtimes\\|/</button>" +
                "<br>" +
                "<button class='direction' id='dir7'>Get Directions</button>" +
                "<button class='showtimes' id='"+theatresArray[7].theatreId+"'>See All Showtimes</button>"+
              "<div>"
            })
            marker7.addListener('click', function(){
              //api call to get showtime data
              $http.get('https://data.tmsapi.com/v1.1/theatres/'+theatresArray[7].theatreId+'/showings?startDate=2015-09-19&api_key=qf6mzc3fkprbntfd95db3hkk')
                .then(function(showtimes){
                  console.log(showtimes);
                  infoWindow7.open(map, marker7);
                  $('#dir7').on('click', function(){
                    window.location.href = "#/map/"+theatresArray[7].theatreId;
                  });
                  $('#'+theatresArray[7].theatreId).on('click', function(){
                    window.location.href = "/#/showtimes/"+theatresArray[7].theatreId
                  });
                  var movieCache = [];
                  $('#moreMove7').on('click', function(){
                    console.log(showtimes.data.length);
                    movieCache.push(showtimes.data[0]);
                    //movieCache will hold all "scrolled-through" listings
                    console.log(movieCache);
                    showtimes.data.shift();
                    console.log(showtimes.data.length);
                    console.log($('.'+theatresArray[7].theatreId).find('li')[0]);
                    //this removes first item from list/cache and adds a new one to the end of modal list
                   $('.'+theatresArray[7].theatreId).find('li')[0].remove();
                   $('.'+theatresArray[7].theatreId).append(
                     '<li>'+showtimes.data[5].title+' '+showtimes.data[5].showtimes[0].dateTime+'</li>')
                  })
                  //begin the "go up " button where you can see start times you already scanned through
                  $('#backMove7').on('click', function(){
                    var counterCounter = 0;
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
                      counterCounter++;
                    } else {
                      console.log('no earlier movie times');
                    }

                  })
                  if(showtimes.data.length > 0 && showtimes.data.length < 6){
                    for (var i = 0; i < showtimes.data.length; i++) {
                      var time = showtimes.data[i].showtimes[0].dateTime.split('');
                      var filteredTime = time.slice(time.length-5, time.length).join('');
                      //end finding time
                      $('.'+theatresArray[7].theatreId).append(
                        '<li>'+showtimes.data[i].title+' '+filteredTime+'</li>')
                    }
                  } else if(showtimes.data.length > 0 && showtimes.data.length > 5){
                    for (var i = 0; i < 6; i++) {
                      var time = showtimes.data[i].showtimes[0].dateTime.split('');
                      var filteredTime = time.slice(time.length-5, time.length).join('');
                      //finish filtering time for syntax
                      $('.'+theatresArray[7].theatreId).append(
                        '<li>'+showtimes.data[i].title+' '+filteredTime+'</li>')
                    }
                  }else {
                    $('.'+theatresArray[7].theatreId).append(
                      '<li>Sorry, no movies showing today</li>')
                  }
                })
              })
              /////////end/////
              //////////////////

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

            /////////begin/////
            //////////////////
            var infoWindow8 = new google.maps.InfoWindow({
              content:
              //begin html content for infowindow
              "<div class='popoutBox' id='popoutBox8'>"+
                "<h4>"+theatresArray[8].name+"</h4>"+
                "<p>Upcoming Movietimes</p>"+
                "<ul class="+theatresArray[8].theatreId+">"+
                "</ul>" +
                "<button id='backMove8'>see earlier showtimes/|\\</button>" +
                "<br>" +
                "<button id='moreMove8'>see later showtimes\\|/</button>" +
                "<br>" +
                "<button class='direction' id='dir8'>Get Directions</button>" +
                "<button class='showtimes' id='"+theatresArray[8].theatreId+"'>See All Showtimes</button>"+
              "<div>"
            })
            marker8.addListener('click', function(){
              //api call to get showtime data
              $http.get('https://data.tmsapi.com/v1.1/theatres/'+theatresArray[2].theatreId+'/showings?startDate=2015-09-19&api_key=qf6mzc3fkprbntfd95db3hkk')
                .then(function(showtimes){
                  console.log(showtimes);
                  infoWindow8.open(map, marker8);
                  $('#dir8').on('click', function(){
                    window.location.href = "#/map/"+theatresArray[8].theatreId;
                  });
                  $('#'+theatresArray[8].theatreId).on('click', function(){
                    window.location.href = "/#/showtimes/"+theatresArray[8].theatreId
                  });
                  var movieCache = [];
                  $('#moreMove8').on('click', function(){
                    console.log(showtimes.data.length);
                    movieCache.push(showtimes.data[0]);
                    //movieCache will hold all "scrolled-through" listings
                    console.log(movieCache);
                    showtimes.data.shift();
                    console.log(showtimes.data.length);
                    console.log($('.'+theatresArray[8].theatreId).find('li')[0]);
                    //this removes first item from list/cache and adds a new one to the end of modal list
                   $('.'+theatresArray[8].theatreId).find('li')[0].remove();
                   $('.'+theatresArray[8].theatreId).append(
                     '<li>'+showtimes.data[5].title+' '+showtimes.data[5].showtimes[0].dateTime+'</li>')
                  })
                  //begin the "go up " button where you can see start times you already scanned through
                  $('#backMove8').on('click', function(){
                    var counterCounter = 0;
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
                      counterCounter++;
                    } else {
                      console.log('no earlier movie times');
                    }

                  })
                  if(showtimes.data.length > 0 && showtimes.data.length < 6){
                    for (var i = 0; i < showtimes.data.length; i++) {
                      var time = showtimes.data[i].showtimes[0].dateTime.split('');
                      var filteredTime = time.slice(time.length-5, time.length).join('');
                      //end finding time
                      $('.'+theatresArray[8].theatreId).append(
                        '<li>'+showtimes.data[i].title+' '+filteredTime+'</li>')
                    }
                  } else if(showtimes.data.length > 0 && showtimes.data.length > 5){
                    for (var i = 0; i < 6; i++) {
                      var time = showtimes.data[i].showtimes[0].dateTime.split('');
                      var filteredTime = time.slice(time.length-5, time.length).join('');
                      //finish filtering time for syntax
                      $('.'+theatresArray[8].theatreId).append(
                        '<li>'+showtimes.data[i].title+' '+filteredTime+'</li>')
                    }
                  }else {
                    $('.'+theatresArray[8].theatreId).append(
                      '<li>Sorry, no movies showing today</li>')
                  }
                })
              })
              /////////end/////
              //////////////////

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

            /////////begin/////
            //////////////////
            var infoWindow9 = new google.maps.InfoWindow({
              content:
              //begin html content for infowindow
              "<div class='popoutBox' id='popoutBox9'>"+
                "<h4>"+theatresArray[9].name+"</h4>"+
                "<p>Upcoming Movietimes</p>"+
                "<ul class="+theatresArray[9].theatreId+">"+
                "</ul>" +
                "<button id='backMove9'>see earlier showtimes/|\\</button>" +
                "<br>" +
                "<button id='moreMove9'>see later showtimes\\|/</button>" +
                "<br>" +
                "<button class='direction' id='dir9'>Get Directions</button>" +
                "<button class='showtimes' id='"+theatresArray[9].theatreId+"'>See All Showtimes</button>"+
              "<div>"
            })
            marker9.addListener('click', function(){
              //api call to get showtime data
              $http.get('https://data.tmsapi.com/v1.1/theatres/'+theatresArray[9].theatreId+'/showings?startDate=2015-09-19&api_key=qf6mzc3fkprbntfd95db3hkk')
                .then(function(showtimes){
                  console.log(showtimes);
                  infoWindow9.open(map, marker9);
                  $('#dir9').on('click', function(){
                    window.location.href = "#/map/"+theatresArray[9].theatreId;
                  });
                  $('#'+theatresArray[9].theatreId).on('click', function(){
                    window.location.href = "/#/showtimes/"+theatresArray[9].theatreId
                  });
                  var movieCache = [];
                  $('#moreMove9').on('click', function(){
                    console.log(showtimes.data.length);
                    movieCache.push(showtimes.data[0]);
                    //movieCache will hold all "scrolled-through" listings
                    console.log(movieCache);
                    showtimes.data.shift();
                    console.log(showtimes.data.length);
                    console.log($('.'+theatresArray[9].theatreId).find('li')[0]);
                    //this removes first item from list/cache and adds a new one to the end of modal list
                   $('.'+theatresArray[9].theatreId).find('li')[0].remove();
                   $('.'+theatresArray[9].theatreId).append(
                     '<li>'+showtimes.data[5].title+' '+showtimes.data[5].showtimes[0].dateTime+'</li>')
                  })
                  //begin the "go up " button where you can see start times you already scanned through
                  $('#backMove9').on('click', function(){
                    var counterCounter = 0;
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
                      counterCounter++;
                    } else {
                      console.log('no earlier movie times');
                    }

                  })
                  if(showtimes.data.length > 0 && showtimes.data.length < 6){
                    for (var i = 0; i < showtimes.data.length; i++) {
                      var time = showtimes.data[i].showtimes[0].dateTime.split('');
                      var filteredTime = time.slice(time.length-5, time.length).join('');
                      //end finding time
                      $('.'+theatresArray[9].theatreId).append(
                        '<li>'+showtimes.data[i].title+' '+filteredTime+'</li>')
                    }
                  } else if(showtimes.data.length > 0 && showtimes.data.length > 5){
                    for (var i = 0; i < 6; i++) {
                      var time = showtimes.data[i].showtimes[0].dateTime.split('');
                      var filteredTime = time.slice(time.length-5, time.length).join('');
                      //finish filtering time for syntax
                      $('.'+theatresArray[9].theatreId).append(
                        '<li>'+showtimes.data[i].title+' '+filteredTime+'</li>')
                    }
                  }else {
                    $('.'+theatresArray[9].theatreId).append(
                      '<li>Sorry, no movies showing today</li>')
                  }
                })
              })
              /////////end/////
              //////////////////

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

            /////////begin/////
            //////////////////
            var infoWindow10 = new google.maps.InfoWindow({
              content:
              //begin html content for infowindow
              "<div class='popoutBox' id='popoutBox10'>"+
                "<h4>"+theatresArray[10].name+"</h4>"+
                "<p>Upcoming Movietimes</p>"+
                "<ul class="+theatresArray[10].theatreId+">"+
                "</ul>" +
                "<button id='backMove10'>see earlier showtimes/|\\</button>" +
                "<br>" +
                "<button id='moreMove10'>see later showtimes\\|/</button>" +
                "<br>" +
                "<button class='direction' id='dir10'>Get Directions</button>" +
                "<button class='showtimes' id='"+theatresArray[10].theatreId+"'>See All Showtimes</button>"+
              "<div>"
            })
            marker10.addListener('click', function(){
              //api call to get showtime data
              $http.get('https://data.tmsapi.com/v1.1/theatres/'+theatresArray[10].theatreId+'/showings?startDate=2015-09-19&api_key=qf6mzc3fkprbntfd95db3hkk')
                .then(function(showtimes){
                  console.log(showtimes);
                  infoWindow10.open(map, marker10);
                  $('#dir10').on('click', function(){
                    window.location.href = "#/map/"+theatresArray[10].theatreId;
                  });
                  $('#'+theatresArray[10].theatreId).on('click', function(){
                    window.location.href = "/#/showtimes/"+theatresArray[10].theatreId
                  });
                  var movieCache = [];
                  $('#moreMove10').on('click', function(){
                    console.log(showtimes.data.length);
                    movieCache.push(showtimes.data[0]);
                    //movieCache will hold all "scrolled-through" listings
                    console.log(movieCache);
                    showtimes.data.shift();
                    console.log(showtimes.data.length);
                    console.log($('.'+theatresArray[10].theatreId).find('li')[0]);
                    //this removes first item from list/cache and adds a new one to the end of modal list
                   $('.'+theatresArray[10].theatreId).find('li')[0].remove();
                   $('.'+theatresArray[10].theatreId).append(
                     '<li>'+showtimes.data[5].title+' '+showtimes.data[5].showtimes[0].dateTime+'</li>')
                  })
                  //begin the "go up " button where you can see start times you already scanned through
                  $('#backMove10').on('click', function(){
                    var counterCounter = 0;
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
                      counterCounter++;
                    } else {
                      console.log('no earlier movie times');
                    }

                  })
                  if(showtimes.data.length > 0 && showtimes.data.length < 6){
                    for (var i = 0; i < showtimes.data.length; i++) {
                      var time = showtimes.data[i].showtimes[0].dateTime.split('');
                      var filteredTime = time.slice(time.length-5, time.length).join('');
                      //end finding time
                      $('.'+theatresArray[10].theatreId).append(
                        '<li>'+showtimes.data[i].title+' '+filteredTime+'</li>')
                    }
                  } else if(showtimes.data.length > 0 && showtimes.data.length > 5){
                    for (var i = 0; i < 6; i++) {
                      var time = showtimes.data[i].showtimes[0].dateTime.split('');
                      var filteredTime = time.slice(time.length-5, time.length).join('');
                      //finish filtering time for syntax
                      $('.'+theatresArray[10].theatreId).append(
                        '<li>'+showtimes.data[i].title+' '+filteredTime+'</li>')
                    }
                  }else {
                    $('.'+theatresArray[10].theatreId).append(
                      '<li>Sorry, no movies showing today</li>')
                  }
                })
              })
              /////////end/////
              //////////////////
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

               }, function(err) {
                 console.log(err);
               })
            })
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
