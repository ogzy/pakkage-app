angular.module('Pakkage.MainController', [])
  .controller('TabsCtrl', ['$scope', '$state', 'LoadingService', function ($scope, $state, LoadingService) {
    $scope.loadRegister = function () {
      LoadingService.show();
      $state.go('tab.register');
    };
  }])
  .controller('MainCtrl', ['$scope', 'LocalStorageService', '$state', function ($scope, LocalStorageService, $state) {
    if (LocalStorageService.get('isAuthenticated') != true) {
      $state.go("tab.login");
    }

  }])
  .controller('MenuCtrl', ['$scope', 'LocalStorageService', '$state', 'PopupService', function ($scope, LocalStorageService, $state, PopupService) {
    if (LocalStorageService.get('isAuthenticated') != true) {
      $state.go("tab.login");
    }
    $scope.fullFilled = LocalStorageService.get('fullFilled');
    $scope.approve = LocalStorageService.get('approve');
    $scope.userType = LocalStorageService.get('userType');

    console.log('PakkageBeta: MainController approve : ' + $scope.approve);
    console.log('PakkageBeta: MainController fullFilled : ' + $scope.fullFilled);
    console.log('PakkageBeta: MainController userType : ' + $scope.userType);

    $scope.logout = function () {
      LocalStorageService.clear();
      $state.go("tab.login");
    };
    $scope.showFullFilledPopup = function () {
      PopupService.alert('Warning', 'E119');
    };
  }])
  .controller('HomeCtrl', ['$scope', 'LocalStorageService', '$state', 'PackageService', 'PopupService', 'LoadingService', '$uibModal', '$rootScope', 'PackageFilterService', '$interval', function ($scope, LocalStorageService, $state, PackageService, PopupService, LoadingService, $uibModal, $rootScope, PackageFilterService, $interval) {
    if (LocalStorageService.get('isAuthenticated') != true) {
      $state.go("tab.login");
    }


    LoadingService.show();


    $scope.packages = [];
    $rootScope.packages = [];

    var currentFilters = {
      statusFilter: $rootScope.statusFilter,
      dateFilter: $rootScope.dateFilter,
      directionFilter: $rootScope.directionFilter
    }, detailFilters = {
      status: $rootScope.status,
      fromMe: $scope.fromMe,
      toMe: $scope.toMe,
      date : $scope.date
    };

    $scope.refreshPackages = function () {
      console.log('$rootScope.directionFilter : ' + $rootScope.directionFilter);
      LoadingService.show();
      var getPackagesPromise = PackageService.getPackages(LocalStorageService.get('userId'), LocalStorageService.get('email'), LocalStorageService.get('token'));
      getPackagesPromise.then(
        function (package) {

          if (package.data.errorCode == 0) {
            LocalStorageService.save('packages', package.data.packages);
            PackageFilterService.homePackagesFilter(currentFilters, detailFilters);
            $scope.packages = $rootScope.packages;
            console.log('$rootScope.directionFilter : ' + $rootScope.directionFilter);
            LoadingService.hide();
          } else {
            LoadingService.hide();
            PopupService.alert('Error', package.data.errorCode);
          }
          $scope.$broadcast('scroll.refreshComplete');
        },
        function (errorPayload) {
          LoadingService.hide();
          $scope.$broadcast('scroll.refreshComplete');
          PopupService.alert('Error', 999);
        });
    };

    var getPackagesPromise = PackageService.getPackages(LocalStorageService.get('userId'), LocalStorageService.get('email'), LocalStorageService.get('token'));
    getPackagesPromise.then(
      function (package) {
        if (package.data.errorCode == 0) {
          LocalStorageService.save('packages', package.data.packages);
          if (!currentFilters.statusFilter)
            $rootScope.packages = package.data.packages;
          else
            PackageFilterService.homePackagesFilter(currentFilters, detailFilters);
          $scope.packages = $rootScope.packages;
          console.log($scope.packages);
          LoadingService.hide();
        } else {
          LoadingService.hide();
          PopupService.alert('Error', package.data.errorCode);
        }
      },
      function (errorPayload) {
        LoadingService.hide();
        PopupService.alert('Error', 999);
      });


    $scope.editPackage = function (packkageId) {
      $state.go('app.editPackage', {
        packageId: packkageId
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

  }])
  .controller('OpenFilterModalInstanceCtrl', ['$scope', '$uibModalInstance', 'filters', 'moment', 'LocalStorageService', '$filter', '$rootScope', 'PackageFilterService', 'PopupService', '$uibModal', function ($scope, $uibModalInstance, filters, moment, LocalStorageService, $filter, $rootScope, PackageFilterService, PopupService, $uibModal) {
    $scope.date = $rootScope.date;
    $scope.ok = function () {
      var currentFilters = {
        statusFilter: $scope.statusFilter,
        dateFilter: $scope.dateFilter,
        directionFilter: $scope.directionFilter
      }, detailFilters = {
        status: $scope.status,
        fromMe: $scope.fromMe,
        toMe: $scope.toMe,
        date : $scope.radioDate
      };
      PackageFilterService.homePackagesFilter(currentFilters, detailFilters);
      $uibModalInstance.close();

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
      }
      else {
        $scope.fromMe = true;
        $scope.toMe = true;
      }
    };


    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }])
.controller('QRCodeCtrl', ['$scope', 'LocalStorageService', '$state', function ($scope, LocalStorageService, $state) {
  document.addEventListener("deviceready", function () {

    cordova.plugins.barcodeScanner.scan(
      function (result) {
        alert("We got a barcode\n" +
          "Result: " + result.text + "\n" +
          "Format: " + result.format + "\n" +
          "Cancelled: " + result.cancelled);
      },
      function (error) {
        alert("Scanning failed: " + error);
      }
    );

  }, false);

}])
