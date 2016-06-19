angular.module('Pakkage.LoginController', [])
.controller('LoginCtrl', ['$scope', '$state','$stateParams', 'LoginService', 'LocalStorageService','LoadingService','PopupService','$ionicLoading','$q','FacebookService', function ($scope, $state, $stateParams, LoginService, LocalStorageService,LoadingService,PopupService, $ionicLoading,$q,FacebookService) {
    LoadingService.show();
    
    $scope.statusMessage = undefined;
    if ($stateParams.errorCode == 0) {
        $scope.statusMessage = $stateParams.statusMessage;
    }
    LoadingService.hide();

    $scope.loginUser = function (email, password) {
        LoadingService.show();

        if (email == undefined || password == undefined) {
            LoadingService.hide();
            PopupService.alert('Error',105);
        } else {
            var loginPromise = LoginService.loginUser(email, password);
            loginPromise.then(
                function (login) {
                    ////console.log(JSON.stringify(login));
                    //console.log('PakkageBeta: Login errorCode : ' + login.data.errorCode);
                    if (login.data.errorCode == 0) {
                        ////console.log(login.data.user.fullFilled);
                        LocalStorageService.save('fullFilled', login.data.user.fullFilled);
                        LocalStorageService.save('token', login.data.token);
                        LocalStorageService.save('isAuthenticated', true);
                        LocalStorageService.save('email', login.data.user.email.toLowerCase());
                        LocalStorageService.save('userType', login.data.user.type[0].name);
                        LocalStorageService.save('profilePicture', login.data.user.profilePicture);
                        LocalStorageService.save('userId', login.data.user._id);
                        LocalStorageService.save('approve',login.data.user.approve);
                        if(login.data.user.address[0] != undefined)
                            LocalStorageService.save('userCity',login.data.user.address[0].city);
                        if(!login.data.user.approve && login.data.user.type[0].name != 'Sender')
                            $state.go("app.profile");
                        else if(!login.data.user.fullFilled)
                            $state.go("app.profile");
                        else
                            $state.go("app.home");
                        ////console.log(login.data.token);

                        LoadingService.hide();
                    } else {
                        LoadingService.hide();
                        PopupService.alert('Error',login.data.errorCode);
                    }
                },
                function (error) {
                    LoadingService.hide();
                    PopupService.alert('Technical Error',999);
                }
            );
        }
    };

    // This is the success callback from the login method
      var fbLoginSuccess = function(response) {
        if (!response.authResponse){
          fbLoginError("Cannot find the authResponse");
          return;
        }

        var authResponse = response.authResponse;

        getFacebookProfileInfo(authResponse)
        .then(function(profileInfo) {
          // For the purpose of this example I will store user data on local storage
          FacebookService.setUser({
            authResponse: authResponse,
    				userID: profileInfo.id,
    				name: profileInfo.name,
    				email: profileInfo.email,
            picture : "http://graph.facebook.com/" + authResponse.userID + "/picture?type=large"
          });
          $ionicLoading.hide();
          $state.go('app.home');
        }, function(fail){
          // Fail get profile info
          //console.log('profile info fail', fail);
        });
      };

      // This is the fail callback from the login method
      var fbLoginError = function(error){
        //console.log('fbLoginError', error);
        $ionicLoading.hide();
      };

      // This method is to get the user profile info from the facebook api
      var getFacebookProfileInfo = function (authResponse) {
        var info = $q.defer();

        facebookConnectPlugin.api('/me?fields=email,name,location&access_token=' + authResponse.accessToken, null,
          function (response) {
    				//console.log(JSON.stringify(response));
            info.resolve(response);
          },
          function (response) {
    				//console.log(JSON.stringify(response));
            info.reject(response);
          }
        );
        return info.promise;
      };

      //This method is executed when the user press the "Login with facebook" button
      $scope.facebookSignIn = function() {
        facebookConnectPlugin.getLoginStatus(function(success){
          if(success.status === 'connected'){
            // The user is logged in and has authenticated your app, and response.authResponse supplies
            // the user's ID, a valid access token, a signed request, and the time the access token
            // and signed request each expire
            //console.log('getLoginStatus', success.status);

        		// Check if we have our user saved
        		var user = FacebookService.getUser('facebook');

        		if(!user.userID){
    					getFacebookProfileInfo(success.authResponse)
    					.then(function(profileInfo) {
    						// For the purpose of this example I will store user data on local storage
    						FacebookService.setUser({
    							authResponse: success.authResponse,
    							userID: profileInfo.id,
    							name: profileInfo.name,
    							email: profileInfo.email,
    							picture : "http://graph.facebook.com/" + success.authResponse.userID + "/picture?type=large"
    						});

    						$state.go('app.home');
    					}, function(fail){
    						// Fail get profile info
    						//console.log('profile info fail', fail);
    					});
    				}else{
    					$state.go('app.home');
    				}
          } else {
            // If (success.status === 'not_authorized') the user is logged in to Facebook,
    				// but has not authenticated your app
            // Else the person is not logged into Facebook,
    				// so we're not sure if they are logged into this app or not.

    				//console.log('getLoginStatus', success.status);

    				$ionicLoading.show({
              template: 'Logging in...'
            });

    				// Ask the permissions you need. You can learn more about
    				// FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
            facebookConnectPlugin.login(['email', 'public_profile','user_location','user_birthday'], fbLoginSuccess, fbLoginError);
          }
        });
      };
}])
.controller('ActivateCtrl', ['$scope', '$state', '$http', 'RegisterService', '$stateParams', 'PopupService','LoadingService','LocalStorageService', function ($scope, $state, $http, RegisterService, $stateParams, PopupService,LoadingService,LocalStorageService) {

    $scope.email = $stateParams.email;
    LocalStorageService.save('activateEmail',$stateParams.email);
    $scope.activateMe = function (email, activationCode) {
        if ($stateParams.email == undefined || activationCode == undefined || $stateParams.email == '' || activationCode == '') {
            PopupService.alert('Error','E100');
        } else {
            LoadingService.show();
            var activatePromise = RegisterService.activateUser($stateParams.email, activationCode);
            activatePromise.then(
                function (activation) {

                    if (activation.data.errorCode == 0) {
                        LoadingService.hide();
                        $state.go("tab.login", {
                            errorCode: 0,
                            statusMessage: 'Your account activated successfully'
                        });

                    }
                    else {
                        LoadingService.hide();
                        PopupService.alert('Error',activation.data.errorCode);
                    }
                },
                function (error) {
                    LoadingService.hide();
                    PopupService.alert('Technical Error',999);
                }
            );
        }

    };

}])
.controller('ForgotPasswordCtrl', ['$scope', '$state', 'ForgotPassService', 'PopupService','LoadingService', function ($scope, $state, ForgotPassService, PopupService,LoadingService) {

     $scope.forgotPassSend = function (email) {

         if (email == undefined) {
            PopupService.alert('Error','E101');
         } else {
            LoadingService.show();
             var forgotReqPromise = ForgotPassService.forgotRequest(email);
             forgotReqPromise.then(
                 function (response) {
                     if (response.data.errorCode == 0) {
                        LoadingService.hide();
                        PopupService.alert('Info','S100').then(function(res){
                            $state.go("forgotPassVerify", {
                                 email: email
                             });
                        });

                     } else if (response.data.errorCode == 112) {
                        LoadingService.hide();
                        PopupService.alert('Info',response.data.errorCode).then(function(res){
                            $state.go("forgotPassVerify", {
                                 email: email
                             });
                        });
                     } else {
                        LoadingService.hide();
                        PopupService.alert('Info',response.data.errorCode);
                     }
                 },
                 function (error) {
                    LoadingService.hide();
                    PopupService.alert('Technical Error',999);
                 }
             );
         }

    };
}])
.controller('ForgotVerifyCtrl', ['$scope', '$state', 'ForgotPassService', '$stateParams', 'PopupService','LoadingService', function ($scope, $state, ForgotPassService, $stateParams, PopupService,LoadingService) {
    $scope.email = $stateParams.email;
    $scope.forgotVerifySend = function (email, restoreCode) {
        LoadingService.show();

        if (email == undefined || restoreCode == undefined) {
            LoadingService.hide();
            PopupService.alert('Error','E102');
        } else {
            var forgotVerifyPromise = ForgotPassService.forgotVerify(email, restoreCode);
            forgotVerifyPromise.then(
                function (response) {
                    ////console.log(JSON.stringify(response));
                    if (response.data.errorCode == 0) {
                        LoadingService.hide();
                        PopupService.alert('Info','S101').then(function () {
                            $state.go("changePassword", {
                                email: email,
                                restoreCode: restoreCode
                            });
                        });
                    } else {
                        LoadingService.hide();
                        PopupService.alert('Error',response.data.errorCode);
                    }
                },
                function (error) {
                    LoadingService.hide();
                    PopupService.alert('Technical Error',999);
                }
            );
        }
    };

}])

