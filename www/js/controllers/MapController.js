'use strict'

angular.module('Pakkage.MapController', [])
  .controller('MapCtrl',
    ['$scope',
      'LocalStorageService',
      '$state',
      'PopupService',
      'LoadingService',
      '$uibModal',
      '$rootScope',
      '$interval',
      '$ionicHistory',
      '$cordovaGeolocation',
      'HubService',
      function ($scope,
                LocalStorageService,
                $state,
                PopupService,
                LoadingService,
                $uibModal,
                $rootScope,
                $interval,
                $ionicHistory,
                $cordovaGeolocation,
                HubService) {


        var map;
        var polylines = [];
        $scope.currentLocationLat = 0;
        $scope.currentLocationLng = 0;
        $scope.driverHubModel = {};
        $scope.hubs=[];

        var mapOptions = {
          center: new google.maps.LatLng(40.763246, 29.384718),
          zoom: 10,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          zoomControl: false,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: true,
          fullscreenControl: false
        };
        map = new google.maps.Map(document.getElementById("map"), mapOptions);

        LoadingService.show();

        var posOptions = {timeout: 10000, enableHighAccuracy: false};
        $cordovaGeolocation
          .getCurrentPosition(posOptions)
          .then(function (position) {

              console.log('konum bulunduuuuuuuuu');

              var lat = position.coords.latitude;
              var lng = position.coords.longitude;

              $scope.currentLocationLat = lat;
              $scope.currentLocationLng = lng;


              var currentLocation = new google.maps.LatLng($scope.currentLocationLat, $scope.currentLocationLng);
              var currentMarker = new google.maps.Marker({
                position: currentLocation,
                map: map,
                title: 'Current Location',
                icon: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Map_marker_icon_%E2%80%93_Nicolas_Mollet_%E2%80%93_Male_%E2%80%93_People_%E2%80%93_White.png'
              });


              var lat_lng = new Array();
              var latlngbounds = new google.maps.LatLngBounds();

              latlngbounds.extend(currentMarker.position);

              //sender'ın bulundugu sehir'deki hubları gösterecek
              var senderCity='Clevland';


              var hubsPromise = HubService.getAvailableHubsBySenderLocation(senderCity);
              hubsPromise.then(
                function(hubs) {

                  if (hubs.data.errorCode == 0) {

                    $scope.hubs = hubs.data.hubs;

                    for (var i = 0; i < $scope.hubs.length; i++) {

                      var paramHub = $scope.hubs[i];

                      if (paramHub.location != undefined) {

                        var myLatlng = new google.maps.LatLng(paramHub.location.coordinates[1], paramHub.currentLocation.geometry.coordinates[0]);
                        lat_lng.push(myLatlng);
                        var marker = new google.maps.Marker({
                          position: myLatlng,
                          map: map,
                          title: i.toString(),
                          icon: "http://www.harita.boun.edu.tr/css/img/lojman.png"
                        });

                        latlngbounds.extend(marker.position);

                        //(function (marker, data) {
                        google.maps.event.addListener(marker, "click", function (e) {

                          document.getElementById("driverMapHubDetail").style.display = 'block';

                          //Burada gerekli bilgileri dolduracağız
                          var markerIndex = marker.title;
                          var selectedHub = $scope.hubs[markerIndex];


                          $scope.driverHubModel.hubImage = selectedHub.profilePicture;
                          $scope.driverHubModel.hubName = selectedHub.name;
                          $scope.driverHubModel.hubLoc = selectedHub.address[0].city + ", " + selectedHub.address[0].state;
                          $scope.driverHubModel.hubPhone = selectedHub.workPhone;
                          $scope.driverHubModel.hubEmail = selectedHub.email;

                          if (polylines.length > 0) {
                            $scope.removeRoute();
                          }
                          $scope.drawRoute(marker);

                        });
                        // })(marker, data);
                      }
                    }

                    if($scope.hubs.length > 0)
                    {
                      map.setCenter(latlngbounds.getCenter());
                      map.fitBounds(latlngbounds);
                    }
                    else {
                      map.setZoom(17);
                      map.panTo(currentMarker.position);
                    }


                    LoadingService.hide();

                  }
                },
                function(errorPayload) {
                });
            },
            function (err) {
              LoadingService.hide();
              PopupService.alert('Error', 'E121');
            });


        $scope.drawRoute = function (marker) {

          console.log('draw route');

          //Initialize the Path Array
          var path = new google.maps.MVCArray();
          //Initialize the Direction Service
          var service = new google.maps.DirectionsService();
          //Set the Path Stroke Color
          var poly = new google.maps.Polyline(
            {
              map: map,
              strokeColor: '#4986E7',
              strokeOpacity: 1.0,
              strokeWeight: 3
            }
          );

          polylines.push(poly);

          var src = marker.getPosition();
          var des = new google.maps.LatLng($scope.currentLocationLat, $scope.currentLocationLng);
          ;
          path.push(src);
          poly.setPath(path);

          service.route({
            origin: src,
            destination: des,
            travelMode: google.maps.DirectionsTravelMode.DRIVING
          }, function (result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
              for (var i = 0, len = result.routes[0].overview_path.length; i < len; i++) {
                path.push(result.routes[0].overview_path[i]);
              }
            }
          });

          $scope.fitRoute(src, des);
        }

        $scope.removeRoute = function () {
          for (var i = 0; i < polylines.length; i++) {
            polylines[i].setMap(null);
          }
          polylines = [];
        }

        $scope.fitRoute = function (src, end) {
          var fitBounds = new google.maps.LatLngBounds(src, end);
          map.fitBounds(fitBounds);
        }





      }])
