'use strict'

angular.module('Pakkage.MainController', [])
  .controller('TabsCtrl', ['$scope', '$state', 'LoadingService', function ($scope, $state, LoadingService) {
    $scope.loadRegister = function () {
      LoadingService.show();
      $state.go('tab.register');
    };
  }])
  .controller('MainCtrl', ['$scope', 'LocalStorageService', '$state', function ($scope, LocalStorageService, $state) {

  }])
  .controller('MenuCtrl', ['$scope', 'LocalStorageService', '$state', 'PopupService', 'ProfileService', function ($scope, LocalStorageService, $state, PopupService, ProfileService) {

    $scope.fullFilled = LocalStorageService.get('fullFilled');
    $scope.approve = LocalStorageService.get('approve');
    $scope.userType = LocalStorageService.get('userType');

    //console.log('PakkageBeta: MainController approve : ' + $scope.approve);
    //console.log('PakkageBeta: MainController fullFilled : ' + $scope.fullFilled);
    //console.log('PakkageBeta: MainController userType : ' + $scope.userType);

    $scope.logout = function () {
      LocalStorageService.clear();
      $state.go("tab.login");
    };

    $scope.navigateCreatePackage = function () {
      if ($scope.fullFilled)
        $state.go('app.createPackage');
      else
        PopupService.alert('Warning', 'E119');
    };

    $scope.refreshMenu = function () {
      ProfileService.getUserProfile(LocalStorageService.get('email'), LocalStorageService.get('token')).then(function (user) {
          ////console.log(JSON.stringify(login));

          if (user.data.errorCode == 0) {

            //console.log(user.data.user);
            LocalStorageService.save('fullFilled', user.data.user.fullFilled);
            LocalStorageService.save('approve', user.data.user.approve);
            $scope.fullFilled = user.data.user.fullFilled;
            $scope.approve = user.data.user.approve;
            $scope.$broadcast('scroll.refreshComplete');
          } else {
            $scope.$broadcast('scroll.refreshComplete');
            PopupService.alert('Error', login.data.errorCode);
          }
        },
        function (error) {
          $scope.$broadcast('scroll.refreshComplete');
          PopupService.alert('Technical Error', 999);
        });
    };

  }])
  .controller('HomeCtrl', ['$scope', 'LocalStorageService', '$state', 'PackageService', 'PopupService', 'LoadingService', '$uibModal', '$rootScope', 'PackageFilterService', '$interval', '$ionicHistory', 'ScanQR', '$cordovaGeolocation', 'HubService', function ($scope, LocalStorageService, $state, PackageService, PopupService, LoadingService, $uibModal, $rootScope, PackageFilterService, $interval, $ionicHistory, ScanQR, $cordovaGeolocation, HubService) {
    LoadingService.show();
    $scope.$on('$ionicView.beforeEnter', function (e, config) {
      config.enableBack = false;
    });
    $scope.packages = [];
    $rootScope.packages = [];
    $scope.toMePackages = [];
    $scope.userType = LocalStorageService.get('userType');
    $scope.statusToMe = {
      open: true
    }

    //console.log($scope.userType);
    var currentFilters = {
        statusFilter: $rootScope.statusFilter,
        dateFilter: $rootScope.dateFilter,
        directionFilter: $rootScope.directionFilter
      },
      detailFilters = {
        status: $rootScope.status,
        fromMe: $scope.fromMe,
        toMe: $scope.toMe,
        date: $scope.date
      };

    $scope.refreshPackages = function () {
      //console.log('$rootScope.directionFilter : ' + $rootScope.directionFilter);
      LoadingService.show();
      var getPackagesPromise = PackageService.getPackages(LocalStorageService.get('userId'), LocalStorageService.get('email'), LocalStorageService.get('token'));
      getPackagesPromise.then(
        function (pck) {

          if (pck.data.errorCode == 0) {
            LocalStorageService.save('packages', pck.data.packages);
            PackageFilterService.homePackagesFilter(currentFilters, detailFilters);
            $scope.packages = $rootScope.packages;
            if ($scope.userType == 'Hub' || $scope.userType == 'Driver')
              $scope.toMePackages = PackageFilterService.filterHubPackages();
            //console.log('$rootScope.directionFilter : ' + $rootScope.directionFilter);
            LoadingService.hide();
          } else {
            LoadingService.hide();
            PopupService.alert('Error', pck.data.errorCode);
          }
          $scope.$broadcast('scroll.refreshComplete');
        },
        function (errorPayload) {
          LoadingService.hide();
          $scope.$broadcast('scroll.refreshComplete');
          PopupService.alert('Error', 999);
        });
    };

    var getPackagesPromise = PackageService.getPackages(LocalStorageService.get('userId'), LocalStorageService.get('email'),
      LocalStorageService.get('token'));
    getPackagesPromise.then(
      function (pck) {
        if (pck.data.errorCode == 0) {
          LocalStorageService.save('packages', pck.data.packages);
          if (!currentFilters.statusFilter)
            $rootScope.packages = pck.data.packages;
          else
            PackageFilterService.homePackagesFilter(currentFilters, detailFilters);
          $scope.packages = $rootScope.packages;
          $scope.toMePackages = PackageFilterService.filterHubPackages();
          //console.log($scope.packages);
          //console.log($scope.toMePackages);
          LoadingService.hide();
        } else {
          LoadingService.hide();
          PopupService.alert('Error', pck.data.errorCode);
        }
      },
      function (errorPayload) {
        LoadingService.hide();
        PopupService.alert('Error', 999);
      });


    $scope.editPackage = function (packkageId, mode) {

      $state.go('app.editPackage', {
        packageId: packkageId,
        mode: mode
      });
    };

    $rootScope.$on("callSyncPackagesMethod", function () {
      $scope.syncPackages();
    });

    $scope.syncPackages = function () {

      if ($rootScope.packages) {
        $scope.packages = $rootScope.packages;
      }

    };

    $scope.openFilterModal = function () {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'openFilterModalContent.html',
        controller: 'OpenFilterModalInstanceCtrl',
        size: 'sm',
        resolve: {
          filters: function () {
            return $scope.filters;
          }
        }
      });
      $rootScope.filterModalInstance = modalInstance;

      modalInstance.result.then(function (selectedItem) {
      }, function () {
        //$log.info('Modal dismissed at: ' + new Date());
      });

    };

    $scope.scanQRFromHomePage = function () {
      document.addEventListener("deviceready", function () {
        cloudSky.zBar.scan(ScanQR.scanMessages({
            text_title: 'Package Scanner',
            text_instructions: 'Search package with this QRCode',
            drawSight: true
          }),
          function (success) {
            LoadingService.show();
            PackageService.getPackageByQrCodeId(success, LocalStorageService.get('email'), LocalStorageService.get('token')).then(
              function (response) {
                if (response.data.errorCode == 0) {
                  LoadingService.hide();
                  $state.go('app.editPackage', {
                    packageId: response.data.packageId._id,
                    mode: 'readonly'
                  });
                } else {
                  LoadingService.hide();
                  PopupService.alert('Error', response.data.errorCode);
                }

              },
              function (error) {
                LoadingService.hide();
                PopupService.alert('Error', 999);
              });
          },
          function (error) {
          });
      }, false);

    };

    var map;
    var polylines = [];
    var markers = [];
    $scope.currentLocationLat = 0;
    $scope.currentLocationLng = 0;
    $scope.driverHubModel = {};
    $scope.driverHubs = [];

    // Driver Map Operations
    if (LocalStorageService.get('userType') == 'Driver') {

      var mapOptions = {
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: true,
        fullscreenControl: false
      };
      map = new google.maps.Map(document.getElementById("driverMap"), mapOptions);

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

            var hubPromise = HubService.getHubsByCurrentLocation(LocalStorageService.get('token'), LocalStorageService.get('email'), lat, lng);

            hubPromise.then(
              function (response) {

                console.log(response);

                if (response.data.errorCode == 0) {

                  $scope.driverHubs = response.data.hubs;
                  //$scope.driverHubPackagesArray = response.data.packages;

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

                  for (var i = 0; i < response.data.hubs.length; i++) {

                    var paramHub = response.data.hubs[i];

                    if (paramHub.location != undefined) {

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
                        google.maps.event.addListener(markers[i], 'click', function(){

                          document.getElementById("driverMapHubDetail").style.display = 'block';

                          var markerIndex = markers[i].title;
                          console.log('MARKER INDEX : '+markerIndex);
                          var selectedHub = $scope.driverHubs[markerIndex];

                          $scope.driverHubModel.Id = selectedHub._id;
                          $scope.driverHubModel.profilePicture = selectedHub.profilePicture;
                          $scope.driverHubModel.hubName = selectedHub.name;
                          console.log('MARKER NAME : '+selectedHub.name);
                          $scope.driverHubModel.hubLoc = selectedHub.address[0].city + ", " + selectedHub.address[0].state;
                          $scope.driverHubModel.hubPhone = selectedHub.workPhone;
                          $scope.driverHubModel.hubEmail = selectedHub.email;

                          if (response.data.packages.length > 0) {
                            LocalStorageService.save('packages', response.data.packages);
                            console.log("PACKAGES : " + LocalStorageService.get('packages'));
                          }

                          if (polylines.length > 0) {
                            $scope.removeRoute();
                          }

                          $scope.drawRoute(markers[i]);

                        });
                      }
                      addListener(i);

                      /*google.maps.event.addListener(marker, "click", function (e) {

                        document.getElementById("driverMapHubDetail").style.display = 'block';

                        var markerIndex = marker.title;
                        console.log('MARKER INDEX : '+markerIndex);
                        var selectedHub = $scope.driverHubs[markerIndex];

                        $scope.driverHubModel.Id = selectedHub._id;
                        $scope.driverHubModel.profilePicture = selectedHub.profilePicture;
                        $scope.driverHubModel.hubName = selectedHub.name;
                        console.log('MARKER NAME : '+selectedHub.name);
                        $scope.driverHubModel.hubLoc = selectedHub.address[0].city + ", " + selectedHub.address[0].state;
                        $scope.driverHubModel.hubPhone = selectedHub.workPhone;
                        $scope.driverHubModel.hubEmail = selectedHub.email;

                        if (response.data.packages.length > 0) {
                          LocalStorageService.save('packages', response.data.packages);
                          console.log("PACKAGES : " + LocalStorageService.get('packages'));
                        }

                        if (polylines.length > 0) {
                          $scope.removeRoute();
                        }

                        $scope.drawRoute(marker);

                      });*/

                    }
                  }
                  if ($scope.driverHubs.length > 0) {
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

        var src = marker.getPosition();
        var des = new google.maps.LatLng($scope.currentLocationLat, $scope.currentLocationLng);
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
    }

    $scope.navigateHubPackageList = function () {
      console.log('SELECTED HUB ID :' + $scope.driverHubModel.Id);

      $state.go("app.packagesListByHub", {selectedHubId: $scope.driverHubModel.Id});
    }

    $scope.openSenderHubViewMap = function () {

      $state.go('app.senderMapView');
    }

  }])
  .controller('OpenFilterModalInstanceCtrl', ['$scope', '$uibModalInstance', 'filters', 'moment',
    'LocalStorageService', '$filter', '$rootScope', 'PackageFilterService',
    'PopupService', '$uibModal',
    function ($scope, $uibModalInstance, filters, moment, LocalStorageService, $filter,
              $rootScope, PackageFilterService, PopupService, $uibModal) {
      $scope.date = $rootScope.date;
      $scope.ok = function () {
        var currentFilters = {
            statusFilter: $scope.statusFilter,
            dateFilter: $scope.dateFilter,
            directionFilter: $scope.directionFilter
          },
          detailFilters = {
            status: $scope.status,
            fromMe: $scope.fromMe,
            toMe: $scope.toMe,
            date: $scope.radioDate
          };
        PackageFilterService.homePackagesFilter(currentFilters, detailFilters);
        $uibModalInstance.close();
        document.getElementById('driverMap').style.display = 'none';
        document.getElementById('driverMapHubDetail').style.display = 'none';
      };
      $scope.statusFilterClicked = function () {
        if (!$scope.status.draft && !$scope.status.readyToSend && !$scope.status.onRoad && !$scope.status.driverPicked)
          $scope.statusFilter = false;
        else
          $scope.statusFilter = true;
      };
      $scope.statusCheckboxClicked = function () {
        if (!$scope.statusFilter) {
          $scope.status.draft = false;
          $scope.status.readyToSend = false;
          $scope.status.onRoad = false;
          $scope.status.driverPicked = false;
        }
      };

      $scope.dateFilterClicked = function () {
        $scope.dateFilter = true;
      };

      $scope.directionFilterClicked = function () {
        if (!$scope.fromMe && !$scope.toMe)
          $scope.directionFilter = false;
        else
          $scope.directionFilter = true;
      };

      $scope.directionCheckboxClicked = function () {
        if (!$scope.directionFilter) {
          $scope.fromMe = false;
          $scope.toMe = false;
        } else {
          $scope.fromMe = true;
          $scope.toMe = true;
        }
      };


      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    }])
  .controller('PackagesListByHubCntrl',
    ['$scope', 'moment',
      'LocalStorageService', '$filter', '$rootScope', 'PackageFilterService',
      'PopupService', '$stateParams',
      function ($scope, moment, LocalStorageService, $filter,
                $rootScope, PackageFilterService, PopupService, $stateParams) {

        var selectedHub = $stateParams.selectedHubId;
        //$scope.packageList = $filter('filter')(LocalStorageService.get('packages'), function (err, packages) {
        // return packages.hubs._id = $stateParams.selectedHubId
        //});

        $scope.myPackages = PackageFilterService.filterPackagesByHubId(selectedHub);

        console.log('CONTROLLER PACKAGES :' + $scope.myPackages);


      }])
