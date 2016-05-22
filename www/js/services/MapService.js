angular.module('Pakkage.MapService', [])
  .factory('GoogleMaps', function($timeout) {
    return {
      getMapWithMarker: function(divId,position) {

        setTimeout(function(){
          var map = new google.maps.Map(document.getElementById(divId), {
            center: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            },
            zoom: 11,
            disableDefaultUI: true,
            zoomControl: true,
            mapTypeControl: true,
            scaleControl: true
          }),
          currentLatLng = new google.maps.LatLng(position.coords.latitude,position.coords.longitude),
          currentLatLng2 = new google.maps.LatLng(40.830530, 29.299939),
          currentLatLng3 = new google.maps.LatLng(40.900888, 29.309802),
          currentLatLng4 = new google.maps.LatLng(40.939111, 29.246596),

          thisIsYou = new google.maps.InfoWindow({
              content: '<b>This is you</b>'
            }),
          currentMarker = new google.maps.Marker({
              position: currentLatLng,
              animation: google.maps.Animation.DROP
          }),
          currentCircle = new google.maps.Circle({
            strokeColor: '#136BFF',
            strokeOpacity: 0.5,
            strokeWeight: 1,
            fillColor: '#89B3F9',
            fillOpacity: 0.1,
            map: map,
            center: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            },
            radius: 1000*15
          }),
          currentMarker2 = new google.maps.Marker({
              position: currentLatLng2,
              animation: google.maps.Animation.DROP
          }),
          currentMarker3 = new google.maps.Marker({
              position: currentLatLng3,
              animation: google.maps.Animation.DROP
          }),
          currentMarker4 = new google.maps.Marker({
              position: currentLatLng4,
              animation: google.maps.Animation.DROP
          });

          currentMarker.setMap(map);
          $timeout(function () {
            currentMarker2.setMap(map);
            currentMarker3.setMap(map);
            currentMarker4.setMap(map);
          }, 3000);

          var dragged = 0;
          map.addListener('tilesloaded', function() {
            // 3 seconds after the center of the map has changed, pan back to the
            // marker.
            console.log('tilesloaded')
            window.setTimeout(function() {
              console.log(' after timeout tilesloaded')
              if(dragged == 0)
                thisIsYou.open(map, currentMarker);
                dragged++;
            }, 1000);
          });
          return map;
        },100)

      }
    }
  });
