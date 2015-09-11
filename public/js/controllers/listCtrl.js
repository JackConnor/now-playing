angular.module('listCtrl', [])
  .controller('listController', listController);

function listController($http, $routeParams){
  var self = this;

  function setMap(){
    $('#map').css("height", 0+"px");
  }
  setMap();
  //finding the date on load and feeding it to the tmsapi to initially populate the list based on the user's location
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

  // var currentLocation = navigator.geolocation.getCurrentPosition(function(data){
  //   self.currentLocation = {lat: data.coords.latitude, lng: data.coords.longitude}
  // })
  // self.currentLocation = currentLocation();
  //end finding today's date with formatting for api call
  //begin api call for the data to populate the list view
  var url = 'https://data.tmsapi.com/v1.1/movies/showings?startDate='+formatDate+'&zip=90036&api_key=qf6mzc3fkprbntfd95db3hkk'
  $http.get(url)
   .success(function(data){
     self.rawData = data;
     var filteredData = [];
     var idCount = 1;
     for (var i = 0; i < self.rawData.length; i++) {
      var showtimes = self.rawData[i].showtimes;
      //  console.log(showtimes);
      for (var j = 0; j < showtimes.length; j++) {

        //start getting showtimes
        var length = showtimes[j].dateTime.split('').length;
        self.startTime = showtimes[j].dateTime.split('').slice(length-5, length).join('');
        console.log('time is: '+self.startTime);
        //end getting showtimes

        //begin getting now's time
        var currentTime = new Date();
        var currMin = currentTime.getMinutes();
        var currHour = currentTime.getHours();
        self.currentTime = currHour+":"+currMin;
        ///end gettting current time

        ///getting the movies runtime
        self.runTime = self.rawData[i].runTime;
        var runHours = self.runTime.slice(self.runTime.length-6, self.runTime.length-4);
        var runMinutes = self.runTime.slice(self.runTime.length-3, self.runTime.length-1);
        self.runTime = runHours+":"+runMinutes
        ///end getting movies runtime

        var item = {
          movieName: self.rawData[i].title,
          theatreId: showtimes[j].theatre.id,
          theatreName: showtimes[j].theatre.name,
          id: idCount,
          runTime: self.runTime,
          startTime: self.startTime
        }
        ///if statement to see if runtime comes after current time

        if (self.startTime > self.currentTime) {
          filteredData.push(item);
          idCount++;
        } else {
        }
      }
     }
     filteredData.sort(function(a, b) {
      return parseFloat(a.startTime) - parseFloat(b.startTime);
     });
     console.log(filteredData);
     self.data = filteredData;
   })



  var buttonCounter = true;

//this is the function to open the secret button window when you click on an movie
  self.openButtons = function(movie){
    //jquery stuff
    if (buttonCounter) {
      // $('#'+id).css('margin-bottom', 100+"px");
      $('#'+movie.id).append('<div class="row"><div class="buttonContainer col-md-8 col-md-offset-2 col-xs-12 col-xs-offset-0" id=abc'+movie.id+'><button class="mapButton btn-default">Get Directions</button><button class="detailsButton btn-default">See Movie Details</button></div></div>')
      //adding event listeners
      $('.detailsButton').on('click', function(){
        window.location.href = "/#/list/"+movie.movieName;
      })

      $(".mapButton").on('click', function(){
        window.location.href = "/#/map/"+movie.theatreId;
      })

      //end event listeners
      buttonCounter = !buttonCounter;
      return buttonCounter;
    }
    else if(!buttonCounter) {
      $('#abc'+id).remove();
      $('#'+id).css('margin-bottom', 4+'px');
      buttonCounter = !buttonCounter;
      return buttonCounter;

    } else {
    }
  }
  //end function for button window

  self.getMovie = function(){
    var key = "a9e6b3f7506ddf2d1499a135372be9f7";
    var url = "https://api.themoviedb.org/3/search/movie?query="+$routeParams.id+"&api_key="

    //single movie detail http call to return additional movie details

    $http.get(url+key)
      .success(function(data){
      //begin passing my data to my angular frontend via self.'s
      self.posterLink = "https://image.tmdb.org/t/p/w500"+data.results[0].poster_path;
      self.movieDescription = data.results[0].overview;
      self.movieTitle = data.results[0].title;
      self.startTime = self.startTime;
    })
  }
}
