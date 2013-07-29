
var map;
var service;

var lastCenter;

var markers = {};

//get all businesses nearby to a position
function getBusinessesForPosition(position) {
    $$("lat a").text(parseFloat(position.lat()).toFixed(7));
    $$("lon a").text(parseFloat(position.lng()).toFixed(7));

    var request = {
        location: new google.maps.LatLng(position.lat(), position.lng()),
        radius: '500'
    };
    
    service.nearbySearch(request, handleFoundPlaces);
}

//draw the place we found and put it in the nearby list
function handleFoundPlaces(results, status) {

    if (status == google.maps.places.PlacesServiceStatus.OK) {

        if(results.length > 0) {
            clearMarkers();
            $$("nearby").empty();
        }

        for (var i = 0; i < results.length; i++) {
            var place = results[i];
            getDataFor(place);
        }
    }
}

//clear all markers from the map
function clearMarkers() {
    for (prop in markers) { 
        if (markers.hasOwnProperty(prop)) {
            markers[prop].setMap(null);
        }
    }
    markers = {};
}

function clearMarker(name) {
    if(markers.hasOwnProperty(name))
        markers[name].setMap(null);
}

//change status text 
function changeStatus(str) {
    $$("status a").text(str);
}

//put a name to the place
function showInformationFor(place) {
    $$("nearby").append("<li>"+place.name+"</li>");
}

//put a marker on the map for a place
function drawMarker(place) {
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng()),
        map: map,
        title: place.name
    });
    markers[place.name] = marker;
}

function getDataFor(place) {

    showInformationFor(place);
    drawMarker(place);

    if(Data.hasVar("company_"+place.name)) return;

    var intId = setInterval(function() {
        try {
            service.getDetails(place, getMorePlaceDetails);
            clearInterval(intId);
        } catch(e) {
            console.info("Could not get detailed information about "+place.name+"; retrying in 3...");
        }
    }, 3000);

}

var getMorePlaceDetails = function(detailedPlace, status) {
    if (status !== google.maps.places.PlacesServiceStatus.OK) throw new Error("Couldn't get anything from google: "+status);

    var container = new CompanyData();
    container.address = detailedPlace.formatted_address;
    container.phone_number = detailedPlace.formatted_phone_number;
    container.intl_phone_number = detailedPlace.international_phone_number;
    container.name = detailedPlace.name;
    container.rating = detailedPlace.rating;
    container.types = detailedPlace.types;
    container.website = detailedPlace.website;

    if(!container.website && !container.phone_number) {
        clearMarker(container.name);
        return;
    }

    Data.setVar("company_"+container.name, container);

    $.ajax({
        url: "ajax.php", 
        dataType: "json",
        type: "POST",
        data: {
            action: "add",
            data: JSON.stringify(container)
        }
    });
};