var hostPath = 'http://46.101.115.69:9096';
//var hostPath = 'http://localhost:9096';

var registerServiceURL = hostPath + '/register',
  uploadPictureURL = hostPath + '/uploadProfilePicture',
  uploadLicensePictureURL = hostPath + '/uploadLicensePicture',
  activateUserURL = hostPath + '/activateUser',
  loginUserURL = hostPath + '/login',
  forgotRequestURL = hostPath + '/forgotPasswordRequest',
  forgotVerifyURL = hostPath + '/forgotPasswordVerify',
  changePasswordURL = hostPath + '/changePassword',
  getProfileURL = hostPath + '/api/getUser',
  updateProfileURL = hostPath + '/api/updateProfile',
  checkUsernameURL = hostPath + '/checkUsernameTaken',
  createPakkageURL = hostPath + '/api/createPackage',
  uploadPackagePictureURL = hostPath + '/uploadPackagePicture',
  getPackagesURL = hostPath + '/api/getPackages',
  getPackageByIdURL = hostPath + '/api/getPackageById',
  updatePackageURL = hostPath + '/api/updatePackage',
  getStateURL = hostPath + '/getState',
  getAllStateURL = hostPath + '/getAllState',
  getAvailableHubsURL = hostPath + '/api/getAvailableHubs',
  getAvailableHubsWithCoordinatesURL = hostPath + '/api/getAvailableHubsWithCoordinates',
  changeUserPasswordURL = hostPath + '/api/changeUserPassword',
  scanQrCodeURL = hostPath + '/api/scanQrCode',
  scanQrCodeFromHubPageURL = hostPath + '/api/scanQrCodeFromHubPage',
  scanPakkageForHubAndDriverURL = hostPath + '/api/scanPakkageForHubAndDriver',
  getPackageByQrCodeIdURL = hostPath + '/api/getPackageByQrCodeId',
  getUserByIdURL = hostPath + '/api/getUserById',
  updateUserCurrentLocationURL=hostPath+ '/api/updateUserCurrentLocation',
  getAvailableHubsByDriverCurrentLocationURL = hostPath + '/api/getHubsByDriverCurrentLocation',
  googleGeocodingApiUrl = 'https://maps.googleapis.com/maps/api/geocode/json?',
  googleGeocodingApiKey = 'AIzaSyCCfYkorenMmME5xnyrap72br25T99R5RU'
  ;

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
      clear: function () {
        return localStorageService.remove('fullFilled', 'token', 'isAuthenticated', 'email', 'userType', 'profilePicture', 'userId', 'userCity', 'approve', 'packages', 'activateEmail');
        //return localStorageService.clearAll(); //-- This line delete also cities value and its make us trouble
      }
    }
  })
  .factory('RegisterService', function ($http, $cordovaFileTransfer, LocalStorageService) {
    return {
      registerUser: function (userType, newUser, profilePicture, fullFilled, openTime, licensePicture) {

        //** Aynı objenin clonu olduğu için city obje olarak gidiyordu
        console.log(newUser.city);
        if(newUser.city != undefined)
        {
          var tempCity = "";
          if (newUser.city.title != undefined)
            tempCity = newUser.city.title;
          else if(newUser.city.originalObject != undefined)
            tempCity = newUser.city.originalObject.title;
          newUser.city = tempCity;
          console.log(newUser.city);
        }
        else {
          newUser.city = '';
        }

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
                version: LocalStorageService.get('version')
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
                version: LocalStorageService.get('version')
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
                version: LocalStorageService.get('version')
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
            version: LocalStorageService.get('version')
          }
        };
        return $http(req);

      },
      getCurrentLocationByAddress: function (address1, address2, city, state) {
          var postUrl = googleGeocodingApiUrl + "address=";
          var userLocationStr = address1 + ", " + address2 + ", " + city + ", " + state;
          postUrl = postUrl + userLocationStr + "&key=" + googleGeocodingApiKey;

          console.log(postUrl);

          var req = {
            method: 'POST',
            url: postUrl,
            skipAuthorization: true,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: {}
          };
          return $http(req);
      },
      getCurrentLocationByCoordinate: function (lat, lng) {
        var postUrl = googleGeocodingApiUrl + "latlng=";
        var userLocationStr = lat + ", " + lng;
        postUrl = postUrl + userLocationStr + "&key=" + googleGeocodingApiKey;

        console.log(postUrl);

        var req = {
          method: 'POST',
          url: postUrl,
          skipAuthorization: true,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          data: {}
        };
        return $http(req);
      }
    }
  })
  .factory('LoginService', function ($http, LocalStorageService) {
    return {
      loginUser: function (email, password) {
        var req = {
          method: 'POST',
          url: loginUserURL,
          data: {
            email: email,
            password: password,
            version: LocalStorageService.get('version')
          }
        };
        return $http(req);
      }
    }
  })
  .factory('ForgotPassService', function ($http, LocalStorageService) {
    return {
      forgotRequest: function (email) {
        var req = {
          method: 'POST',
          url: forgotRequestURL,
          data: {
            email: email,
            version: LocalStorageService.get('version')
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
            version: LocalStorageService.get('version')
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
            version: LocalStorageService.get('version')
          }
        };
        return $http(req);
      }
    }
  })
  .factory('ProfileService', function ($http, LocalStorageService) {
    return {
      getUserProfile: function (email, token) {
        var req = {
          method: 'GET',
          url: getProfileURL + '/' + email + '/' + LocalStorageService.get('version') + '?token=' + token
        };
        return $http(req);
      },
      updateProfile: function (user, profilePicture, token, licensePicture) {
        user.profilePicture = profilePicture;
        user.licensePicture = licensePicture;

        var req = {
          method: 'POST',
          url: updateProfileURL,
          headers: {
            'x-access-token': token,
            'Content-Type': 'application/json; charset=utf-8'
          },
          data: {
            user: user,
            token: token,
            version: LocalStorageService.get('version')
          }
        };
        return $http(req);
      },
      checkUsername: function (username) {
        var req = {
          method: 'POST',
          url: checkUsernameURL,
          data: {
            username: username,
            version: LocalStorageService.get('version')
          }
        };
        return $http(req);
      },
      getUserById: function (id, token) {
        var req = {
          method: 'GET',
          url: getUserByIdURL + '/' + LocalStorageService.get('email') + '/' + id + '/' + LocalStorageService.get('version') + '?token=' + token
        };
        return $http(req);
      },
      updateUserCurrentLocation: function (user, currentLocation, token) {

        var req = {
          method: 'POST',
          url: updateUserCurrentLocationURL,
          headers: {
            'x-access-token': token,
            'Content-Type': 'application/json; charset=utf-8'
          },
          data: {
            user: user,
            token: token,
            version: LocalStorageService.get('version')
          }
        };
        return $http(req);
      },
    }
  })
  .factory('PackageService', function ($http, $cordovaFileTransfer, LocalStorageService) {
    return {
      createPakkage: function (package, image, status, token, email) {

        package.packageImage = image;
        package.status = status;
        var sender = {
            email: email
          },
          req = {
            method: 'POST',
            url: createPakkageURL,
            headers: {
              'x-access-token': token,
              'Content-Type': 'application/json; charset=utf-8'
            },
            data: {
              package: package,
              sender: sender,
              version: LocalStorageService.get('version')
            }
          };
        return $http(req);
      },
      updatePackage: function (package, image, status, token, email, packageId) {

        package.packageImage = image;
        package.status = status;

        var sender = {
            email: email
          },
          req = {
            method: 'POST',
            url: updatePackageURL,
            headers: {
              'x-access-token': token,
              'Content-Type': 'application/json; charset=utf-8'
            },
            data: {
              package: package,
              sender: sender,
              packageId: packageId,
              version: LocalStorageService.get('version')
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
      getPackages: function (userid, email, token) {

        var req = {
          method: 'GET',
          url: getPackagesURL + '/' + userid + '/' + email + '/' + LocalStorageService.get('version'),
          headers: {
            'x-access-token': LocalStorageService.get('token'),
            'Content-Type': 'application/json; charset=utf-8'
          },
          data: {}
        };

        return $http(req);
      },
      getPackageById: function (packageId, email, token) {
        var req = {
          method: 'GET',
          url: getPackageByIdURL + '/' + packageId + '/' + email + '/' + LocalStorageService.get('version'),
          headers: {
            'x-access-token': token,
            'Content-Type': 'application/json; charset=utf-8'
          },
          data: {}
        };
        return $http(req);
      },
      getPackageByQrCodeId: function (qrCodeId, email, token) {
        var req = {
          method: 'GET',
          url: getPackageByQrCodeIdURL + '/' + qrCodeId + '/' + email + '/' + LocalStorageService.get('version'),
          headers: {
            'x-access-token': token,
            'Content-Type': 'application/json; charset=utf-8'
          },
          data: {}
        };
        return $http(req);
      },
      scanQrCode: function (qrCodeNumber, newStatus, oldStatus, packageId) {
        var req = {
          method: 'POST',
          url: scanQrCodeURL,
          headers: {
            'x-access-token': LocalStorageService.get('token'),
            'Content-Type': 'application/json; charset=utf-8'
          },
          data: {
            email: LocalStorageService.get('email'),
            oldStatus: oldStatus,
            newStatus: newStatus,
            packageId: packageId,
            packageQRId: qrCodeNumber
          }
        };
        return $http(req);
      },
      scanQrCodeFromHubPage: function (qrCodeNumber, newStatus, oldStatus, packageId, hubId) {
        var req = {
          method: 'POST',
          url: scanQrCodeFromHubPageURL,
          headers: {
            'x-access-token': LocalStorageService.get('token'),
            'Content-Type': 'application/json; charset=utf-8'
          },
          data: {
            email: LocalStorageService.get('email'),
            oldStatus: oldStatus,
            newStatus: newStatus,
            packageId: packageId,
            packageQRId: qrCodeNumber,
            hubId: hubId
          }
        };
        return $http(req);
      },
      scanQrCodeForHubAndDrive: function (qrCodeNumber, newStatus, oldStatus, packageId, hubId) {
        var req = {
          method: 'POST',
          url: scanPakkageForHubAndDriverURL,
          headers: {
            'x-access-token': LocalStorageService.get('token'),
            'Content-Type': 'application/json; charset=utf-8'
          },
          data: {
            email: LocalStorageService.get('email'),
            oldStatus: oldStatus,
            newStatus: newStatus,
            packageId: packageId,
            packageQRId: qrCodeNumber,
            hubId: hubId
          }
        };
        return $http(req);
      }
    }
  })
  .factory('StateService', function ($http, LocalStorageService) {
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
  .factory('HubService', function ($http, LocalStorageService) {
    return {
      getAvailableHubs: function () {
        var req = {
          method: 'GET',
          url: getAvailableHubsURL + '/' + LocalStorageService.get('userCity') + '/' + LocalStorageService.get('email') + '/' + LocalStorageService.get('version') + '?token=' + LocalStorageService.get('token')
        };
        return $http(req);
      },
      getAvailableHubsBySenderLocation: function (city) {
        var req = {
          method: 'GET',
          url: getAvailableHubsWithCoordinatesURL + '/' + city+ '/' + LocalStorageService.get('email') + '/' + LocalStorageService.get('version') + '?token=' + LocalStorageService.get('token')
        };
        return $http(req);
      },
      getHubsByCurrentLocation: function (token,email,lat, lng) {


        var sender = {
          email: email
        },
        location=
        {
          lat:lat,
          lng:lng
        },
         req = {
          method: 'POST',
          url: getAvailableHubsByDriverCurrentLocationURL,
          headers: {
            'x-access-token': token,
            'Content-Type': 'application/json; charset=utf-8'
          },
          data: {
            sender:sender,
            location:location,
            version: LocalStorageService.get('version')
          }
        };
        return $http(req);
      }
    }
  })
  .factory('ChangePasswordService', function ($http, LocalStorageService) {
    return {
      changeUserPassword: function (newPassword) {
        var req = {
          method: 'POST',
          url: changeUserPasswordURL,
          headers: {
            'x-access-token': LocalStorageService.get('token'),
            'Content-Type': 'application/json; charset=utf-8'
          },
          data: {
            email: LocalStorageService.get('email'),
            password: newPassword,
            version: LocalStorageService.get('version')
          }
        };
        return $http(req);
      }
    }
  });
