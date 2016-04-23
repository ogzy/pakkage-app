angular.module('Pakkage.HubsController', [])
.controller('HubsCtrl',['$scope','HubService','LoadingService','PopupService','moment','$filter','$state','$rootScope','LocalStorageService',function($scope,HubService,LoadingService,PopupService,moment,$filter,$state,$rootScope,LocalStorageService){
	LoadingService.show();
    console.log(LocalStorageService.get('userCity'));
	$scope.hubs = [];
    var saltHubs = [],openHubs=[];
    $scope.showOpens = null;
    $rootScope.availableHubs = [];
	var hubsPromise = HubService.getAvailableHubs();
    hubsPromise.then(
        function (hubs) {
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
        function (errorPayload) {
            LoadingService.hide();
            PopupService.alert('Error', 999);
    });
    var click = 0;
    $scope.showOpens = function(){
        if(click%2 == 0) //-- True
        {
            openHubs = [];
            for (var i = 0; i < $scope.hubs.length; i++)
            {
                if($filter('filter')($scope.hubs[i].daysOfOperations, function (day) { return day.value == moment().format('dddd'); })[0] != undefined)
                {
                    openHubs.push($scope.hubs[i]);
                }
            };
            $scope.hubs = openHubs;
        }
        else //--False
            $scope.hubs = saltHubs;
        click++;
    };

    $scope.refreshHubs = function(){
        LoadingService.show();
        var hubsPromise = HubService.getAvailableHubs();
        hubsPromise.then(
            function (hubs) {
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
            function (errorPayload) {
                LoadingService.hide();
                $scope.$broadcast('scroll.refreshComplete');
                PopupService.alert('Error', 999);
        });
    };

    $scope.showDetail = function (hubId) {
        $state.go('app.hubDetail', {
            hubId: hubId
        });
    }
}])
  
.controller('HubDetailCtrl',['$scope','HubService','LoadingService','PopupService','moment','$filter','$state','$rootScope','$stateParams','$ionicPopup',function($scope,HubService,LoadingService,PopupService,moment,$filter,$state,$rootScope,$stateParams,$ionicPopup){
    //LoadingService.show();

    $scope.hub = $filter('filter')($rootScope.availableHubs, function (hub) { return hub._id == $stateParams.hubId })[0];
    $scope.hub.workingDays = '';
    for (var i = 0; i < $scope.hub.daysOfOperations.length; i++) {
        $scope.hub.workingDays += $scope.hub.daysOfOperations[i].value + ' ';
    };

    $scope.showProfilePicture = function(){
        var alertPopup = $ionicPopup.alert({
            title: 'Hub Picture',
            template: '<img style="width:100%" src="http://46.101.115.69:9096/uploads/images/thumbnail/' + $scope.hub.profilePicture + '" />'
        });
    }
}]);
