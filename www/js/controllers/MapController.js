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
      'RegisterService',
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
                HubService,
                RegisterService) {


        var map;
        var polylines = [];
        var markers = [];
        $scope.currentLocationLat = 0;
        $scope.currentLocationLng = 0;
        $scope.driverHubModel = {};
        $scope.hubs = [];

        var mapOptions = {
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

              $scope.currentLocationLat = position.coords.latitude;
              $scope.currentLocationLng = position.coords.longitude;

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

              var geoApiPromise = RegisterService.getCurrentLocationByCoordinate($scope.currentLocationLat, $scope.currentLocationLng);

              geoApiPromise.then(
                function (response) {

                  if (response.status == 200) {

                    //Address Result Format : 434-474 4th Ave N, Cleveland, ND 58424, USA

                    //var senderCity = response.data.results[0].address_components[2].short_name;
                    var senderCity = 'Bismarck';

                    var hubsPromise = HubService.getAvailableHubsBySenderLocation(senderCity);
                    hubsPromise.then(
                      function (response) {

                        if (response.data.errorCode == 0) {

                          $scope.driverHubs = response.data.hubs;

                          for (var i = 0; i < response.data.hubs.length; i++) {

                            var paramHub = response.data.hubs[i];

                            if (paramHub.location.coordinates.length > 0) {

                              var myLatlng = new google.maps.LatLng(paramHub.location.coordinates[1], paramHub.location.coordinates[0]);
                              lat_lng.push(myLatlng);

                              var marker = new google.maps.Marker({
                                position: myLatlng,
                                map: map,
                                title: i.toString(),
                                icon: "http://www.harita.boun.edu.tr/css/img/lojman.png"
                              });

                              latlngbounds.extend(marker.position);

                              markers.push(marker);

                              var addListener = function (i) {
                                google.maps.event.addListener(markers[i], 'click', function () {

                                  document.getElementById("driverMapHubDetail").style.display = 'block';

                                  var markerIndex = i;
                                  console.log('MARKER INDEX : ' + markerIndex);
                                  var selectedHub = $scope.driverHubs[markerIndex];

                                  $scope.driverHubModel.Id = selectedHub._id;
                                  $scope.driverHubModel.profilePicture = selectedHub.profilePicture;
                                  $scope.driverHubModel.hubName = selectedHub.name;
                                  console.log('MARKER NAME : ' + selectedHub.name);
                                  $scope.driverHubModel.hubLoc = selectedHub.address[0].city + ", " + selectedHub.address[0].state;
                                  $scope.driverHubModel.hubPhone = selectedHub.workPhone;
                                  $scope.driverHubModel.hubEmail = selectedHub.email;


                                  if (polylines.length > 0) {
                                    $scope.removeRoute();
                                  }

                                  $scope.drawRoute(markers[i]);

                                });
                              }
                              addListener(i);

                            }
                          }
                          if ($scope.driverHubs.length > 0) {
                            map.setCenter(latlngbounds.getCenter());
                            map.fitBounds(latlngbounds);
                          }
                          else {
                            map.setZoom(17);
                            map.panTo(currentMarker.position);
                            PopupService.alert('Error', 'E122')
                          }

                          console.log(markers);

                          LoadingService.hide();
                        }
                      },
                      function (errorPayload) {

                      });

                    LoadingService.hide();
                  }
                },
                function (errorPayload) {

                  LoadingService.hide();

                });
            },
            function (err) {
              LoadingService.hide();
              PopupService.alert('Error', 'E121');
            });

        $scope.drawRoute = function (marker) {

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
              strokeWeight: 5
            }
          );

          polylines.push(poly);

          var src = new google.maps.LatLng($scope.currentLocationLat, $scope.currentLocationLng);
          var des = marker.getPosition();
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
          console.log(src);
          console.log(end);
          var fitBounds = new google.maps.LatLngBounds(src, end);
          map.fitBounds(fitBounds);
        }


      }])
