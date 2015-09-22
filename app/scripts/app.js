'use strict';

angular
  .module('yourApp', [
    'ngResource',
    'ui.router',
    'LoopBack',
    'ls.LiveSet',
    'ls.ChangeStream'
  ])
  .config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

      //delete $httpProvider.defaults.headers.common[ 'X-Requested-With' ];
      $urlRouterProvider.otherwise('/');
      $stateProvider
        .state('index', {
          url: '/',
          templateUrl: 'views/main.html',
          controller: 'MainCtrl'
        });

    }
  ]);
