
//start the map
function initialize() {

    var mapOptions = {
        zoom: 6,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    service = new google.maps.places.PlacesService(map);

    checkGeolocation();

    initMapListeners();
}

//check for geolocation for the client, and handle if they accept/deny or just don't have it
function checkGeolocation() {

    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            var infowindow = new google.maps.InfoWindow({
                map: map,
                position: pos,
                content: 'Location found using HTML5.'
            });

            var marker = new google.maps.Marker({
                position: pos,
                map: map,
                title: 'My Location'
            });

            map.setCenter(pos);
            map.setZoom(13);

        }, function() {
            handleNoGeolocation(true);
        });
    } else {
        handleNoGeolocation(false);
    }
}

//all map listeners are initialized here
function initMapListeners() {
    google.maps.event.addListener(map, 'center_changed', function() {

        lastCenter = map.getCenter();
        changeStatus("Updating...");

        //this prevents the code from executing every update, and rather, it only executes if the map sits still for 3 seconds
        setTimeout(function() {
            if(lastCenter == map.getCenter()) {
                getBusinessesForPosition(lastCenter);
                changeStatus("OK");
            }
        }, 3000);
    });
}

//in case the client denies geolocation or there is none available
function handleNoGeolocation(errorFlag) {
    if (errorFlag) {
        var content = 'Error: The Geolocation service failed.';
    } else {
        var content = 'Error: Your browser doesn\'t support geolocation.';
    }

    var options = {
        map: map,
        position: new google.maps.LatLng(40, -90),
        content: content
    };

    var infowindow = new google.maps.InfoWindow(options);
    map.setCenter(options.position);
}

google.maps.event.addDomListener(window, 'load', initialize);