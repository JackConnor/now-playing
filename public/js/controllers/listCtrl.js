angular.module('listCtrl', [])
  .controller('listController', listController);

function listController($http, $routeParams){
  var self = this;
  //finding the date on load and feeding it to the tmsapi to initially populate the list based on the user's location
  var currentDate = new Date();
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
  console.log(formatDate);
  //end finding today's date with formatting for api call
  //begin api call for the data to populate the list view
  var url = 'http://data.tmsapi.com/v1.1/movies/showings?startDate='+formatDate+'&zip=90036&api_key=qf6mzc3fkprbntfd95db3hkk'
  console.log(url);
  $http.get(url)
   .success(function(data){
     console.log(data);
     self.rawData = data;
     var filteredData = [];
     var idCount = 1;
     for (var i = 0; i < self.rawData.length; i++) {
      var showtimes = self.rawData[i].showtimes;
      //  console.log(showtimes);
      for (var j = 0; j < showtimes.length; j++) {
        var length = showtimes[j].dateTime.split('').length;
        var time = showtimes[j].dateTime.split('').slice(length-5, length).join('');
        self.runTime = self.rawData[i].runTime;
        console.log("run time is:",self.runTime);
        var item = {
          movieName: self.rawData[i].title,
          time: time,
          theatreId: showtimes[j].theatre.id,
          theatreName: showtimes[j].theatre.name,
          id: idCount,
          runTime: self.rawData[i].runTime
        }
        filteredData.push(item);
        idCount++;
      }
     }
     self.data = filteredData;
   })



  var buttonCounter = true;

//this is the function to open the secret button window when you click on an movie
  self.openButtons = function(movie){
    //jquery stuff
    if (buttonCounter) {
      // $('#'+id).css('margin-bottom', 100+"px");
      $('#'+movie.id).append('<div class="row"><div class="buttonContainer col-md-8 col-md-offset-2 col-xs-12 col-xs-offset-0" id=abc'+movie.id+'><button class="mapButton btn-default">Get Directions</button><button class="detailsButton btn-default">See Movie Details</button></div></div>')
      console.log('lowering button container');
      //adding event listeners
      $('.detailsButton').on('click', function(){
        console.log('testing');
        window.location.href = "/#/list/"+movie.movieName;
      })

      $(".mapButton").on('click', function(){
        console.log('testing map button');
        window.location.href = "/#/map/"+movie.theatreId;
      })

      //end event listeners
      buttonCounter = !buttonCounter;
      return buttonCounter;
    }
    else if(!buttonCounter) {
      console.log('#abc'+id);
      $('#abc'+id).remove();
      console.log('raising button container');
      $('#'+id).css('margin-bottom', 4+'px');
      buttonCounter = !buttonCounter;
      return buttonCounter;

    } else {
      console.log('something weird happened');
    }
  }
  //end function for button window

  self.getMovie = function(){
    console.log('movie bitches!!!!!!!');
    console.log($routeParams.id);
    var key = "a9e6b3f7506ddf2d1499a135372be9f7";
    var url = "http://api.themoviedb.org/3/search/movie?query="+$routeParams.id+"&api_key="

    //single movie detail http call to return additional movie details
    console.log(self.movieTitle);
    console.log(self.runTime);
    $http.get(url+key)
      .success(function(data){
      console.log(data);
      //begin passing my data to my angular frontend via self.'s
      self.posterLink = "http://image.tmdb.org/t/p/w500"+data.results[0].poster_path;
      self.movieDescription = data.results[0].overview;
      console.log(self.movieDescription);
      self.movieTitle = data.results[0].title;
      console.log(self.movieTitle);
      console.log("the running time for this movie should be: "+self.runTime);
    })
  }
}
