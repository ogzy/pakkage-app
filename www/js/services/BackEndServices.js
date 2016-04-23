var registerServiceURL = 'http://46.101.115.69:9096/register',
    uploadPictureURL = 'http://46.101.115.69:9096/uploadProfilePicture',
    uploadLicensePictureURL = 'http://46.101.115.69:9096/uploadLicensePicture',
    activateUserURL = 'http://46.101.115.69:9096/activateUser',
    loginUserURL = 'http://46.101.115.69:9096/login',
    forgotRequestURL = 'http://46.101.115.69:9096/forgotPasswordRequest',
    forgotVerifyURL = 'http://46.101.115.69:9096/forgotPasswordVerify',
    changePasswordURL = 'http://46.101.115.69:9096/changePassword',
    getProfileURL = 'http://46.101.115.69:9096/api/getUser',
    updateProfileURL = 'http://46.101.115.69:9096/api/updateProfile',
    checkUsernameURL = 'http://46.101.115.69:9096/checkUsernameTaken',
    createPakkageURL = 'http://46.101.115.69:9096/api/createPackage',
    uploadPackagePictureURL = 'http://46.101.115.69:9096/uploadPackagePicture',
    getPackagesURL = 'http://46.101.115.69:9096/api/getPackages',
    getPackageByIdURL = 'http://46.101.115.69:9096/api/getPackageById',
    updatePackageURL = 'http://46.101.115.69:9096/api/updatePackage',
    getStateURL = 'http://46.101.115.69:9096/getState',
    getAllStateURL = 'http://46.101.115.69:9096/getAllState',
    getAvailableHubsURL = 'http://46.101.115.69:9096/api/getAvailableHubs',
    changeUserPasswordURL = 'http://46.101.115.69:9096/api/changeUserPassword';

