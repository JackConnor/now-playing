angular.module('listCtrl', [])
  .controller('listController', listController);

function listController($http, $routeParams){
  var self = this;
  var itemsArray = [{name:"test mofo"}];

  function setMap(){
    $('#map').css("height", 0+"px");
    $('#map').css("width", 0+"px");
  }
  setMap();
  //finding the date on load and feeding it to the tmsapi to initially populate the list based on the user's location
  var currentDate = new Date();
  self.currentDate = currentDate;
  var year = currentDate.getFullYear();
  var month = function(){
    if(currentDate.getMonth() < 9){
      var fullMonth = "0" + (currentDate.getMonth()+1);
      var fullMonthInt = parseInt(fullMonth);
      return fullMonth
    } else {
      return (currentDate.getMonth()+1)
    };
  }
  var day = currentDate.getDate();
  var formatDate = year + "-"+month()+"-"+day;
  self.formatDate = formatDate;
  console.log(self.formatDate);

///were about to attempt a big if statement for itemsArray
/////////////////////////////////////////////
//////begin if, with no pre-existing window.Object.locationStuff
if(window.Object.locationStuff){
  ////if you've already been here
  ///porting in data from the window, which we saved when we got here
  var data = window.Object.locationStuff

  var currentTime = new Date();
  var currMin = currentTime.getMinutes();
  if (currMin < 10) {
    currMin = "0"+currMin
  }
  var currHour = currentTime.getHours();
  self.currentTime = currHour+":"+currMin;
  ///end gettting current time
  self.currentLocation = {lat: data.coords.latitude, lng: data.coords.longitude};
  var url = 'https://data.tmsapi.com/v1.1/movies/showings?radius=20&startDate='+formatDate+'&lat='+self.currentLocation.lat+'&lng='+self.currentLocation.lng+'&api_key=qf6mzc3fkprbntfd95db3hkk'
  $http.get(url)
   .success(function(data){
     self.rawData = data;
     var filteredData = [];
     var idCount = 1;
     //begin if statement
     for (var i = 0; i < self.rawData.length; i++) {
      var showtimes = self.rawData[i].showtimes;
      for (var j = 0; j < showtimes.length; j++) {

        //start getting showtimes
        var length = showtimes[j].dateTime.split('').length;
        var startTime = showtimes[j].dateTime.split('').slice(length-5, length).join('');
        ///filtering out all times that already happened
        ///////
        if(startTime > self.currentTime){
          self.startTime = startTime
        } else{
          break;
        }
        /////all times are pure until this point
        var movieTime = startTime[0]+startTime[1];
        var movieTime = parseInt(movieTime);
        if ( 11 < movieTime && movieTime < 13){
          //this parses any pm's into the proper format
          self.startTimeParsed = startTime+"pm";
        }
        else if(movieTime >= 13){
          var newHour = movieTime-12;
          var time = newHour +":"+startTime[3]+startTime[4];
          self.startTimeParsed = time+"pm";
        }else {
          self.startTimeParsed = startTime+"am"
        };
        //end getting showtimes
        ///getting the movies runtime
        if(self.rawData[i].runTime){
          self.runTime = self.rawData[i].runTime;
        } else {
          self.runTime = "pt--H--M"
        }

        var runHours = parseInt(self.runTime.slice(self.runTime.length-6, self.runTime.length-4));
        var runMinutes = parseInt(self.runTime.slice(self.runTime.length-3, self.runTime.length-1));
        self.runTime = runHours+":"+runMinutes
        self.runTimeMinutes = (parseInt(runHours*60)) + parseInt(runMinutes);
        ///end getting movies runtime

        //get time to start
        self.timeTo = function(){
          var hours = currHour + runHours;
          var minutes = runMinutes + currMin;
          var minutesTo = hours*60 + minutes;
          return minutesTo;
        }

        var item = {
          movieName: self.rawData[i].title,
          theatreId: showtimes[j].theatre.id,
          theatreName: showtimes[j].theatre.name,
          id: idCount,
          runTimeMinutes: self.runTimeMinutes,
          runTime: self.runTime,
          startTime: self.startTime,
          startTimeParsed: self.startTimeParsed,
          timeTo: self.timeTo(),
          ticketUrl: showtimes[j].ticketURI
        }
        ///if statement to see if runtime comes after current time
        filteredData.push(item);
      }
     }
     ///end if statement
     //the following sets the array to "sort by time" first
     filteredData.sort(function(a, b){
        if(a.startTime < b.startTime) return -1;
        if(a.startTime > b.startTime) return 1;
        return 0;
    })


     var filteredData = filteredData;
     //begin filtering based on user selection
     self.data = filteredData;
     ///////this is where it gets it's dat from!
    //
     return self.data
   })
  ///////end first if you've already been there
}else{
  var itemsArray = function(){
      navigator.geolocation.getCurrentPosition(function(data){
        console.log(data);
      //begin getting now's time
      var currentTime = new Date();
      var currMin = currentTime.getMinutes();
      if (currMin < 9) {
        currMin = "0"+currMin
      }
      var currHour = currentTime.getHours();
      self.currentTime = currHour+":"+currMin;
      ///end gettting current time

      window.Object.locationStuff = data;
      self.currentLocation = {lat: data.coords.latitude, lng: data.coords.longitude};
      var url = 'https://data.tmsapi.com/v1.1/movies/showings?radius=20&startDate='+formatDate+'&lat='+self.currentLocation.lat+'&lng='+self.currentLocation.lng+'&api_key=qf6mzc3fkprbntfd95db3hkk'
      $http.get(url)
       .success(function(data){
         console.log(data);
         self.rawData = data;
         var filteredData = [];
         var idCount = 1;
         //begin if statement
         for (var i = 0; i < self.rawData.length; i++) {
          var showtimes = self.rawData[i].showtimes;
          for (var j = 0; j < showtimes.length; j++) {
            //start getting showtimes
            var length = showtimes[j].dateTime.split('').length;
            var startTime = showtimes[j].dateTime.split('').slice(length-5, length).join('');

            ////begin calculating time minutes for comparisons
            ///begin calculating current time in minutes
            console.log(self.currentTime);
            if (self.currentTime.length == 4) {
              var currentTimeHours = parseInt(self.currentTime[0]*60);
              var currentTimeTenMins =parseInt(self.currentTime[2]*10);
              var mins = parseInt(self.currentTime[3]);
              self.currentMinutes = currentTimeHours + currentTimeTenMins + mins;
              console.log(self.currentMinutes);

            } else{
              var currentTenHours = parseInt(self.currentTime[0]*600);
              console.log(currentTenHours);
              var currentTimeHours = parseInt(self.currentTime[1]*60);
              console.log(currentTimeHours);
              var currentTimeTenMins =parseInt(self.currentTime[3]*10);
              console.log(currentTimeTenMins);
              var mins = parseInt(self.currentTime[4]);
              self.currentMinutes = currentTenHours + currentTimeHours + currentTimeTenMins + mins;
              console.log(self.currentMinutes);
            }
            ////begin calculating this showtimes' time in minutes
            var startTenHours = parseInt(startTime[0]*600)
            var startTimeHours = parseInt(startTime[1]*60);
            var startTimeTenMins =parseInt(startTime[3]*10);
            var startMins = parseInt(startTime[4]);
            self.startMinutes = startTenHours + startTimeHours + startTimeTenMins + startMins;
            console.log(self.startMinutes);
            ///filtering out all times that already happened
            ///////
            if(self.startMinutes > self.currentMinutes){
              self.startTime = startTime;
            } else{
              break;
            }
            /////all times are pure until this point
            var movieTime = startTime[0]+startTime[1];
            var movieTime = parseInt(movieTime);
            if ( 11 < movieTime && movieTime < 13){
              //this parses any pm's into the proper format
              self.startTimeParsed = startTime+"pm";
            }
            else if(movieTime >= 13){
              var newHour = movieTime-12;
              var time = newHour +":"+startTime[3]+startTime[4];
              self.startTimeParsed = time+"pm";
            }else {
              self.startTimeParsed = startTime+"am"
            };
            //end getting showtimes
            ///getting the movies runtime
            if(self.rawData[i].runTime){
              self.runTime = self.rawData[i].runTime;
            } else {
              self.runTime = "pt--H--M"
            }

            var runHours = parseInt(self.runTime.slice(self.runTime.length-6, self.runTime.length-4));
            var runMinutes = parseInt(self.runTime.slice(self.runTime.length-3, self.runTime.length-1));
            self.runTime = runHours+":"+runMinutes
            self.runTimeMinutes = (parseInt(runHours*60)) + parseInt(runMinutes);
            ///end getting movies runtime

            //get time to start
            self.timeTo = function(){
              var hours = currHour + runHours;
              var minutes = runMinutes + currMin;
              var minutesTo = hours*60 + minutes;
              return minutesTo;
            }

            var item = {
              movieName: self.rawData[i].title,
              theatreId: showtimes[j].theatre.id,
              theatreName: showtimes[j].theatre.name,
              id: idCount,
              runTimeMinutes: self.runTimeMinutes,
              runTime: self.runTime,
              startTime: self.startTime,
              startTimeParsed: self.startTimeParsed,
              timeTo: self.timeTo(),
              ticketUrl: showtimes[j].ticketURI,
              startMinutes: self.startMinutes
            }
            ///if statement to see if runtime comes after current time
            filteredData.push(item);
          }
         }
         ///end if statement
         //the following sets the array to "sort by time" first
         filteredData.sort(function(a, b){
            if(a.startTime < b.startTime) return -1;
            if(a.startTime > b.startTime) return 1;
            return 0;
        })


         var filteredData = filteredData;

         //begin filtering based on user selection
         self.data = filteredData;
         ///////this is where it gets it's dat from!
        //
         return self.data
       })
    })
  }
  self.ten = 600;
  self.eleven = 660;
  itemsArray();
}
//////////creatng custom filter


//end creating custom filter

self.greaterThan = function(property, val){
  return function(item){
    return item[prop] > val
  }
}



  var buttonCounter = true;

  //this is the function to open the secret button window when you click on an movie
  self.openButtons = function(movie){
    //jquery stuff
    if (buttonCounter) {
      $('#movBtn').on('click', function(){
        window.location.href = "/#/list/"+movie.movieName;
      })

      $("#dirBtn").on('click', function(){
        window.location.href = "/#/map/"+movie.theatreId;
      })

      $("#buyBtn").on('click', function(){
        window.location.href = movie.ticketUrl;
      })

      return buttonCounter;
    }

    else {
    }
  };

//   var buttonCounter = true;
//
// //this is the function to open the secret button window when you click on an movie
//   self.openButtons = function(movie){
//     //jquery stuff
//     if (buttonCounter) {
//       // $('#'+id).css('margin-bottom', 100+"px");
//       $('#'+movie.id).append('<div class="row"><div class="buttonContainer col-md-8 col-md-offset-2 col-xs-12 col-xs-offset-0" id=abc'+movie.id+'><button class="mapButton btn-default">Directions To</button><button class="detailsButton btn-default">Movie Details</button></div></div>')
//       //adding event listeners
//       $('#movBtn').on('click', function(){
//         window.location.href = "/#/list/"+movie.movieName;
//       })
//
//       $("#dirBtn").on('click', function(){
//         window.location.href = "/#/map/"+movie.theatreId;
//       })
//
//       //end event listeners
//       buttonCounter = !buttonCounter;
//       return buttonCounter;
//     }
//     else if(!buttonCounter) {
//       $('#abc'+id).remove();
//       $('#'+id).css('margin-bottom', 4+'px');
//       buttonCounter = !buttonCounter;
//       return buttonCounter;
//
//     } else {
//     }
//   }
  //end function for button window

  self.getMovie = function(){


    var key = "a9e6b3f7506ddf2d1499a135372be9f7";
    var url = "https://api.themoviedb.org/3/search/movie?query="+$routeParams.id+"&api_key="

    self.findItem = function(){
      // for (var i = 0; i < array.length; i++) {
      //   array[i]
      // }
    }

    //single movie detail http call to return additional movie details
    //find the proper item object with runtimes and stuff from our self.data object
    //end self.data object retrieval
    $http.get(url+key)
      .success(function(data){
      //begin passing my data to my angular frontend via self.'s
      self.posterLink = "https://image.tmdb.org/t/p/w500"+data.results[0].poster_path;
      self.movieDescription = data.results[0].overview;
      self.movieTitle = data.results[0].title;
    })
  }
}
