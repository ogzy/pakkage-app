angular.module('Pakkage', ['ionic', 'ngCordova', 'Pakkage.LoginController', 'Pakkage.RegisterController', 'Pakkage.MainController', 'Pakkage.PackageController', 'Pakkage.ProfileController', 'Pakkage.HubsController', 'Pakkage.BackendServices', 'Pakkage.ErrorcodeServices', 'Pakkage.UIServices', 'Pakkage.FormControlServices', 'Pakkage.SocialLoginService', 'Pakkage.ChangePassword', 'Pakkage.routes', 'Pakkage.directives', 'ui.bootstrap', 'LocalStorageModule', 'ngOpenFB', 'angucomplete-alt', 'angularMoment'])
  .config(
    function (localStorageServiceProvider) {
      localStorageServiceProvider.setPrefix('pakkage').setStorageType('localStorage');
    }
  )
  .run(function ($ionicPlatform, $templateCache, $rootScope, LocalStorageService, ProfileService, $cordovaNetwork, PopupService, LoadingService, $location, StateService, $interval, $state) {
    $ionicPlatform.ready(function () {

      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }

      /*var type = $cordovaNetwork.getNetwork();

       if(type == 'none' || type == 'unknown')
       {
       PopupService.alert('No Internet Connection','C101').then(function(){
       LoadingService.show();
       });
       }

       $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
       LoadingService.hide();
       });*/


      //-- Global values
      $rootScope.profileThumbnailURL = 'http://192.99.176.14:9096/uploads/images/thumbnail/';
      $rootScope.licenseThumbnailURL = 'http://192.99.176.14:9096/uploads/licenseImages/thumbnail/';

      //-- Global Filter Values
      $rootScope.date = '';
      $rootScope.status =
      {
        draft: false,
        readyToSend: false,
        onRoad: false,
        driverPicked: false
      };

      $rootScope.fromMe = false;
      $rootScope.toMe = false;
      $rootScope.statusFilter = false;
      $rootScope.dateFilter = false;
      $rootScope.directionFilter = false;


      LocalStorageService.save('version', '0.0.1');
      var statePromise = StateService.getAllState('ND');
      statePromise.then(
        function (states) {
          if (states.data.states != null) {
            LocalStorageService.save('cities', states.data.states);
          }
        },
        function (errorPayload) {
          console.log('states error : ' + errorPayload);
        });


      document.addEventListener("backbutton", function () {
        LoadingService.show();
        //-- If success case will happen to login page will be 1,fail case to login will be 0 and warning will be appear
        if ($location.path().indexOf('/activate') > -1) {
          LoadingService.hide();
          PopupService.confirm('Warning', 'C101').then(function (buttonIndex) {

            if (buttonIndex == 1) {
              navigator.app.exitApp();
            }
            if (buttonIndex == 0) {

              $location.path('/activate/' + LocalStorageService.get('activateEmail'));

            }
          });

        }
      }, false);

      var stop, timer = 1800, resetTimer = 1800;

      $rootScope.startSession = function () {
        if (angular.isDefined(stop)) return;
        stop = $interval(function () {
          //console.log(timer);
          timer--;

          if (timer <= 0)
            $rootScope.sessionFinish();
        }, 1000);
      };
      $rootScope.resetInterval = function () {
        timer = resetTimer;
      };
      $rootScope.sessionFinish = function () {
        $interval.cancel(stop);
        stop = undefined;
        PopupService.alert('Warning', 'E120').then(function () {
          LocalStorageService.clear();
          $state.go("tab.login", {errorCode: 'undefined', statusMessage: 'undefined'});
        });
      };


      document.addEventListener("resume", function onResume() {
        $rootScope.resetInterval();
      }, false);


      $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        //console.log('stateChange : ' + toState.url.indexOf('/login'));
        if (toState.url.indexOf('/register') != 0
          && toState.url.indexOf('/login') != 0
          && toState.url.indexOf('/activate') != 0
          && toState.url.indexOf('/forgotVerify') != 0
          && toState.url.indexOf('/changePassword') != 0
          && toState.url.indexOf('/forgotPassword') != 0) {
          $rootScope.resetInterval();
          $rootScope.startSession();
        }

        if (toState.url == '/register') {
          LoadingService.hide();
          console.log('register acildi');
        }
        if (toState.url == '/profile') {
          var profilePromise = ProfileService.getUserProfile(LocalStorageService.get('email'), LocalStorageService.get('token'));
          profilePromise.then(
            function (profile) {

              if (profile.data.errorCode == 0) {
                $rootScope.cachedUser = profile.data.user;
              }
            },
            function (error) {

            }
          );
        }
        if (toState.url == '/createPackage') {

          $rootScope.clearedPackage = {};
        }
      });

      $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams){
          if (toState.url == '/register') {
            LoadingService.show();
            console.log('register basladi');
          }
        })
    });
  });
