var map;

/**
 Función encargada de cargar el mapa de GoogleMaps
  - @param divMap: id del elemento html donde se va a ubicar el mapa
  - @param coords: objeto que posee las coordenadas (longitud y latitud)
*/
function showMap(coords, divMap) {
  var mapOptions = {
    center: { lat: coords.latitude, lng: coords.longitude},
    zoom: 16
  };
  var map = new google.maps.Map(document.getElementById(divMap), mapOptions);

  return map;
}

//Función encargada de realizar un marcador
function setMarker(map, lat, lng, name, step){


  if (!infowindow) {
    infowindow = new google.maps.InfoWindow();
  }

  infowindow.setContent(name);

  marker = new google.maps.Marker({
    position:  {lat: lat, lng: lng},
    map: map,
    title: name        
  });

  if(step){
    marker.setIcon('img/step.png')
  }

  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });

  return map; 
}

//Función encargada de realizar varios marcadores.
function setMarkers(map, locations){

  for (var i = 0; i < locations.length; i++){
    
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(locations[i].latitude, locations[i].longitude),
      map: map,
      map: map,
      icon:'img/blue-dot.png',
      title: locations[i].name
    });

    (function(i, marker) {
      google.maps.event.addListener(marker,'click',function() {
        
        if (!infowindow) {
          infowindow = new google.maps.InfoWindow();
        }
        
        infowindow.setContent(locations[i].name);
        infowindow.open(map, marker);

      });
    })(i, marker);
  }
  
  return map;
}

/**
 Función encargada de definir las variables para trazar la ruta entre dos puntos  
  - @param divMode: id del elemento html donde se selecciona el modo transporte
  - @param mapa: mapa donde se desea poner la ruta
*/
function routeTwoPoints(selectMode, map, pointA, pointB, opc){

  var directionsDisplay = new google.maps.DirectionsRenderer;
  var directionsService = new google.maps.DirectionsService;

  directionsDisplay.setMap(map);

  calculateRoute(map, selectMode, directionsService, directionsDisplay, pointA, pointB, opc);
  
  document.getElementById(selectMode).addEventListener('change', function() {
    calculateRoute(map, selectMode, directionsService, directionsDisplay, pointA, pointB, opc);
  });
}

var arrayOfTrackingPoints = [];

//Función encargada de dibujar la ruta entre dos puntos
function calculateRoute(map, selectMode, directionsService, directionsDisplay, pointA, pointB, opc) {
  //console.dir(selectMode);
  var selectedMode = document.getElementById(selectMode).value;

  directionsService.route({    
    destination:{lat: pointB.latitude, lng: pointB.longitude},
    origin: {lat: pointA.latitude, lng: pointA.longitude},      
    //travelMode: google.maps.TravelMode.DRIVING
    travelMode: google.maps.TravelMode[selectedMode]

  }, function(trace, status) { 

    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(trace);

      if(opc){
        for (var i = 0; i < trace.routes[0].overview_path.length; ++i) {
        
        marker = new google.maps.Marker({
          map: map,
          position: new google.maps.LatLng(trace.routes[0].overview_path[i].lat(), trace.routes[0].overview_path[i].lng()),
          icon:'img/step.png',
          animation: google.maps.Animation.BOUNCE
        });
          arrayOfTrackingPoints.push(new google.maps.LatLng(trace.routes[0].overview_path[i].lat(), trace.routes[0].overview_path[i].lng()));
        }
      }     
      
    } else {
      window.alert('No se puede trazar la ruta.');
    }
  });
}