angular.module('Pakkage.BackendServices', [])
    .factory('LocalStorageService', function ($http, localStorageService) {
        return {
            save: function (param, value) {
                localStorageService.set(param, value);
                return true;
            },
            get: function (param) {
                return localStorageService.get(param);
            },
            clear : function(){
                return localStorageService.remove('fullFilled','token','isAuthenticated','email','userType','profilePicture','userId','userCity','approve','packages','activateEmail');
                //return localStorageService.clearAll(); //-- This line delete also cities value and its make us trouble
            }
        }
    })
    .factory('RegisterService', function ($http, $cordovaFileTransfer,LocalStorageService) {
        return {
            registerUser: function (userType, newUser, profilePicture,fullFilled,openTime,licensePicture) {

                if(newUser.city != undefined)
                    newUser.city = newUser.city.title;
                if(licensePicture == undefined)
                  newUser.licensePicture = '';
                switch (userType) {
                case 'sender':

                    newUser.profilePicture = profilePicture;
                    newUser.userType = '0';
                    newUser.fullFilled = fullFilled;
                    var req = {
                        method: 'POST',
                        url: registerServiceURL,
                        data: {
                            user: newUser,
                            version : LocalStorageService.get('version')
                        }
                    };
                    return $http(req);

                    break;
                case 'driver':

                    newUser.licensePicture = licensePicture;
                    newUser.profilePicture = profilePicture;
                    newUser.userType = '1';
                    newUser.fullFilled = fullFilled;
                    var req = {
                        method: 'POST',
                        url: registerServiceURL,
                        data: {
                            user: newUser,
                            version : LocalStorageService.get('version')
                        }
                    };
                    return $http(req);
                    break;
                case 'hub':

                    newUser.profilePicture = profilePicture;
                    newUser.userType = '2';
                    newUser.fullFilled = fullFilled;
                    newUser.openTime = openTime;
                    var req = {
                        method: 'POST',
                        url: registerServiceURL,
                        data: {
                            user: newUser,
                            version : LocalStorageService.get('version')
                        }
                    };
                    return $http(req);
                    break;
                default:
                }
            },
            uploadPicture: function (filePath, email) {
                var options = {
                    fileName: email.split('@')[0] + '-' + filePath.substr(filePath.lastIndexOf('/') + 1)
                };


                return $cordovaFileTransfer.upload(uploadPictureURL, filePath, options);
            },
            uploadLicensePicture: function (filePath, email) {
                var options = {
                    fileName: 'license-' + email.split('@')[0] + '-' + filePath.substr(filePath.lastIndexOf('/') + 1)
                };

                return $cordovaFileTransfer.upload(uploadLicensePictureURL, filePath, options);
            },
            activateUser: function (email, activationCode) {
                var req = {
                    method: 'POST',
                    url: activateUserURL,
                    data: {
                        email: email,
                        activationCode: activationCode,
                        version : LocalStorageService.get('version')
                    }
                };
                return $http(req);

            }
        }
    })
    .factory('LoginService', function ($http,LocalStorageService) {
        return {
            loginUser: function (email, password) {
                var req = {
                    method: 'POST',
                    url: loginUserURL,
                    data: {
                        email: email,
                        password: password,
                        version : LocalStorageService.get('version')
                    }
                };
                return $http(req);
            }
        }
    })
    .factory('ForgotPassService', function ($http,LocalStorageService) {
        return {
            forgotRequest: function (email) {
                var req = {
                    method: 'POST',
                    url: forgotRequestURL,
                    data: {
                        email: email,
                        version : LocalStorageService.get('version')
                    }
                };
                return $http(req);
            },
            forgotVerify: function (email, restoreCode) {
                var req = {
                    method: 'POST',
                    url: forgotVerifyURL,
                    data: {
                        email: email,
                        passCode: restoreCode,
                        version : LocalStorageService.get('version')
                    }
                };
                return $http(req);
            },
            changePass: function (email, newPassword, restoreCode) {
                var req = {
                    method: 'POST',
                    url: changePasswordURL,
                    data: {
                        email: email,
                        passRestoreCode: restoreCode,
                        password: newPassword,
                        version : LocalStorageService.get('version')
                    }
                };
                return $http(req);
            }
        }
    })
    .factory('ProfileService', function ($http,LocalStorageService) {
        return {
            getUserProfile: function (email, token) {
                var req = {
                    method: 'GET',
                    url: getProfileURL + '/' + email + '/' + LocalStorageService.get('version') + '?token=' + token
                };
                return $http(req);
            },
            updateProfile: function (user, profilePicture,token,licensePicture) {
                user.profilePicture = profilePicture;
                user.licensePicture = licensePicture;

                var req = {
                    method: 'POST',
                    url: updateProfileURL,
                    headers  : {
                        'x-access-token' : token,
                        'Content-Type' : 'application/json; charset=utf-8'
                    },
                    data: {
                        user : user,
                        token : token,
                        version : LocalStorageService.get('version')
                    }
                };
                return $http(req);
            },
            checkUsername : function(username){
                var req = {
                  method: 'POST',
                  url: checkUsernameURL,
                  data: {
                    username : username,
                    version : LocalStorageService.get('version')
                  }
                };
                return $http(req);
            }
        }
    })
    .factory('PackageService', function ($http, $cordovaFileTransfer,LocalStorageService) {
        return {
                createPakkage: function (package,image,status,token,email) {

                    package.packageImage = image;
                    package.status = status;
                    var sender = { email : email },
                    req = {
                        method: 'POST',
                        url: createPakkageURL,
                         headers  : {
                                'x-access-token' : token,
                                'Content-Type' : 'application/json; charset=utf-8'
                            },
                        data: {
                            package: package,
                            sender : sender,
                            version : LocalStorageService.get('version')
                        }
                    };
                    return $http(req);
                },
                updatePackage: function (package,image,status,token,email,packageId) {

                    package.packageImage = image;
                    package.status = status;

                    var sender = { email : email },
                    req = {
                        method: 'POST',
                        url: updatePackageURL,
                         headers  : {
                                'x-access-token' : token,
                                'Content-Type' : 'application/json; charset=utf-8'
                            },
                        data: {
                            package: package,
                            sender : sender,
                            packageId : packageId,
                            version : LocalStorageService.get('version')
                        }
                    };
                    return $http(req);
                },
                uploadPicture: function (filePath, email) {
                    var options = {
                        fileName: email.split('@')[0] + '-' + Math.round((Math.pow(36, 10 + 1) - Math.random() * Math.pow(36, 10))).toString(36).slice(1).toUpperCase() + '-' + filePath.substr(filePath.lastIndexOf('/') + 1)
                    };
                    return $cordovaFileTransfer.upload(uploadPackagePictureURL, filePath, options);
                },
                getPackages : function(userid,email,token){
                    var req = {
                        method: 'GET',
                        url: getPackagesURL + '/' + userid + '/' + email + '/' + LocalStorageService.get('version'),
                         headers  : {
                                'x-access-token' : token,
                                'Content-Type' : 'application/json; charset=utf-8'
                            },
                        data: {
                        }
                    };
                    return $http(req);
                },
                getPackageById : function (packageId, email,token) {
                    var req = {
                        method: 'GET',
                        url: getPackageByIdURL + '/' + packageId + '/' + email + '/' + LocalStorageService.get('version'),
                         headers  : {
                                'x-access-token' : token,
                                'Content-Type' : 'application/json; charset=utf-8'
                            },
                        data: {
                        }
                    };
                    return $http(req);
                }
            }
    })
    .factory('StateService', function ($http,LocalStorageService) {
        return {
            getAllState: function (stateCode) {
                var req = {
                    method: 'GET',
                    url: getAllStateURL
                };
                return $http(req);
            }
        }
    })
    .factory('HubService',function($http,LocalStorageService){
        return {
            getAvailableHubs : function(){
                var req = {
                    method: 'GET',
                    url: getAvailableHubsURL + '/' + LocalStorageService.get('userCity') + '/' + LocalStorageService.get('email') + '/' + LocalStorageService.get('version') + '?token=' + LocalStorageService.get('token')
                };
                return $http(req);
            }
        }
    })
  .factory('ChangePasswordService',function($http,LocalStorageService){
    return {
      changeUserPassword : function(newPassword){
        var req = {
          method: 'POST',
          url: changeUserPasswordURL,
          headers  : {
            'x-access-token' : LocalStorageService.get('token'),
            'Content-Type' : 'application/json; charset=utf-8'
          },
          data: {
            email:  LocalStorageService.get('email'),
            password :  newPassword,
            version : LocalStorageService.get('version')
          }
        };
        return $http(req);
      }
    }
  });
