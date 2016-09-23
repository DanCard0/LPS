angular.module('starter.controllers', ['ionic', 'ngCordova'])

.controller('LpsCtrl', function($scope, GeoService, $cordovaGeolocation) {

  var lat;
  var long;
  var captura_actual = null;
  var htmlInfo = document.getElementById('info_captura');
  var id_captura = 0; // Llave o nombre con el cual se va a almacenar la captura actual
  var capturas = [];

  $( document ).ready(function() {
    $( "#iniciar" ).on( "click", function() {
      // =====================================================================================
      function listHandler(a){
        console.log(JSON.stringify(a));
        var networkCounter = 0;

        for (var i = 0; i < a.length; i++) {
          if (a[i].SSID.indexOf("ProTif") !== -1) {
            networkCounter++;
            $("#info_captura").append('<strong>Red:</strong> '+a[i].SSID+
                                      ' <strong>Potencia (dBm):</strong> '+a[i].level+'<br><br>');
            //window.localStorage.setItem(id_captura, JSON.stringify(results));
          }
        }

        if (networkCounter < 4 && networkCounter != 0) {
          $("#info_captura").append('<strong><font color="red">Estaciones fijas incompletas. Intente de nuevo</font></strong><br><br>');
          networkCounter = 0;
        } else if (networkCounter == 0) {
          $("#info_captura").append('<strong><font color="red">No se ha podido localizar ninguna de las estaciones fijas. Intente de nuevo</font></strong><br><br>');
          networkCounter = 0;
        }
        else {
          networkCounter = 0;
        }
      };
      
      function fail(e) {
        alert('Fallo en la captura del punto')
        console.log(JSON.stringify(e));
      };

      WifiWizard.getScanResults(listHandler, fail);

      // =====================================================================================

      GeoService.getPosition()
        .then(function(position) {
          alert($scope.coords.latitude);
          $("#info_captura").append('<strong>Latitud:</strong> '+$scope.coords.latitude+
                                    ' <strong>Longitud:</strong> '+$scope.coords.longitude);
          
          $scope.coords = position.coords;
          $scope.map = showMap(position.coords, 'captureMap');
          $scope.map = setMarker($scope.map, $scope.coords.latitude, $scope.coords.longitude, "Localización" , true);

        }, function(err) {
          console.log('getCurrentPosition error: ' + angular.toJson(err));
        });
     });
  });
  
  // Funcionalidad botón Iniciar Captura
  $scope.start = start;
  function start(){
    htmlInfo.innerHTML = "Punto capturado";

    GeoService.getPosition()
      .then(function(position) {
        
        $scope.coords = position.coords;
        $scope.map = showMap(position.coords, 'walkMap');
        //$scope.map = setMarker($scope.map, $scope.coords.latitude, $scope.coords.longitude, "Mi localización" , false);

      }, function(err) {
        console.log('getCurrentPosition error: ' + angular.toJson(err));
      });

    captura_actual = GeoService.getWatch()
      .then(
        null,
        function(err) {
          alert("Hubo un error en la captura de la posición: "+err);
        },
        function(position) {
          capturas.push(position);

          lat  = position.coords.latitude
          long = position.coords.longitude
          //$scope.map = showMap(position.coords, 'walkMap');
          $scope.map = setMarker($scope.map, lat, long, "Mi localización", true);

          // Id de la captura actual ingresado por el cliente
          id_captura = $("#track_id").val();  
          $("#track_id").hide();
        }
      );
  }

  // Limpiar almacenamiento local
  $scope.clearStorage = clearStorage;
  function clearStorage(){
    
    htmlInfo.innerHTML = "Datos borrados";
    window.localStorage.clear();
  }

  // Insertar datos dummy
  $scope.dummyStorage = dummyStorage;
  function dummyStorage(){
    
    window.localStorage.setItem('PruebaDummy',
      '[{"timestamp":1335700802000, "coords":{"heading":null,"altitude":null,"longitude":170.33488333333335,"accuracy":0,"latitude":-45.87475166666666,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700803000,"coords":{"heading":null,"altitude":null,"longitude":170.33481666666665,"accuracy":0,"latitude":-45.87465,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700804000,"coords":{"heading":null,"altitude":null,"longitude":170.33426999999998,"accuracy":0,"latitude":-45.873708333333326,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700805000,"coords":{"heading":null,"altitude":null,"longitude":170.33318333333335,"accuracy":0,"latitude":-45.87178333333333,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700806000,"coords":{"heading":null,"altitude":null,"longitude":170.33416166666666,"accuracy":0,"latitude":-45.871478333333336,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700807000,"coords":{"heading":null,"altitude":null,"longitude":170.33526833333332,"accuracy":0,"latitude":-45.873394999999995,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700808000,"coords":{"heading":null,"altitude":null,"longitude":170.33427333333336,"accuracy":0,"latitude":-45.873711666666665,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700809000,"coords":{"heading":null,"altitude":null,"longitude":170.33488333333335,"accuracy":0,"latitude":-45.87475166666666,"speed":null,"altitudeAccuracy":null}}]');
  }

})

//==============================================================================================
//==============================================================================================
.controller('WalkHistoryCtrl', function($scope, GeoService) {

  var htmlInfo = document.getElementById('info_captura');

  // Funcionalidad botón Mostrar ruta 
  $("#mostrarMapa").on("click", function(){

    // PRINT MAP ============================================================================================

    GeoService.getPosition()
      .then(function(position) {
        
        $scope.coords = position.coords;
        $scope.map = showMap(position.coords, 'detectionMap');
        $scope.map = setMarker($scope.map, $scope.coords.latitude, $scope.coords.longitude, "Localización" , true);

      }, function(err) {
        console.log('getCurrentPosition error: ' + angular.toJson(err));
      });
  });   
})