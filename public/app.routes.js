angular.module('app.routes',['ngRoute'])

  .config(appRoutes);

appRoutes.$inject = ['$routeProvider'];
function appRoutes($routeProvider){
  $routeProvider
    .when('/', {
      templateUrl: "templates/_home.html"
    })

    .when('/map', {
      templateUrl: 'templates/_map.html'
    })
    // .when('/brady/:id', {
    //   templateUrl: 'templates/_profile.html'
    //   ,controller: 'bradyController'
    //   ,controllerAs: 'bradyCtrl'
    // })
    // .when('/new', {
    //   templateUrl: 'templates/_new.html'
    //   ,controller: 'bradyController'
    //   ,controllerAs: 'bradyCtrl'
    // })
    .otherwise('/');
}
