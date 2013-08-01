
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
    var str = place.website ? "<a target='_blank' href='"+place.website+"'>"+place.name+"</a>" : place.name;
    $$("nearby").append("<li>"+str+"</li>");

    sortNearby();
}

function sortNearby() {
    var items = $$("nearby li").get();
    items.sort(function(a,b){
        var keyA = $(a).text();
        var keyB = $(b).text();

        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
    });
    var ul = $$("nearby");
    $.each(items, function(i, li){
        ul.append(li);
    });
}

//put a marker on the map for a place
function drawMarker(place) {
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(place.lat, place.lng),
        map: map,
        title: place.name
    });
    markers[place.name] = marker;
}

function drawDetailedPlaceInfo(place) {
    if(placeIsInvalid(place)) return;
    drawMarker(place);
    showInformationFor(place);
}

function getDataFor(place) {

    if(Data.hasVar("company_"+place.name)) {
        drawDetailedPlaceInfo(Data.getVar("company_"+place.name));
        return;
    }

    var intId = setInterval(function() {
        try {
            changeStatus("Processing...");
            service.getDetails(place, getMorePlaceDetails);
            clearInterval(intId);
            changeStatus("OK");
        } catch(e) {
            console.info("Could not get detailed information about "+place.name+"; retrying in 3...");
        }
    }, 3000);

}

function placeIsInvalid(container) {
    return !container.website && !container.phone_number;
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
    container.lat = detailedPlace.geometry.location.lat();
    container.lng = detailedPlace.geometry.location.lng();

    drawDetailedPlaceInfo(container);

    if(placeIsInvalid(container)) {
        clearMarker(container.name);
        return;
    }

    Data.setVar("company_"+container.name, container);

    $.ajax({
        url: "ajax.php", 
        dataType: "json",
        type: "POST",
        data: {
            //action: "add",
            data: JSON.stringify(container)
        }
    });
};