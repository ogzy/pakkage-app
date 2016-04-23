angular.module('Pakkage.RegisterController', [])
  .controller('RegisterCtrl', ['$scope', '$state', '$cordovaCamera', '$ionicActionSheet', '$cordovaFile', 'LoadingService', '$http', 'PopupService', 'RegisterService', '$cordovaFileTransfer', 'ErrorCodeService', '$interval', 'LocalStorageService', '$uibModal', 'moment', 'PhoneControlService', '$filter', function ($scope, $state, $cordovaCamera, $ionicActionSheet, $cordovaFile, LoadingService, $http, PopupService, RegisterService, $cordovaFileTransfer, ErrorCodeService, $interval, LocalStorageService, $uibModal, moment, PhoneControlService, $filter) {
    /*var loadingSecond = 1;
    LoadingService.show();
    $interval(function () {
      if (loadingSecond > 0) {
        loadingSecond--;
      } else {
        LoadingService.hide();
        $interval.cancel(this);
      }
    }, 1000);
    */



    $scope.newUser = {};
    $scope.showForAll = true;
    $scope.showForDriver = false;
    $scope.showForHub = false;
    $scope.debug = "";
    $scope.profilePicture = '';
    $scope.oneAtATime = true;
    $scope.imageName = '';
    $scope.imageType = 0;
    $scope.licenseImage = '';
    $scope.licenseImageName = '';
    $scope.licenseImageType = 0;

    $scope.usertypelist = [
      {
        text: "Sender",
        value: "sender"
      },
      {
        text: "Driver",
        value: "driver"
      },
      {
        text: "Hub",
        value: "hub"
      }
    ];
    $scope.newUser.dateOfBirth = new Date();
    $scope.newUser.licenseExpireDate = new Date();

    $scope.cities = LocalStorageService.get('cities')[0].cities;

    $scope.data = {
      clientSide: 'sender'
    };
    $scope.serverSideChange = function (item) {
      if (item.value == 'driver') {
        $scope.showForDriver = true;
        $scope.showForHub = false;
      }
      if (item.value == 'hub') {
        $scope.showForDriver = false;
        $scope.showForHub = true;
      }
      if (item.value == 'sender') {
        $scope.showForDriver = false;
        $scope.showForHub = false;
      }

    };


    $scope.driveToS = [
      {
        id: 1,
        value: ''
      },
      {
        id: 2,
        value: ''
      },
      {
        id: 3,
        value: ''
      }];

    $scope.removeTown = function () {
      $scope.driveToS.splice($scope.driveToS.length - 1, 1);
    };
    $scope.addTown = function () {
      if ($scope.driveToS.length < 5) {
        $scope.driveToS.push({
          id: $scope.driveToS.length + 1
        });
      }
    };

    $scope.daysOperation = [
      {
        id: 1,
        selected: false,
        value: 'Monday'
      },
      {
        id: 2,
        selected: false,
        value: 'Tuesday'
      },
      {
        id: 3,
        selected: false,
        value: 'Wednesday'
      },
      {
        id: 4,
        selected: false,
        value: 'Thursday'
      },
      {
        id: 5,
        selected: false,
        value: 'Friday'
      },
      {
        id: 6,
        selected: false,
        value: 'Saturday'
      },
      {
        id: 7,
        selected: false,
        value: 'Sunday'
      }];


    $scope.addMedia = function () {

      $scope.hideSheet = $ionicActionSheet.show({
        buttons: [
          {
            text: 'Take photo'
          },
          {
            text: 'Photo from library'
          }
        ],
        titleText: 'Add images',
        cancelText: 'Cancel',
        buttonClicked: function (index) {
          $scope.hideSheet();

          switch (index) {
            case 0:
              $scope.imageType = 0;
              var options = {
                quality: 75,
                destinationType: Camera.DestinationType.FILE_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,

                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
              };

              $cordovaCamera.getPicture(options).then(function (imageData) {

                $scope.profilePicture = imageData;
                $scope.imageName = imageData;
              }, function (err) {
                //$scope.debug += 'cameradan yüklenme error: ' + err + '\n';
              });
              break;
            case 1:
              $scope.imageType = 1;
              var options = {
                quality: 75,
                destinationType: Camera.DestinationType.FILE_URL,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,

                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
              };

            function makeid() {
              var text = '';
              var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

              for (var i = 0; i < 5; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
              }
              return text;
            };
              $cordovaCamera.getPicture(options).then(function (imageData) {

                var name = imageData.substr(imageData.lastIndexOf('/') + 1),
                  namePath = imageData.substr(0, imageData.lastIndexOf('/') + 1),
                  newName = makeid() + name;

                $cordovaFile.copyFile(namePath, name, cordova.file.dataDirectory, newName)
                  .then(function (info) {
                    $scope.imageName = newName;
                    $scope.profilePicture = cordova.file.dataDirectory + newName;

                  }, function (e) {
                    //$scope.debug += 'galeriden yüklenme error: ' + e + '\n';
                  });
                //-- $scope.profilePicture =  imageData;
              }, function (err) {
                //$scope.debug += 'galeriden yüklenme error: ' + err + '\n';
              });
              break;
            default:

              break;
          }
        }

      });

    };


    $scope.addLicensePhoto = function () {

      $scope.hideSheet = $ionicActionSheet.show({
        buttons: [
          {
            text: 'Take photo'
          },
          {
            text: 'Photo from library'
          }
        ],
        titleText: 'Add images',
        cancelText: 'Cancel',
        buttonClicked: function (index) {
          $scope.hideSheet();

          switch (index) {
            case 0:
              $scope.licenseImageType = 0;
              var options = {
                quality: 75,
                destinationType: Camera.DestinationType.FILE_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,

                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
              };

              $cordovaCamera.getPicture(options).then(function (imageData) {

                $scope.licenseImage = imageData;
                $scope.licenseImageName = imageData;
              }, function (err) {
                //$scope.debug += 'cameradan yüklenme error: ' + err + '\n';
              });
              break;
            case 1:
              $scope.licenseImageType = 1;
              var options = {
                quality: 75,
                destinationType: Camera.DestinationType.FILE_URL,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,

                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
              };

            function makeid() {
              var text = '';
              var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

              for (var i = 0; i < 5; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
              }
              return text;
            };
              $cordovaCamera.getPicture(options).then(function (imageData) {

                var name = imageData.substr(imageData.lastIndexOf('/') + 1),
                  namePath = imageData.substr(0, imageData.lastIndexOf('/') + 1),
                  newName = makeid() + name;

                $cordovaFile.copyFile(namePath, name, cordova.file.dataDirectory, newName)
                  .then(function (info) {
                    $scope.licenseImageName = newName;
                    $scope.licenseImage = cordova.file.dataDirectory + newName;

                  }, function (e) {
                    //$scope.debug += 'galeriden yüklenme error: ' + e + '\n';
                  });
                //-- $scope.profilePicture =  imageData;
              }, function (err) {
                //$scope.debug += 'galeriden yüklenme error: ' + err + '\n';
              });
              break;
            default:

              break;
          }
        }

      });

    };

    $scope.work724 = {checked: false};
    $scope.exceptWeekend = {checked: false};
    $scope.exceptWeekendfunc = function () {
      if ($scope.exceptWeekend.checked) {
        if ($scope.daysOperation[0].selected == true && $scope.daysOperation[1].selected == true && $scope.daysOperation[2].selected == true && $scope.daysOperation[3].selected == true && $scope.daysOperation[4].selected == true) {
          $scope.daysOperation[0].selected = false;
          $scope.daysOperation[1].selected = false;
          $scope.daysOperation[2].selected = false;
          $scope.daysOperation[3].selected = false;
          $scope.daysOperation[4].selected = false;
        } else {
          for (var day = 0; day < $scope.daysOperation.length; day++) {
            if (day > 4)
              $scope.daysOperation[day].selected = false;
            else
              $scope.daysOperation[day].selected = true;
          }
        }
      }
      else {
        for (var day = 0; day < $scope.daysOperation.length; day++) {
          $scope.daysOperation[day].selected = false;
        }
      }

    };


    $scope.work724func = function () {

      if ($scope.work724.checked) {
        $scope.newUser.openTime = '00:00 AM';
        $scope.newUser.closeTime = '11:59 PM';
      }
      else {
        $scope.newUser.openTime = undefined;
        $scope.newUser.closeTime = undefined;
      }

    };

    $scope.openOpenTimeModal = function () {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'openTimeModalContent.html',
        controller: 'OpenTimeModalInstanceCtrl',
        size: 'sm',
        resolve: {
          opentimepicker: function () {
            return $scope.opentimepicker;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.newUser.openTime = moment(selectedItem).format("LT");
      }, function () {
        //$log.info('Modal dismissed at: ' + new Date());
      });

    };

    $scope.openCloseTimeModal = function () {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'closeTimeModalContent.html',
        controller: 'OpenTimeModalInstanceCtrl',
        size: 'sm',
        resolve: {
          opentimepicker: function () {
            return $scope.closetimepicker;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.newUser.closeTime = moment(selectedItem).format("LT");
      }, function () {
        //$log.info('Modal dismissed at: ' + new Date());
      });
    };

    $scope.formatPhone = function (keyEvent, field) {
      if (field == 1) {
        $scope.newUser.phone = PhoneControlService.formatPhone(keyEvent, $scope.newUser.phone);
      }
      if (field == 2) {
        $scope.newUser.workPhone = PhoneControlService.formatPhone(keyEvent, $scope.newUser.workPhone);
      }
    };

    $scope.$watch('newUser.city', function (newValue, oldValue) {
      if (newValue != undefined) {
        if(newValue.originalObject){
          $scope.newUser.state = $filter('filter')(LocalStorageService.get('cities'), function (d) {
            return d.id === newValue.originalObject.id;
          })[0].code;
        }
      }

    });

    $scope.registerUser = function () {

      LoadingService.show();
      var fullFilled = false;



      switch ($scope.data.clientSide) {
        case 'driver':
          if ($scope.driveToS.length != 0 && $scope.newUser.licenseId != undefined && $scope.newUser.licenseIssueState != undefined && $scope.newUser.vehicle != undefined && $scope.newUser.vehicleType != undefined && $scope.newUser.vehicleInsuranceCompany != undefined && $scope.newUser.vehicleYear != undefined && $scope.newUser.name != undefined && $scope.newUser.phone != undefined && $scope.newUser.address1 != undefined && $scope.newUser.city != undefined && $scope.newUser.state != undefined && $scope.newUser.zipcode != undefined)
            fullFilled = false;
          else
            fullFilled = true;

          $scope.newUser.freqCities = $scope.driveToS;
          break;
        case 'hub':
          for (var i = 0; i < $scope.daysOperation.length; i++) {
            if ($scope.daysOperation[i].selected)
              fullFilled = true;
          };
          if ($scope.newUser.stateTaxId != undefined && $scope.newUser.contactPerson != undefined && $scope.newUser.workPhone != undefined && $scope.newUser.openTime != undefined && $scope.newUser.closeTime != undefined && $scope.newUser.name != undefined && $scope.newUser.phone != undefined && $scope.newUser.address1 != undefined && $scope.newUser.city != undefined && $scope.newUser.state != undefined && $scope.newUser.zipcode != undefined)
            fullFilled = true;
          else
            fullFilled = false;
          $scope.newUser.businessStore == undefined ? $scope.newUser.businessStore = false : $scope.newUser.businessStore = $scope.newUser.businessStore;
          $scope.newUser.locatedHw == undefined ? $scope.newUser.locatedHw = false : $scope.newUser.locatedHw = $scope.newUser.locatedHw;
          $scope.newUser.daysOfOperations = $scope.daysOperation;
          break;
        case 'sender':
          if ($scope.newUser.name != undefined && $scope.newUser.phone != undefined && $scope.newUser.address1 != undefined && $scope.newUser.city != undefined && $scope.newUser.state != undefined && $scope.newUser.zipcode != undefined)
          {
            fullFilled = true;
          }
          break;
        default:
          break;
      }
      if ($scope.newUser.username == undefined)
        $scope.newUser.username = '';
      var openTime = '';
      if ($scope.newUser.openTime != undefined) {
        if ($scope.newUser.openTime != '7/24' && $scope.newUser.closeTime != undefined)
          openTime = $scope.newUser.openTime + ';' + $scope.newUser.closeTime;
      }

      if ($scope.newUser.password == undefined || $scope.newUser.confirmPassword == undefined) {
        LoadingService.hide();
        PopupService.alert('Error', 'E116');
      }
      //-- Check email is valid
      else if (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($scope.newUser.email) != true) {
        LoadingService.hide();
        PopupService.alert('Error', 'E111');
      }
      else if ((/^[0-9A-Za-z_.]+$/.test($scope.newUser.username) != true && $scope.newUser.username != undefined && $scope.newUser.username != '') || (($scope.newUser.username.length < 3 || $scope.newUser.username.length > 20 ) && $scope.newUser.username != '')) {
        LoadingService.hide();
        PopupService.alert('Error', 'E117');
      }
      else if ((/(^\d{5}$)|(^\d{5}-\d{4}$)/.test($scope.newUser.zipcode) != true && $scope.newUser.zipcode != undefined ) && ($scope.newUser.zipcode != '')) {
        LoadingService.hide();
        PopupService.alert('Oopps !', 'E106');
      }
      else if ((/(^\d{3}-\d{3}-\d{4}$)|(^\d{3}-\d{4}$)/.test($scope.newUser.phone) != true && $scope.newUser.phone != undefined ) && ($scope.newUser.phone != '')) {
        LoadingService.hide();
        PopupService.alert('Oopps !', 'E105');
      }
      else if ((/(^\d{3}-\d{3}-\d{4}$)|(^\d{3}-\d{4}$)/.test($scope.newUser.workPhone) != true && $scope.newUser.workPhone != undefined ) && ($scope.newUser.workPhone != '')) {
        LoadingService.hide();
        PopupService.alert('Oopps !', 'E107');
      }
      //-- If user didn't fill all field, check and decide to requests
      //-- User didn't choose picture so we have accept this issue
      else if ($scope.newUser.name == undefined || $scope.newUser.phone == undefined || $scope.newUser.address1 == undefined || $scope.newUser.city == undefined || $scope.newUser.state == undefined || $scope.newUser.zipcode == undefined) {

        if ($scope.newUser.password != $scope.newUser.confirmPassword) {
          LoadingService.hide();
          PopupService.alert('Error', 101);
        } else if ($scope.newUser.password.trim().length < 6 || $scope.newUser.password.trim().length > 20) {
          LoadingService.hide();
          PopupService.alert('Error', 'E104');
        } else {
          LoadingService.hide();
          PopupService.confirm('Warning', 'C100').then(function (buttonIndex) {


            if (buttonIndex == 1) {
              LoadingService.show();

              if($scope.imageName == '' && $scope.licenseImageName == '')
              {
                var registerPromise = RegisterService.registerUser($scope.data.clientSide, $scope.newUser, 'noPicture.jpg', fullFilled, openTime);

                registerPromise.then(
                  function (response) {
                    LoadingService.hide();


                    if (response.data.errorCode == 0) {

                      $state.go('activate', {
                        email: $scope.newUser.email
                      });

                    } else {
                      LoadingService.hide();
                      PopupService.alert('Error', response.data.errorCode);
                    }
                  },
                  function (errorPayload) {
                    LoadingService.hide();
                    PopupService.alert('Error', 999);
                  });
              }
              else if ($scope.imageName != '' && $scope.licenseImageName == '')
              {
                if ($scope.imageType == 0)
                  var imagePath = $scope.imageName;
                else
                  var imagePath = cordova.file.dataDirectory + $scope.imageName;

                var uploadPromise = RegisterService.uploadPicture(imagePath, $scope.newUser.email);
                uploadPromise.then(
                  function (upload) {
                    var json = JSON.stringify(eval("(" + upload.response + ")"));
                    json = JSON.parse(json);
                    if (json.status == 'OK') {

                      var registerPromise = RegisterService.registerUser($scope.data.clientSide, $scope.newUser, json.imageName, fullFilled, openTime);
                      registerPromise.then(
                        function (process) {
                          LoadingService.hide();
                          if (process.data.errorCode == 0) {
                            $state.go('activate', {
                              email: $scope.newUser.email
                            });
                          } else {
                            PopupService.alert('Error', process.data.errorCode);
                          }
                        },
                        function (errorPayload) {
                          LoadingService.hide();
                          PopupService.alert('Error', 999);
                        });
                    } else {
                      LoadingService.hide();
                      PopupService.alert('Error', 999);
                    }
                  },
                  function (errorPayload) {
                    LoadingService.hide();
                    PopupService.alert('Error', 999);
                  });
              }
              else if ($scope.imageName == '' && $scope.licenseImageName != '')
              {
                if ($scope.licenseImageType == 0)
                  var imagePath = $scope.licenseImageName;
                else
                  var imagePath = cordova.file.dataDirectory + $scope.licenseImageName;

                var uploadPromise = RegisterService.uploadLicensePicture(imagePath, $scope.newUser.email);
                uploadPromise.then(
                  function (upload) {
                    var json = JSON.stringify(eval("(" + upload.response + ")"));
                    json = JSON.parse(json);
                    if (json.status == 'OK') {

                      var registerPromise = RegisterService.registerUser($scope.data.clientSide, $scope.newUser, 'noPicture.jpg', fullFilled, openTime,json.imageName);
                      registerPromise.then(
                        function (process) {
                          LoadingService.hide();
                          if (process.data.errorCode == 0) {
                            $state.go('activate', {
                              email: $scope.newUser.email
                            });
                          } else {
                            PopupService.alert('Error', process.data.errorCode);
                          }
                        },
                        function (errorPayload) {
                          LoadingService.hide();
                          PopupService.alert('Error', 999);
                        });
                    } else {
                      LoadingService.hide();
                      PopupService.alert('Error', 999);
                    }
                  },
                  function (errorPayload) {
                    LoadingService.hide();
                    PopupService.alert('Error', 999);
                  });
              }
              //-- Both of them (profile and license images) are not empty.Upload first profile picture then upload license picture
              else
              {
                if ($scope.licenseImageType == 0)
                  var imagePath = $scope.licenseImageName;
                else
                  var imagePath = cordova.file.dataDirectory + $scope.licenseImageName;

                if ($scope.imageType == 0)
                  var imagePath = $scope.imageName;
                else
                  var imagePath = cordova.file.dataDirectory + $scope.imageName;

                var uploadPromise = RegisterService.uploadPicture(imagePath, $scope.newUser.email);
                uploadPromise.then(
                  function (upload) {
                    var jsonProfile = JSON.stringify(eval("(" + upload.response + ")"));
                    jsonProfile = JSON.parse(jsonProfile);
                    if (jsonProfile.status == 'OK') {
                      //-- Profile picture uploaded successfully.So start upload license picture
                      var uploadPromiseLicense = RegisterService.uploadLicensePicture(imagePath, $scope.newUser.email);
                      uploadPromiseLicense.then(
                        function (uploadLincese) {
                          var json = JSON.stringify(eval("(" + uploadLincese.response + ")"));
                          json = JSON.parse(json);
                          if (json.status == 'OK') {

                            var registerPromise = RegisterService.registerUser($scope.data.clientSide, $scope.newUser, jsonProfile.imageName, fullFilled, openTime,json.imageName);
                            registerPromise.then(
                              function (process) {
                                LoadingService.hide();
                                if (process.data.errorCode == 0) {
                                  $state.go('activate', {
                                    email: $scope.newUser.email
                                  });
                                } else {
                                  PopupService.alert('Error', process.data.errorCode);
                                }
                              },
                              function (errorPayload) {
                                LoadingService.hide();
                                PopupService.alert('Error', 999);
                              });
                          } else {
                            LoadingService.hide();
                            PopupService.alert('Error', 999);
                          }
                        },
                        function (errorPayload) {
                          LoadingService.hide();
                          PopupService.alert('Error', 999);
                        });
                    } else {
                      LoadingService.hide();
                      PopupService.alert('Error', 999);
                    }
                  },
                  function (errorPayload) {
                    LoadingService.hide();
                    PopupService.alert('Error', 999);
                  });

              }
            }
          });
        }
      } else {

        if($scope.imageName == '' && $scope.licenseImageName == '')
        {
          //-- Just call register service without check image
          var registerPromise = RegisterService.registerUser($scope.data.clientSide, $scope.newUser, 'noPicture.jpg', fullFilled, openTime);
          registerPromise.then(
            function (process) {
              LoadingService.hide();
              if (process.data.errorCode == 0) {

                $state.go('activate', {
                  email: $scope.newUser.email
                });


              } else {
                PopupService.alert('Error', process.data.errorCode);
              }
            },
            function (errorPayload) {
              LoadingService.hide();

              PopupService.alert('Error', 999);
            });
        }
        else if ($scope.imageName != '' && $scope.licenseImageName == '')
        {
          if ($scope.imageType == 0)
            var imagePath = $scope.imageName;
          else
            var imagePath = cordova.file.dataDirectory + $scope.imageName;

          var uploadPromise = RegisterService.uploadPicture(imagePath, $scope.newUser.email);
          uploadPromise.then(
            function (upload) {
              var json = JSON.stringify(eval("(" + upload.response + ")"));
              json = JSON.parse(json);
              if (json.status == 'OK') {

                var registerPromise = RegisterService.registerUser($scope.data.clientSide, $scope.newUser, json.imageName, fullFilled, openTime);
                registerPromise.then(
                  function (process) {
                    LoadingService.hide();
                    if (process.data.errorCode == 0) {

                      $state.go('activate', {
                        email: $scope.newUser.email
                      });


                    } else {
                      PopupService.alert('Error', process.data.errorCode);
                    }
                  },
                  function (errorPayload) {
                    LoadingService.hide();

                    PopupService.alert('Error', 999);
                  });
              } else {
                LoadingService.hide();
                PopupService.alert('Error', 999);
              }
            },
            function (errorPayload) {
              LoadingService.hide();
              PopupService.alert('Error', 999);
            });

        }
        else if ($scope.imageName == '' && $scope.licenseImageName != '')
        {
          if ($scope.licenseImageType == 0)
            var imagePath = $scope.licenseImageName;
          else
            var imagePath = cordova.file.dataDirectory + $scope.licenseImageName;

          var uploadPromise = RegisterService.uploadLicensePicture(imagePath, $scope.newUser.email);
          uploadPromise.then(
            function (upload) {
              var json = JSON.stringify(eval("(" + upload.response + ")"));
              json = JSON.parse(json);
              if (json.status == 'OK') {

                var registerPromise = RegisterService.registerUser($scope.data.clientSide, $scope.newUser, 'noPicture.jpg', fullFilled, openTime,json.imageName);
                registerPromise.then(
                  function (process) {
                    LoadingService.hide();
                    if (process.data.errorCode == 0) {
                      $state.go('activate', {
                        email: $scope.newUser.email
                      });
                    } else {
                      PopupService.alert('Error', process.data.errorCode);
                    }
                  },
                  function (errorPayload) {
                    LoadingService.hide();
                    PopupService.alert('Error', 999);
                  });
              } else {
                LoadingService.hide();
                PopupService.alert('Error', 999);
              }
            },
            function (errorPayload) {
              LoadingService.hide();
              PopupService.alert('Error', 999);
            });
        }
        //-- Both of them (profile and license images) are not empty.Upload first profile picture then upload license picture
        else
        {
          if ($scope.licenseImageType == 0)
            var imagePath = $scope.licenseImageName;
          else
            var imagePath = cordova.file.dataDirectory + $scope.licenseImageName;

          if ($scope.imageType == 0)
            var imagePath = $scope.imageName;
          else
            var imagePath = cordova.file.dataDirectory + $scope.imageName;

          var uploadPromise = RegisterService.uploadPicture(imagePath, $scope.newUser.email);
          uploadPromise.then(
            function (upload) {
              var jsonProfile = JSON.stringify(eval("(" + upload.response + ")"));
              jsonProfile = JSON.parse(jsonProfile);
              if (jsonProfile.status == 'OK') {
                //-- Profile picture uploaded successfully.So start upload license picture
                var uploadPromiseLicense = RegisterService.uploadLicensePicture(imagePath, $scope.newUser.email);
                uploadPromiseLicense.then(
                  function (uploadLincese) {
                    var json = JSON.stringify(eval("(" + uploadLincese.response + ")"));
                    json = JSON.parse(json);
                    if (json.status == 'OK') {

                      var registerPromise = RegisterService.registerUser($scope.data.clientSide, $scope.newUser, jsonProfile.imageName, fullFilled, openTime,json.imageName);
                      registerPromise.then(
                        function (process) {
                          LoadingService.hide();
                          if (process.data.errorCode == 0) {
                            $state.go('activate', {
                              email: $scope.newUser.email
                            });
                          } else {
                            PopupService.alert('Error', process.data.errorCode);
                          }
                        },
                        function (errorPayload) {
                          LoadingService.hide();
                          PopupService.alert('Error', 999);
                        });
                    } else {
                      LoadingService.hide();
                      PopupService.alert('Error', 999);
                    }
                  },
                  function (errorPayload) {
                    LoadingService.hide();
                    PopupService.alert('Error', 999);
                  });
              } else {
                LoadingService.hide();
                PopupService.alert('Error', 999);
              }
            },
            function (errorPayload) {
              LoadingService.hide();
              PopupService.alert('Error', 999);
            });

        }
      }

    };

  }])
  .controller('OpenTimeModalInstanceCtrl', function ($scope, $uibModalInstance, opentimepicker) {
  $scope.ok = function (deneme) {
    $uibModalInstance.close(deneme);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
