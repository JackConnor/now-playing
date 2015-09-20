angular.module('app.routes',['ngRoute'])

  .config(appRoutes);

appRoutes.$inject = ['$routeProvider'];
function appRoutes($routeProvider){
  $routeProvider
    .when('/', {
      templateUrl: "templates/_home.html",
    })

    .when('/list', {
      templateUrl: 'templates/_list.html',
      controller: 'listController',
      controllerAs: 'list'
    })

    .when('/list/:id', {
      templateUrl: 'templates/_details.html',
      controller: 'listController',
      controllerAs: 'list'
    })

    .when('/map', {
      templateUrl: 'templates/_map.html',
      controller: 'mapController',
      controllerAs: 'map'
    })

    .when('/map/:id', {
      templateUrl: 'templates/_map.html',
      controller: 'mapController',
      controllerAs: 'map'
    })

    .when('/showtimes/:id', {
      templateUrl: 'templates/_showtimes.html',
      controller: 'listController',
      controllerAs: 'list'
    })

    .otherwise('/');
}
