var gps = angular.module('gps', ['ionic', 'ngCordova']);

//Método encargado de retornar la posición actual del dispositivo
gps.factory('GeoService', function($ionicPlatform, $cordovaGeolocation) {

  var positionOptions = {timeout: 3000, enableHighAccuracy: true};
  var watchOption = { 
    timeout : 60*60*1000,
    maxAge: 0,
    enableHighAccuracy: true
  };

  return {
    getPosition: function() {
      return $ionicPlatform.ready()
        .then(function() {
          return $cordovaGeolocation.getCurrentPosition(positionOptions);
        })
    },
    getWatch: function(){
    	return $ionicPlatform.ready()
        .then(function() {
          return $cordovaGeolocation.watchPosition(watchOption);
        })
    },
    getClear: function(idWatch){
      return $ionicPlatform.ready()
        .then(function() {
          $cordovaGeolocation.clearWatch(idWatch);
        })
    }

  };

});
