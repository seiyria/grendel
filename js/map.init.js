
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

    $("#nearby-container").niceScroll();

    $.pnotify({
        history: false,
        text: "To get started, just scroll around the map! When you think you've got enough data to look at, head over to the <a href='clients.php'>businesses page</a> and check out the analytics!",
        title: "Intro"
    });
}

//check for geolocation for the client, and handle if they accept/deny or just don't have it
function checkGeolocation() {

    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

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
        var thisPosition = lastCenter;
        changeStatus("Updating...");

        //this prevents the code from executing every update, and rather, it only executes if the map sits still for 3 seconds
        setTimeout(function() {
            if(lastCenter == thisPosition) {
                changeStatus("Processing...");
                getBusinessesForPosition(lastCenter);
                changeStatus("OK");
            }
        }, 1000);
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