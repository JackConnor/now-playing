angular.module('mainCtrl', [])
  .controller('mainController', mainController);


function mainController($http){
  var self = this;
  if (map.style.height == 0) {
    function setMap(){
    $('#map').css("height", 100+"%");
    }
    setMap();
  }
///begin long asssssss data call, we use this in the rest of the app

}
