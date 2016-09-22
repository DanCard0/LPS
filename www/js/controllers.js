angular.module('starter.controllers', ['ionic', 'ngCordova'])

.controller('LocationCtrl', function($scope, GeoService, Ceas) {

  GeoService.getPosition()
    .then(function(position) {
      
      $scope.coords = position.coords;
      $scope.map = showMap(position.coords, 'map');      
      
      $scope.map = setMarker($scope.map, $scope.coords.latitude, $scope.coords.longitude, "Mi localización" , false);

      $scope.ceas = Ceas.all();
      $scope.map = setMarkers($scope.map, $scope.ceas);

    }, function(err) {
      console.log('getCurrentPosition error: ' + angular.toJson(err));
    });  
})

.controller('LpsCtrl', function($scope, GeoService, $cordovaGeolocation) {

  var lat;
  var long;
  var captura_actual = null;
  var htmlInfo = document.getElementById('info_captura');
  var id_captura = 'Ruta de prueba'; // Llave o nombre con el cual se va a almacenar la ruta actual
  var capturas = [];

  $( document ).ready(function() {
    $( "#iniciar" ).on( "click", function() {
        function success(results) {
          console.log(JSON.stringify(results));
        };
        
        function err(e) {
          console.log(JSON.stringify(e));
        };

        WifiInfo.getWifiInfo(success,err);
    });
  });
  
  // Funcionalidad botón Iniciar Captura
  $scope.start = start;
  function start(){
    htmlInfo.innerHTML = "Punto capturado";

    /*GeoService.getPosition()
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
      );*/
  }

  // Funcionalidad botón Detener Captura
  $scope.stop = stop;
  function stop(){

    $cordovaGeolocation.clearWatch(captura_actual);

    GeoService.getClear(captura_actual)
      .then(function(result) {
          captura_actual = null;
          htmlInfo.innerHTML = "Captura detenida";
          
          // Soluciona el problema de la cnversión Object -> JSON por medio de
          // stringify que retorna un JSON vacío
          function cloneAsObject(obj) {
            if (obj === null || !(obj instanceof Object)) {
              return obj;
            }
            var temp = (obj instanceof Array) ? [] : {};
            // ReSharper disable once MissingHasOwnPropertyInForeach
            for (var key in obj) {
              temp[key] = cloneAsObject(obj[key]);
            }
            return temp;
          }
        
          // Guarda el recorrido capturado
          window.localStorage.setItem(id_captura, JSON.stringify(cloneAsObject(capturas)));

          // Tiempo de retardo antes de vaciar las variables que almacenan el ultimo
          // registro capturado 
          var delay=1000;

          // Función de retardo, la cual permite que se almacenen los ultimos datos
          // capturados antes de ser vaciadas las variables watch_id y tracking_data
          setTimeout(function() {
            // Reset watch_id and tracking_data 
            var id_captura = null;
            var capturas = null;
          }, delay);

        }, function (error) {
          alert("Error deteniendo captura "+error);
      });
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


.controller('WalkHistoryCtrl', function($scope, GeoService) {

  var htmlInfo = document.getElementById('info_captura');

  // Cuenta el número de rutas guardadas y las muestra al cliente
  var num_rutas_guardadas = window.localStorage.length;

  // Empty the list of recorded tracks
  $("#history_tracklist").empty();

  // Iterate over all of the recorded tracks, populating the list
  for(i=0; i<num_rutas_guardadas; i++){
    
    $("#history_tracklist").append("<li><a class='action' data-key='"+window.localStorage.key(i)+"'>" + window.localStorage.key(i) + "</a></li>");
  }
  // Tell jQueryMobile to refresh the list
  //$("#history_tracklist").listview('refresh');


  // Funcionalidad botón Mostrar ruta 
  $(".action").on("click", function(){ 
     
    // Almacena el Id de la ruta clickeada
    var key = $(this).data("key");
    $("#info_captura").html("Ruta seleccionada: <strong>"+key+"</strong>");

    // Recuperamos los datos de la ruta seleccionada
    var data = window.localStorage.getItem(key);

    // Retorna el formato de los datos a tipo JS Object
    data = JSON.parse(data);

    // Calcula la distancia entre dos puntos del mapa
    function gps_distance(lat1, lon1, lat2, lon2){
      // http://www.movable-type.co.uk/scripts/latlong.html
      var R = 6371; // km
      var dLat = (lat2-lat1) * (Math.PI / 180);
      var dLon = (lon2-lon1) * (Math.PI / 180);
      var lat1 = lat1 * (Math.PI / 180);
      var lat2 = lat2 * (Math.PI / 180);
   
      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = R * c;
      
      return d;
    }

    // Calculate the total distance travelled
    total_km = 0;

    // Listas que almacenarán los valores de las distancias recorridas en cada tramo
    // y sus respectivos tiempos
    var distances_list = [];
    var times_in_seconds_list = [];
    var times_in_minutes_list = [];

    console.log(data.length);
    for(i = 0; i < data.length; i++){

      if(i == (data.length - 1)){
        break;
      }

      // Almacenamos las distancias recorridas en cada uno de los tramos
      distances_list.push((gps_distance(data[i].coords.latitude, data[i].coords.longitude, data[i+1].coords.latitude, data[i+1].coords.longitude)));

      stretch_start_time = new Date(data[i].timestamp).getTime();
      stretch_end_time = new Date(data[i+1].timestamp).getTime();
      stretch_time = stretch_end_time - stretch_start_time;
      stretch_time_seconds = stretch_time / 1000;
      stretch_time_minutes = Math.floor(stretch_time_seconds / 1000);
      stretch_time_seconds_final = stretch_time_seconds - (stretch_time_minutes * 60);
      times_in_seconds_list.push(stretch_time_seconds);
      times_in_minutes_list.push(stretch_time_minutes);

      total_km += gps_distance(data[i].coords.latitude, data[i].coords.longitude, data[i+1].coords.latitude, data[i+1].coords.longitude);
    }

    total_km_rounded = total_km.toFixed(2);


    for (var i = 0; i < distances_list.length; i++) {
      //var distanciaEnMetros = distances_list[i] / 1000;
      //console.log("Tramo No. "+i+" Velocidad: "+calcularVeloc(distanciaEnMetros, times_in_minutes_list[i])); //Arroja metros/minutos
      //console.log(stretch_start_time+" "+stretch_end_time);
    }    

    function calcularVeloc(distanciaMetros, tiempoMinutos){
      var velocMetrosMinutos = distanciaMetros/tiempoMinutos;
      var velocKmMinutos = velocMetrosMinutos/1000;
      var velocKmHora = velocKmMinutos/60;
      return velocKmHora;
    }


    /*for (var i = 0; i < data.length; i++) {
      var t_inicial = new Date(data[i].timestamp).getTime();
      var t_final = new Date(data[data.length-1].timestamp).getTime();

      calcularVelTramo(i, t_inicial, t_final);
    }*/




    /* algoritmo original Calculo del tiempo y distancia recorrida 
    // Calculate the total time taken for the track
    start_time = new Date(data[0].timestamp).getTime();
    end_time = new Date(data[data.length-1].timestamp).getTime();
     
    total_time_ms = end_time - start_time;
    total_time_s = total_time_ms / 1000;
     
    final_time_m = Math.floor(total_time_s / 1000);
    final_time_s = total_time_s - (final_time_m * 60);
     
    // Display total distance and time
    $("#calculos_ruta").html('Travelled <strong>' + total_km_rounded 
                        + '</strong> km in <strong>' + final_time_m 
                        + 'm</strong> and <strong>' + final_time_s 
                        + 's</strong>');*/





    // Calculate the total time taken for the track
    start_time = new Date(data[0].timestamp).getTime();
    end_time = new Date(data[data.length-1].timestamp).getTime();
     
    total_time_ms = end_time - start_time;
    total_time_s = (total_time_ms / 1000);
     
    total_time_m = total_time_s / 60;
    //final_time_s = total_time_s - (total_time_m * 60);
     
    // Display total distance and time
    $("#calculos_ruta").html('Recorrido <strong>' + total_km_rounded +
                ' km</strong> en <strong>' + total_time_m.toFixed(2) +
                ' minutos</strong> y <strong>' + total_time_s.toFixed(2) + 
                ' segundos</strong> Con una velocidad media de <strong>' + (total_km/(total_time_m/60)).toFixed(2) +
                ' km/h</strong>');


    // PRINT MAP ============================================================================================

    GeoService.getPosition()
      .then(function(position) {
        
        $scope.map = showMap(data[0].coords, 'walkMap');
        for(i=0; i<data.length; i++){
          $scope.map = setMarker($scope.map, data[i].coords.latitude, data[i].coords.longitude, "Mi localización" , true);
        }

      }, function(err) {
        console.log('getCurrentPosition error: ' + angular.toJson(err));
      });
  });   
})