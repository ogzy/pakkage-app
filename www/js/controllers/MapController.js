angular.module('Pakkage.MapController', [])
  .controller('MapCtrl', ['$scope', '$state', 'LoadingService','$rootScope','$cordovaGeolocation', function($scope, $state, LoadingService,$rootScope,$cordovaGeolocation) {

      $cordovaGeolocation
      .getCurrentPosition()
      .then(function (positionSuccess) {
          console.log(positionSuccess);
          $rootScope.currentPosition = { lat : positionSuccess.coords.latitude,long : positionSuccess.coords.longitude };
          var map = new google.maps.Map(document.getElementById('map'), {
            center: {
              lat: $rootScope.currentPosition.lat,
              lng: $rootScope.currentPosition.long
            },
            zoom: 11,
            disableDefaultUI: true,
            zoomControl: true,
            mapTypeControl: true,
            scaleControl: true
          });
          var myLatlng = new google.maps.LatLng($rootScope.currentPosition.lat,$rootScope.currentPosition.long);
          var infowindow = new google.maps.InfoWindow({
              content: '<b>This is your location</b>'
            });
          var marker = new google.maps.Marker({
              position: myLatlng,
              animation: google.maps.Animation.DROP
          });
          var dragged = 0;
          map.addListener('tilesloaded', function() {
            // 3 seconds after the center of the map has changed, pan back to the
            // marker.
            console.log('tilesloaded')
            window.setTimeout(function() {
              console.log(' after timeout tilesloaded')
              if(dragged == 0)
                infowindow.open(map, marker);
                dragged++;
            }, 1000);
          });
          map.addListener('center_changed',function(){
            console.log('center_changed')
            //dragged++;
          });

          var cityCircle = new google.maps.Circle({
            strokeColor: '#136BFF',
            strokeOpacity: 0.5,
            strokeWeight: 1,
            fillColor: '#89B3F9',
            fillOpacity: 0.1,
            map: map,
            center: {
              lat: $rootScope.currentPosition.lat,
              lng: $rootScope.currentPosition.long
            },
            radius: 1000*15
          });
          var directionsDisplay = new google.maps.DirectionsRenderer;
          var directionsService = new google.maps.DirectionsService;

          directionsService.route({
            origin: {
              lat: $rootScope.currentPosition.lat,
              lng: $rootScope.currentPosition.long
            },
            destination: {
                lat: 40.830530,
                lng: 29.299939
            },
            travelMode: google.maps.TravelMode.DRIVING
          }, function(response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
              directionsDisplay.setDirections(response);
            } else {
              window.alert('Directions request failed due to ' + status);
            }
          });

           directionsDisplay.setMap(map);
          // To add the marker to the map, call setMap();
          marker.setMap(map);
      }, function(err) {
       console.log('error : ' + JSON.stringify(err))
      });



  }])
