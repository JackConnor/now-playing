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
}
