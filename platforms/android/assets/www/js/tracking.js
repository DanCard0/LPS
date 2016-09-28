var directionsDisplay;
var directionsService ;
var map;

function initialize() {
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();

    var mapOptions = {
        zoom: 7,
        center: new google.maps.LatLng(41.850033, -87.6500523)
    };

    map = new google.maps.Map(document.getElementById('map-canvas'),
       mapOptions);
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('directions-panel'));

    var control = document.getElementById('control');
    control.style.display = 'block';
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);
}


var arrayOfTrackingPoints = [];

function calcRoute() {
    var start = document.getElementById('start').value;
    var end = document.getElementById('end').value;
    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            for (var i = 0; i < response.routes[0].overview_path.length; ++i) {
                /*  marker = new google.maps.Marker({
                      map: map,
                      position: new google.maps.LatLng
                      (response.routes[0].overview_path[i].lat(), 
                      response.routes[0].overview_path[i].lng()),
                      animation: google.maps.Animation.BOUNCE
                  });*/
                arrayOfTrackingPoints.push(new google.maps.LatLng
                    (response.routes[0].overview_path[i].lat(), 
                    response.routes[0].overview_path[i].lng()));
            }
        }
    });
    //showTracking();
}

        
var markerArray = [];
var infowindow = new google.maps.InfoWindow();

function showTracking() {

    var marker = new google.maps.Marker({
        map: map,
        position: arrayOfTrackingPoints[0]

    });

    var c = 0;
    
    var interval = self.setInterval(function () {

        marker.setPosition((arrayOfTrackingPoints[c]));
        c++;
      //  markerArray.push(marker);
       infowindow.setContent('The marker number is : ' + c);
     infowindow.open(map, marker);
        if (c > arrayOfTrackingPoints.length) clearInterval(interval);
    }, 5000);


            ////window.setInterval(clearOverlays, 9500);
            //var counterForClearing = 0;
            //var clearMarkersInterval = self.setInterval(function () {
            //    for (var j = 0; j < markerArray.length; ++j) {
            //        markerArray[j].setMap(null);
            //    }
            //    counterForClearing++;
            //    if (counterForClearing > markerArray.length) clearInterval(clearMarkersInterval);
            //}, 9500);

}