angular.module('listCtrl', [])
  .controller('listController', listController);

function listController($http){
  var self = this;

  $http.get('http://data.tmsapi.com/v1.1/movies/showings?startDate=2015-09-09&zip=90036&api_key=qf6mzc3fkprbntfd95db3hkk')
   .success(function(data){
     console.log('begin');
     console.log(data);
     console.log('end');
     self.data = data;
   })

  var buttonCounter = true;

  self.openButtons = function(id){
    console.log(id);

    $('#'+id).append('<div class="buttonContainer '+id+'"><ul class="buttons"><button ng-click="map('+id+')">get directions</button><button ng-click="movieDetails('+id+')">see movie details</button></div></div>');

    $('.buttons')

    if (buttonCounter) {
      // $('#'+id).css('margin-bottom', 100+"px");
      console.log('lowering button container');
      buttonCounter = !buttonCounter;
      return buttonCounter;
    }
    else if(!buttonCounter) {
      $('.'+id).remove();
      console.log('raising button container');
      $('#'+id).css('margin-bottom', 4+'px');
      buttonCounter = !buttonCounter;
      return buttonCounter;

    } else {
      console.log('something weird happened');
    }
  }

  self.map = function(id){
    console.log('testing event');
    console.log(id);
    var url = 'http://data.tmsapi.com/v1.1/theatres/'+id+'?api_key=qf6mzc3fkprbntfd95db3hkk'
    $http.get(url)
      .success(function(data){
        console.log(data.location.geoCode);
      })
    // window.location.href = "/#/map/"+id;
  }

  self.movieDetails = function(){
    console.log('movie details');
  }
}
