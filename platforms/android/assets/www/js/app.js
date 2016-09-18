// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'gps'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

/**
  Método encargado de establecer los estdos de la aplicación, 
  incluyendo los controladores y las vistas para cada uno
  */
.config(function($stateProvider, $urlRouterProvider) {

 $stateProvider

  // Determina que el menu se va a ver de forma permanente
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  .state('tab.lps', {
    url: '/lps',
    views: {
      'tab-lps': {
        controller: 'LpsCtrl',
        templateUrl: 'templates/lps.html'
      }
    }
  })

  .state('tab.walkHistory', {
      url: '/walkHistory',
      views: {
        'tab-walkHistory': {
          controller: 'WalkHistoryCtrl',
          templateUrl: 'templates/tab-walk-history.html'
        }
      }
    })

  // Vista por defecto
  $urlRouterProvider.otherwise('/tab/walkHistory');

});
