angular.module('Pakkage.MainController', [])
  .controller('TabsCtrl', ['$scope', '$state', 'LoadingService', function($scope, $state, LoadingService) {
    $scope.loadRegister = function() {
      LoadingService.show();
      $state.go('tab.register');
    };
  }])
  .controller('MainCtrl', ['$scope', 'LocalStorageService', '$state', function($scope, LocalStorageService, $state) {

  }])
  .controller('MenuCtrl', ['$scope', 'LocalStorageService', '$state', 'PopupService', 'ProfileService', function($scope, LocalStorageService, $state, PopupService, ProfileService) {

    $scope.fullFilled = LocalStorageService.get('fullFilled');
    $scope.approve = LocalStorageService.get('approve');
    $scope.userType = LocalStorageService.get('userType');

    console.log('PakkageBeta: MainController approve : ' + $scope.approve);
    console.log('PakkageBeta: MainController fullFilled : ' + $scope.fullFilled);
    console.log('PakkageBeta: MainController userType : ' + $scope.userType);

    $scope.logout = function() {
      LocalStorageService.clear();
      $state.go("tab.login");
    };

    $scope.navigateCreatePackage = function() {
      if ($scope.fullFilled)
        $state.go('app.createPackage');
      else
        PopupService.alert('Warning', 'E119');
    };

    $scope.refreshMenu = function() {
      ProfileService.getUserProfile(LocalStorageService.get('email'), LocalStorageService.get('token')).then(function(user) {
          //console.log(JSON.stringify(login));

          if (user.data.errorCode == 0) {

            console.log(user.data.user);
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
        function(error) {
          $scope.$broadcast('scroll.refreshComplete');
          PopupService.alert('Technical Error', 999);
        });
    };

  }])
  .controller('HomeCtrl', ['$scope', 'LocalStorageService', '$state', 'PackageService', 'PopupService', 'LoadingService', '$uibModal', '$rootScope', 'PackageFilterService', '$interval', '$ionicHistory','ScanQR','$timeout','$cordovaGeolocation', function($scope, LocalStorageService, $state, PackageService, PopupService, LoadingService, $uibModal, $rootScope, PackageFilterService, $interval, $ionicHistory,ScanQR,$timeout,$cordovaGeolocation) {
    LoadingService.show();
    $scope.$on('$ionicView.beforeEnter', function(e, config) {
      config.enableBack = false;
    });
    $scope.packages = [];
    $rootScope.packages = [];
    $scope.toMePackages = [];
    $scope.userType = LocalStorageService.get('userType');
    $scope.statusToMe = {
      open: true
    }

    console.log($scope.userType);
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

    $scope.refreshPackages = function() {
      console.log('$rootScope.directionFilter : ' + $rootScope.directionFilter);
      LoadingService.show();
      var getPackagesPromise = PackageService.getPackages(LocalStorageService.get('userId'), LocalStorageService.get('email'), LocalStorageService.get('token'));
      getPackagesPromise.then(
        function(package) {

          if (package.data.errorCode == 0) {
            LocalStorageService.save('packages', package.data.packages);
            PackageFilterService.homePackagesFilter(currentFilters, detailFilters);
            $scope.packages = $rootScope.packages;
            if ($scope.userType == 'Hub' || $scope.userType == 'Driver')
              $scope.toMePackages = PackageFilterService.filterHubPackages();
            console.log('$rootScope.directionFilter : ' + $rootScope.directionFilter);
            LoadingService.hide();
          } else {
            LoadingService.hide();
            PopupService.alert('Error', package.data.errorCode);
          }
          $scope.$broadcast('scroll.refreshComplete');
        },
        function(errorPayload) {
          LoadingService.hide();
          $scope.$broadcast('scroll.refreshComplete');
          PopupService.alert('Error', 999);
        });
    };

    var getPackagesPromise = PackageService.getPackages(LocalStorageService.get('userId'), LocalStorageService.get('email'), LocalStorageService.get('token'));
    getPackagesPromise.then(
      function(package) {
        if (package.data.errorCode == 0) {
          LocalStorageService.save('packages', package.data.packages);
          if (!currentFilters.statusFilter)
            $rootScope.packages = package.data.packages;
          else
            PackageFilterService.homePackagesFilter(currentFilters, detailFilters);
          $scope.packages = $rootScope.packages;
          $scope.toMePackages = PackageFilterService.filterHubPackages();
          console.log($scope.packages);
          console.log($scope.toMePackages);
          LoadingService.hide();
        } else {
          LoadingService.hide();
          PopupService.alert('Error', package.data.errorCode);
        }
      },
      function(errorPayload) {
        LoadingService.hide();
        PopupService.alert('Error', 999);
      });


    $scope.editPackage = function(packkageId, mode) {

      $state.go('app.editPackage', {
        packageId: packkageId,
        mode: mode
      });
    };

    $rootScope.$on("callSyncPackagesMethod", function() {
      $scope.syncPackages();
    });

    $scope.syncPackages = function() {

      if ($rootScope.packages) {
        $scope.packages = $rootScope.packages;
      }

    };


    $scope.openFilterModal = function() {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'openFilterModalContent.html',
        controller: 'OpenFilterModalInstanceCtrl',
        size: 'sm',
        resolve: {
          filters: function() {
            return $scope.filters;
          }
        }
      });
      $rootScope.filterModalInstance = modalInstance;

      modalInstance.result.then(function(selectedItem) {}, function() {
        //$log.info('Modal dismissed at: ' + new Date());
      });

    };

    $scope.scanQRFromHomePage = function() {
      document.addEventListener("deviceready", function() {
        cloudSky.zBar.scan(ScanQR.scanMessages({
          text_title: 'Package Scanner',
          text_instructions: 'Search package with this QRCode',
          drawSight: true
        }),
          function(success) {
            LoadingService.show();
            PackageService.getPackageByQrCodeId(success, LocalStorageService.get('email'),LocalStorageService.get('token')).then(
              function(response) {
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
              function(error) {
                LoadingService.hide();
                PopupService.alert('Error', 999);
              });
          },
          function(error) {});
      }, false);

    };
    if(LocalStorageService.get('userType') == 'Driver')
    {
      LoadingService.show();

      $cordovaGeolocation
        .getCurrentPosition()
        .then(function(positionSuccess) {

          var map = new google.maps.Map(document.getElementById('driverHomeMap'), {
            center: {
              lat: positionSuccess.coords.latitude,
              lng: positionSuccess.coords.longitude
            },
            zoom: 11,
            disableDefaultUI: true,
            zoomControl: true,
            mapTypeControl: true,
            scaleControl: true
          }),
          currentLatLng = new google.maps.LatLng(positionSuccess.coords.latitude,positionSuccess.coords.longitude),
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
              lat: positionSuccess.coords.latitude,
              lng: positionSuccess.coords.longitude
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

              var currentPosition = {
                lat: positionSuccess.coords.latitude,
                lng: positionSuccess.coords.longitude
              }




              var directionsDisplay = new google.maps.DirectionsRenderer;
              var directionsService = new google.maps.DirectionsService;

              directionsService.route({
                origin: {
                  lat: currentPosition.lat,
                  lng:currentPosition.lng
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

              LoadingService.hide();



        }, function(error) {
          console.log('Map Error')
        });



    }



  }])
  .controller('OpenFilterModalInstanceCtrl', ['$scope', '$uibModalInstance', 'filters', 'moment', 'LocalStorageService', '$filter', '$rootScope', 'PackageFilterService', 'PopupService', '$uibModal', function($scope, $uibModalInstance, filters, moment, LocalStorageService, $filter, $rootScope, PackageFilterService, PopupService, $uibModal) {
    $scope.date = $rootScope.date;
    $scope.ok = function() {
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

    };
    $scope.statusFilterClicked = function() {
      if (!$scope.status.draft && !$scope.status.readyToSend && !$scope.status.onRoad && !$scope.status.driverPicked)
        $scope.statusFilter = false;
      else
        $scope.statusFilter = true;
    };
    $scope.statusCheckboxClicked = function() {
      if (!$scope.statusFilter) {
        $scope.status.draft = false;
        $scope.status.readyToSend = false;
        $scope.status.onRoad = false;
        $scope.status.driverPicked = false;
      }
    };

    $scope.dateFilterClicked = function() {
      $scope.dateFilter = true;
    };

    $scope.directionFilterClicked = function() {
      if (!$scope.fromMe && !$scope.toMe)
        $scope.directionFilter = false;
      else
        $scope.directionFilter = true;
    };

    $scope.directionCheckboxClicked = function() {
      if (!$scope.directionFilter) {
        $scope.fromMe = false;
        $scope.toMe = false;
      } else {
        $scope.fromMe = true;
        $scope.toMe = true;
      }
    };


    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
  }]);