.controller('ChangePasswordCtrl', ['$scope', '$state', 'ForgotPassService', '$stateParams',  'PopupService','LoadingService','ErrorCodeService', function ($scope, $state, ForgotPassService, $stateParams,  PopupService,LoadingService,ErrorCodeService) {
    $scope.email = $stateParams.email;
    $scope.restoreCode = $stateParams.restoreCode;
    $scope.changePassword = function (newPasword, confirmPasword) {

        if (newPasword == undefined || confirmPasword == undefined) {
            PopupService.alert('Error','E103');
        } else if (newPasword !== confirmPasword) {
            PopupService.alert('Error',101);
        } else if (newPasword.trim().length < 6 || newPasword.trim().length > 20) {
            PopupService.alert('Error','E104');
        } else {
            LoadingService.show();
            var changePassPromise = ForgotPassService.changePass($scope.email, newPasword, $scope.restoreCode);
            changePassPromise.then(
                function (response) {

                    if (response.data.errorCode == 0) {
                        LoadingService.hide();
                        PopupService.alert('Info','S102').then(function () {
                            $state.go("tab.login", {
                                errorCode: 0,
                                statusMessage: ErrorCodeService.getError('S102')
                            });
                        });

                    } else {
                        LoadingService.hide();
                        PopupService.alert('Error',response.data.errorCode);
                    }
                },
                function (error) {
                    LoadingService.hide();
                    PopupService.alert('Error',999);
                }
            );
        }
    };

}]);
