angular.module('Pakkage.HubsController', [])
  .controller('HubsCtrl', ['$scope', 'HubService', 'LoadingService', 'PopupService', 'moment', '$filter', '$state', '$rootScope', 'LocalStorageService', '$stateParams', 'PackageService', function($scope, HubService, LoadingService, PopupService, moment, $filter, $state, $rootScope, LocalStorageService, $stateParams, PackageService) {
    LoadingService.show();
    console.log(LocalStorageService.get('userCity'));
    $scope.packageId = $stateParams.packageId;
    $scope.hubs = [];
    var saltHubs = [],
      openHubs = [];
    $scope.showOpens = null;
    $rootScope.availableHubs = [];
    var hubsPromise = HubService.getAvailableHubs();
    hubsPromise.then(
      function(hubs) {
        if (hubs.data.errorCode == 0) {
          LoadingService.hide();
          $scope.hubs = hubs.data.hubs;
          saltHubs = hubs.data.hubs;
          $rootScope.availableHubs = hubs.data.hubs;
        } else {
          LoadingService.hide();
          PopupService.alert('Error', 'E110');
        }
      },
      function(errorPayload) {
        LoadingService.hide();
        PopupService.alert('Error', 999);
      });
    var click = 0;
    $scope.showOpens = function() {
      if (click % 2 == 0) //-- True
      {
        openHubs = [];
        for (var i = 0; i < $scope.hubs.length; i++) {
          if ($filter('filter')($scope.hubs[i].daysOfOperations, function(day) {
              return day.value == moment().format('dddd');
            })[0] != undefined) {
            openHubs.push($scope.hubs[i]);
          }
        };
        $scope.hubs = openHubs;
      } else //--False
        $scope.hubs = saltHubs;
      click++;
    };

    $scope.refreshHubs = function() {
      LoadingService.show();
      var hubsPromise = HubService.getAvailableHubs();
      hubsPromise.then(
        function(hubs) {
          if (hubs.data.errorCode == 0) {
            LoadingService.hide();
            $scope.hubs = hubs.data.hubs;
            saltHubs = hubs.data.hubs;
            $rootScope.availableHubs = hubs.data.hubs;
          } else {
            LoadingService.hide();
            PopupService.alert('Error', 'E110');
          }
          $scope.$broadcast('scroll.refreshComplete');
        },
        function(errorPayload) {
          LoadingService.hide();
          $scope.$broadcast('scroll.refreshComplete');
          PopupService.alert('Error', 999);
        });
    };

    $scope.scanQR = function() {
      document.addEventListener("deviceready", function() {
        cloudSky.zBar.scan({
            text_title: 'Pakkage QR Code Scanner',
            text_instructions: 'Please show QR barcode to camera',
            drawSight: true
          },
          function(success) {
            LoadingService.show();
            PackageService.scanQrCode(success, 2, 1, $scope.packageId).then(
              function(response) {
                if (response.data.errorCode == 0) {
                  LoadingService.hide();
                  PopupService.alert('Successful', 'S106').then(function() {
                    $state.go('app.home');
                  })
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
          function(error) { });

      }, false);
    };


    $scope.showDetail = function(hubId) {
      $state.go('app.hubDetail', {
        hubId: hubId,
        packageId : $scope.packageId
      });
    }
  }])

.controller('HubDetailCtrl', ['$scope', 'HubService', 'LoadingService', 'PopupService', 'moment', '$filter', '$state', '$rootScope', '$stateParams', '$ionicPopup','PackageService', function($scope, HubService, LoadingService, PopupService, moment, $filter, $state, $rootScope, $stateParams, $ionicPopup,PackageService) {
  //LoadingService.show();
  $scope.$on('$ionicView.beforeEnter', function (e,config) {
    config.enableBack = false;
  });
  $scope.hub = $filter('filter')($rootScope.availableHubs, function(hub) {
    return hub._id == $stateParams.hubId
  })[0];
  $scope.hub.workingDays = '';
  for (var i = 0; i < $scope.hub.daysOfOperations.length; i++) {
    $scope.hub.workingDays += $scope.hub.daysOfOperations[i].value + ' ';
  };

  $scope.showProfilePicture = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'Hub Picture',
      template: '<img style="width:100%" src="http://46.101.115.69:9096/uploads/images/thumbnail/' + $scope.hub.profilePicture + '" />'
    });
  }

  $scope.scanQR = function() {
    document.addEventListener("deviceready", function() {
      cloudSky.zBar.scan({
          text_title: 'Pakkage QR Code Scanner',
          text_instructions: 'Please show QR barcode to camera',
          drawSight: true
        },
        function(success) {
          LoadingService.show();
          PackageService.scanQrCodeFromHubPage(success, 2, 1, $stateParams.packageId,$stateParams.hubId).then(
            function(response) {
              if (response.data.errorCode == 0) {
                LoadingService.hide();
                PopupService.alert('Successful', 'S106').then(function() {
                  $state.go('app.home');
                })
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
}]);
