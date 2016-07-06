angular.module('Pakkage.routes', [])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
    //-- TABS ROUTERS
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'pages/tabs.html'
      })
      .state('tab.login', {
        url: '/login/:errorCode/:statusMessage',
        views: {
          'tab-login': {
            templateUrl: 'pages/tab-login.html'
          }
        }
      })
      .state('tab.register', {
        url: '/register',
        views: {
          'tab-register': {
            templateUrl: 'pages/tab-register.html',
            controller: 'RegisterCtrl'
          }
        }
      })
      .state('tab.forgotPassword', {
        url: '/forgotPassword',
        views: {
          'tab-forgotPassword': {
            templateUrl: 'pages/tab-forgotPassword.html',
            controller: 'ForgotPasswordCtrl'
          }
        }
      })
      //-- BEFORE LOGIN PAGES ROUTES
      .state('activate', {
        url: '/activate/:email',
        cache: false,
        templateUrl: 'pages/page-activateAccount.html'
      })
      .state('forgotPassVerify', {
        url: '/forgotVerify/:email',
        templateUrl: 'pages/page-forgotPassVerify.html'
      })
      .state('changePassword', {
        url: '/changePassword/:email/:restoreCode',
        templateUrl: 'pages/page-changePassword.html'
      })
      //-- AFTER LOGIN,APPLICATIONS INTERNAL PAGES ROUTES
      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'pages/app-menu.html',
        controller: 'MainCtrl'
      })
      .state('app.home', {
        url: '/home',
        views: {
          'menuContent': {
            templateUrl: 'pages/app-home.html'
          }
        }
      })
      .state('app.profile', {
        url: '/profile',
        views: {
          'menuContent': {
            templateUrl: 'pages/app-profile.html'
          }
        }
      })
      .state('app.createPackage', {
        url: '/createPackage',
        views: {
          'menuContent': {
            templateUrl: 'pages/app-createPackage.html'
          }
        }
      })
      .state('app.editPackage', {
        url: '/editPackage/:packageId/:mode',
        views: {
          'menuContent': {
            templateUrl: 'pages/app-editPackage.html'
          }
        }
      })
      .state('app.availableHubs', {
        url: '/availableHubs/:packageId',
        views: {
          'menuContent': {
            templateUrl: 'pages/app-availableHubs.html'
          }
        }
      })
      .state('app.hubDetail', {
        url: '/hubDetail/:hubId/:packageId/:mode',
        views: {
          'menuContent': {
            templateUrl: 'pages/app-hubDetail.html'
          }
        }
      })
      .state('app.changeUserPassword', {
        url: '/changePasswordLogged',
        views: {
          'menuContent': {
            templateUrl: 'pages/app-changePassword.html'
          }
        }
      })
      .state('app.senderMapView', {
        url: '/senderHubMapView',
        views: {
          'menuContent': {
            templateUrl: 'pages/app-senderMapView.html'
          }
        }
      })
      .state('app.packagesListByHub', {
        url: '/packagesListByHub/:selectedHubId',
        views: {
          'menuContent': {
            templateUrl: 'pages/app-packagesListByHub.html',
            controller:'PackagesListByHubCntrl'
          }
        }
      })
      .state('app.testMap', {
        url: '/testMap',
        views: {
          'menuContent': {
            templateUrl: 'pages/test-map.html',
            controller: 'MapCtrl'
          }
        }
      });

    $urlRouterProvider.otherwise('/tab/login/undefined/undefined');

  });
