angular.module('Pakkage.RegisterWorkflowService', [])
  .factory('RegisterFlow', function(RegisterService,$http) {
    return {
      //--- Carefully fill parameters from controller
      registerUser: function(fullFilled, userType, newUser, profilePictureName, profileImageType, licensePictureName, licenseImageType, openTime) {
        var uploadedProfilePictureName = 'noPicture.jpg';
        var uploadedLicensePictureName = undefined;
        var profilePictureImagePath = undefined;
        var licensePictureImagePath = undefined;
        if (profilePictureName) {
          if (profileImageType == 0)
            profilePictureImagePath = profilePictureName;
          else
            profilePictureImagePath = cordova.file.dataDirectory + profilePictureName;
        }

        if (licensePictureName) {
          if (licenseImageType == 0)
            licensePictureImagePath = licensePictureName;
          else
            licensePictureImagePath = cordova.file.dataDirectory + licensePictureName;
        }
        //-- Check profile picture selected and upload it
        var uploadPicturePromise =  RegisterService.uploadPicture(profilePictureImagePath, newUser.email).then(function(imageUploadStatus) {
                if (imageUploadStatus.errorCode == 0) {
                  uploadedProfilePictureName = imageUploadStatus.imageName;
                };

              RegisterService.uploadLicensePicture(licensePictureImagePath, newUser.email).then(function(licenseUploadStatus) {

                      if (licenseUploadStatus.errorCode == 0) {
                        uploadedLicensePictureName = licenseUploadStatus.imageName;
                      };


                    //-- First get lat,long of user from Google API
                    RegisterService.getCurrentLocationByAddress(newUser.address1, newUser.address2, newUser.city, newUser.state).then(
                      function(response) {
                        if (response.status == 200) {
                          var resultLocation = {
                            "location": [response.data.results[0].geometry.location.lng,
                              response.data.results[0].geometry.location.lat
                            ]
                          }
                          //-- If success set user location from result
                          newUser.currentLocation = resultLocation;
                        }
                        //-- Send data to our API
                        RegisterService.registerUser(userType, newUser, uploadedProfilePictureName, fullFilled, openTime, uploadedLicensePictureName).then(
                          function(process) {
                            if (process.data.errorCode == 0) {
                              return {
                                status: 'OK',
                                errorCode: 0,
                                message: 'Succesfull'
                              };
                            } else {
                              return {
                                status: 'Error',
                                errorCode: process.data.errorCode,
                                message: process.data.message
                              };
                            }
                          },
                          function(errorPayload) {
                            //-- TODO: Log this error to Fabric
                            return {
                              status: 'Error',
                              errorCode: 999,
                              message: process.data.message
                            };
                          });
                      });
              });
          });
      }
    }
  });
