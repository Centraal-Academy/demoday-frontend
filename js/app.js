(function (mapId) {
    'use strict'
    
    function initMap(mapId) {
        var styledMapType = [
            {elementType: 'geometry', stylers: [{color: '#ebe3cd'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#523735'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#f5f1e6'}]},
            {
            featureType: 'administrative',
            elementType: 'geometry.stroke',
            stylers: [{color: '#c9b2a6'}]
            },
            {
            featureType: 'administrative.land_parcel',
            elementType: 'geometry.stroke',
            stylers: [{color: '#dcd2be'}]
            },
            {
            featureType: 'administrative.land_parcel',
            elementType: 'labels.text.fill',
            stylers: [{color: '#ae9e90'}]
            },
            {
            featureType: 'landscape.natural',
            elementType: 'geometry',
            stylers: [{color: '#dfd2ae'}]
            },
            {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [{color: '#dfd2ae'}]
            },
            {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{color: '#93817c'}]
            },
            {
            featureType: 'poi.park',
            elementType: 'geometry.fill',
            stylers: [{color: '#a5b076'}]
            },
            {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{color: '#447530'}]
            },
            {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{color: '#f5f1e6'}]
            },
            {
            featureType: 'road.arterial',
            elementType: 'geometry',
            stylers: [{color: '#fdfcf8'}]
            },
            {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{color: '#f8c967'}]
            },
            {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{color: '#e9bc62'}]
            },
            {
            featureType: 'road.highway.controlled_access',
            elementType: 'geometry',
            stylers: [{color: '#e98d58'}]
            },
            {
            featureType: 'road.highway.controlled_access',
            elementType: 'geometry.stroke',
            stylers: [{color: '#db8555'}]
            },
            {
            featureType: 'road.local',
            elementType: 'labels.text.fill',
            stylers: [{color: '#806b63'}]
            },
            {
            featureType: 'transit.line',
            elementType: 'geometry',
            stylers: [{color: '#dfd2ae'}]
            },
            {
            featureType: 'transit.line',
            elementType: 'labels.text.fill',
            stylers: [{color: '#8f7d77'}]
            },
            {
            featureType: 'transit.line',
            elementType: 'labels.text.stroke',
            stylers: [{color: '#ebe3cd'}]
            },
            {
            featureType: 'transit.station',
            elementType: 'geometry',
            stylers: [{color: '#dfd2ae'}]
            },
            {
            featureType: 'water',
            elementType: 'geometry.fill',
            stylers: [{color: '#b9d3c2'}]
            },
            {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{color: '#92998d'}]
            }
        ];
        var map = new google.maps.Map(document.getElementById(mapId), {
            center: {lat: 20.674996, lng:  -103.392756 },
            zoom: 13,
            styles: styledMapType,
            disableDefaultUI: true
        });
        return map;
    }

    function init(mapId) {
        var map = initMap(mapId);

        var inputOrigen = document.getElementById('origen');
        var inputDestino = document.getElementById('destino');

        var autoCompleteOrigen = new google.maps.places.Autocomplete(inputOrigen);
        var autoCompleteDestino = new google.maps.places.Autocomplete(inputDestino);

        var contextMap = {
            map : map,
            markers : {},
            positions : {},
            directions : {
            service : new google.maps.DirectionsService(),
            display : new google.maps.DirectionsRenderer({ map : map, markerOptions : { visible : false } })
            }
        };

        var listenerAutoCompleteOrigen = listenerAutoComplete.bind(null, contextMap, autoCompleteOrigen, 'origen');
 
        autoCompleteOrigen.addListener('place_changed', listenerAutoCompleteOrigen);

        var listenerAutoCompleteDestino = listenerAutoComplete.bind(null, contextMap, autoCompleteDestino, 'destino');
 
        autoCompleteDestino.addListener('place_changed', listenerAutoCompleteDestino); 
    }

    function displayMaker(contextMap, markerName, location) {
        var markers = contextMap.markers;
        var map = contextMap.map;

        if (!markers[markerName]){
            markers[markerName] = new google.maps.Marker({
                position : location,
                map : map,
                title : markerName
            });
        } else {
            markers[markerName].setPosition(location);
        }
        
        if (!(markers.origen && markers.destino)){
            map.setCenter(location);
        }
    }

    function displayRoute(contextMap, travelMode) {
        var positions = contextMap.positions;
        var directions = contextMap.directions;
        var map = contextMap.map;
        if (!(positions.origen && positions.destino)) {
            return;
        }

        directions.service.route({
            origin: positions.origen,
            destination: positions.destino,
            travelMode: travelMode
        }, function(response, status) {
            if (status === 'OK') {
                directions.display.setDirections(response);
                map.setZoom(17);
            } else {
                console.log(status);
                window.alert('Ocurrio un error');
            }
        });
    }

    function listenerAutoComplete (contextMap, autoComplete, positionName) {
        var place = autoComplete.getPlace();
        if (!place.geometry) {
            return;
        }

        var location = place.geometry.location;

        contextMap.positions[positionName] = location;

        displayMaker(contextMap, positionName, location);
        displayRoute(contextMap, 'DRIVING');
    }

    window.onload = function() {
        init(mapId);
    };
})('mapa');