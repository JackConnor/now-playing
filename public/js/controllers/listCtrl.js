angular.module('listCtrl', [])
  .controller('listController', listController);

function listController($http, $routeParams){
  var self = this;
  console.log($routeParams.id);
  // console.log(route.curretn.params);

  $http.get('http://data.tmsapi.com/v1.1/movies/showings?startDate=2015-09-09&zip=90036&api_key=qf6mzc3fkprbntfd95db3hkk')
   .success(function(data){
     self.rawData = data;
     var filteredData = [];
     var idCount = 1;
     for (var i = 0; i < self.rawData.length; i++) {
      var showtimes = self.rawData[i].showtimes;
      //  console.log(showtimes);
      for (var j = 0; j < showtimes.length; j++) {
        var length = showtimes[j].dateTime.split('').length;
        var time = showtimes[j].dateTime.split('').slice(length-5, length).join('');

        var item = {
          movieName: self.rawData[i].title, time: time,
          theatreId: showtimes[j].theatre.id,
          theatreName: showtimes[j].theatre.name,
          id: idCount
        }
        filteredData.push(item);
        idCount++;
      }
     }
     console.log(filteredData);
     self.data = filteredData;
   })



  var buttonCounter = true;

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

  self.getMovie = function(){
    console.log('movie bitches!!!!!!!');
    console.log($routeParams.id);
    var key = "a9e6b3f7506ddf2d1499a135372be9f7";
    var url = "http://api.themoviedb.org/3/search/movie?query="+$routeParams.id+"&api_key="

    $http.get(url+key)
      .success(function(data){
      console.log(data);
      self.posterLink = "http://image.tmdb.org/t/p/w500"+data.results[0].poster_path;
    })
  }
}
