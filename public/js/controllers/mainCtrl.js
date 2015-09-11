angular.module('mainCtrl', [])
  .controller('mainController', mainController);


function mainController($http, $location){
  var self = this;

  if (map.style.height == 0) {
    function setMap(){
    $('#map').css("height", 100+"%");
    }
    setMap();
  }
}
