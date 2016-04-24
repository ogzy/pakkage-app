angular.module('Pakkage.ProfileController', [])
  .controller('ProfileCtrl', ['$scope', 'LocalStorageService', '$state', 'ProfileService', 'LoadingService', 'RegisterService', '$cordovaCamera', '$ionicActionSheet', '$cordovaFile', '$cordovaFileTransfer', 'PopupService', '$rootScope','PhoneControlService','$filter', 'RegisterService','$uibModal','$ionicPopup','LogService', function ($scope, LocalStorageService, $state, ProfileService, LoadingService, RegisterService, $cordovaCamera, $ionicActionSheet, $cordovaFile, $cordovaFileTransfer, PopupService,  $rootScope,PhoneControlService,$filter,RegisterService,$uibModal,$ionicPopup,LogService) {

    if (LocalStorageService.get('isAuthenticated') != true) {
      $state.go("tab.login");
    }

    var saltProfilePicture = '',staticUsername = '',saltLicensePicture = '';

    $scope.scopeSaltLicensePicture = '';
    $scope.showForAll = true;
    $scope.showForSender = false;
    $scope.showForDriver = false;
    $scope.showForHub = false;
    $scope.usernameVerified = true;
    $scope.oneAtATime = true;
    $scope.imageName = '';
    $scope.imageType = 0;
    $scope.initialCity = '';
    $scope.work724 = {checked: false};

    if (LocalStorageService.get('userType') == 'Driver') {
      $scope.showForDriver = true;
      $scope.showForHub = false;
    }
    if (LocalStorageService.get('userType') == 'Hub') {
      $scope.showForDriver = false;
      $scope.showForHub = true;
    }
    if (LocalStorageService.get('userType') == 'Sender') {
      $scope.showForDriver = false;
      $scope.showForHub = false;
      $scope.showForSender = true;
    }

    $scope.cities = LocalStorageService.get('cities')[0].cities;

    $scope.refreshProfile = function(){
      LoadingService.show();

      var profilePromise = ProfileService.getUserProfile(LocalStorageService.get('email'), LocalStorageService.get('token'));
      profilePromise.then(
        function (profile) {

          if (profile.data.errorCode == 0) {

            $scope.newUser = profile.data.user;
            if (profile.data.user.name == ' ')
              $scope.newUser.name = '';


            $scope.profilePicture = $rootScope.profileThumbnailURL + profile.data.user.profilePicture;
            saltProfilePicture = profile.data.user.profilePicture;
            if(profile.data.user.type[0].name == 'Driver')
            {
              $scope.licenseImage = $rootScope.licenseThumbnailURL + profile.data.user.licensePicture;
              saltLicensePicture = profile.data.user.licensePicture;
              $scope.scopeSaltLicensePicture = profile.data.user.licensePicture;
            }


            staticUsername = profile.data.user.username;

            if (profile.data.user.address[0] != null) {
              $scope.newUser.address1 = profile.data.user.address[0].address1;
              $scope.newUser.address2 = profile.data.user.address[0].address2;
              $scope.initialCity = profile.data.user.address[0].city.title;
              $scope.newUser.state = profile.data.user.address[0].state;
              $scope.newUser.zipcode = profile.data.user.address[0].zipCode;
            }
            $scope.newUser.stateTaxId = profile.data.user.stateTaxID;
            if (profile.data.user.dateOfBirth == null || profile.data.user.dateOfBirth == '')
              profile.data.user.dateOfBirth = new Date();

            $scope.newUser.dateOfBirth = profile.data.user.dateOfBirth;


            if (profile.data.user.licenseExpireDate == null || profile.data.user.licenseExpireDate == '')
              profile.data.user.licenseExpireDate = new Date();

            $scope.newUser.licenceExpireDate = profile.data.user.licenseExpireDate;

            for (var i = 0; i < profile.data.user.daysOfOperations.length; i++) {
              if (profile.data.user.daysOfOperations[i].value == "Monday")
                $scope.daysOperation[0].selected = true;
              if (profile.data.user.daysOfOperations[i].value == "Tuesday")
                $scope.daysOperation[1].selected = true;
              if (profile.data.user.daysOfOperations[i].value == "Wednesday")
                $scope.daysOperation[2].selected = true;
              if (profile.data.user.daysOfOperations[i].value == "Thursday")
                $scope.daysOperation[3].selected = true;
              if (profile.data.user.daysOfOperations[i].value == "Friday")
                $scope.daysOperation[4].selected = true;
              if (profile.data.user.daysOfOperations[i].value == "Saturday")
                $scope.daysOperation[5].selected = true;
              if (profile.data.user.daysOfOperations[i].value == "Sunday")
                $scope.daysOperation[6].selected = true;

            };
            if (profile.data.user.freqCities != undefined || profile.data.user.freqCities != null) {

              for (var i = 0; i < profile.data.user.freqCities.length; i++) {
                $scope.driveToS[i].value = profile.data.user.freqCities[i].value;
              };
            }
            if (profile.data.user.licenseID != null || profile.data.user.licenseID != undefined)
              $scope.newUser.licenseId = parseInt(profile.data.user.licenseID);
            else
              $scope.newUser.licenseId = '';

            if (LocalStorageService.get('userType') == 'Driver') {
              $scope.showForDriver = true;
              $scope.showForHub = false;
            }
            if (LocalStorageService.get('userType') == 'Hub') {
              $scope.showForDriver = false;
              $scope.showForHub = true;
            }
            if (LocalStorageService.get('userType') == 'Sender') {
              $scope.showForDriver = false;
              $scope.showForHub = false;
              $scope.showForSender = true;
            }
            $scope.newUser.vehicleYear = profile.data.user.vehicleYear;
            if(profile.data.user.openTime != undefined)
            {
              $scope.newUser.opentimeSplit = profile.data.user.openTime.split(';')[0];
              $scope.newUser.closeTime = profile.data.user.openTime.split(';')[1];
            }
            $scope.newUser.businessStore = profile.data.user.businessStore;
            $scope.newUser.locatedHw = profile.data.user.locatedHw;
            $scope.$broadcast('scroll.refreshComplete');
            LoadingService.hide();
          } else {
            LoadingService.hide();
            PopupService.alert('Error',profile.data.errorCode);
          }
        },
        function (error) {
          LoadingService.hide();
          PopupService.alert('Technical Error',999);

        }
      );
    };

    $rootScope.$watch('cachedUser', function (newValue, oldValue) {
      LoadingService.show();

      if(newValue != undefined)
      {
        $scope.newUser = $rootScope.cachedUser;
        $scope.driveToS = [];
        $scope.profilePicture = $rootScope.profileThumbnailURL + $rootScope.cachedUser.profilePicture;
        saltProfilePicture = $rootScope.cachedUser.profilePicture;

        if($rootScope.cachedUser.type[0].name == 'Driver')
        {
          $scope.licenseImage = $rootScope.licenseThumbnailURL + $rootScope.cachedUser.licensePicture;
          saltLicensePicture = $rootScope.cachedUser.licensePicture;
          $scope.scopeSaltLicensePicture = $rootScope.cachedUser.licensePicture;
        }
        staticUsername = $rootScope.cachedUser.username;

        if ($rootScope.cachedUser.address[0] != null) {
          LogService.visibleLog('Cached user init city' + JSON.stringify($rootScope.cachedUser.address[0].city));
          $scope.newUser.address1 = $rootScope.cachedUser.address[0].address1;
          $scope.newUser.address2 = $rootScope.cachedUser.address[0].address2;
          $scope.initialCity = $rootScope.cachedUser.address[0].city;
          $scope.newUser.state = $rootScope.cachedUser.address[0].state;
          $scope.newUser.zipcode = $rootScope.cachedUser.address[0].zipCode;
        }
        $scope.newUser.stateTaxId = $rootScope.cachedUser.stateTaxID;
        if ($rootScope.cachedUser.dateOfBirth == null || $rootScope.cachedUser.dateOfBirth == '')
          $rootScope.cachedUser.dateOfBirth = new Date();

        $scope.newUser.dateOfBirth = new Date($rootScope.cachedUser.dateOfBirth);

        if ($rootScope.cachedUser.licenseExpireDate == null || $rootScope.cachedUser.licenseExpireDate == '')
          $rootScope.cachedUser.licenseExpireDate = new Date();

        $scope.newUser.licenceExpireDate = new Date($rootScope.cachedUser.licenseExpireDate);

        for (var i = 0; i < $rootScope.cachedUser.daysOfOperations.length; i++) {
          if ($rootScope.cachedUser.daysOfOperations[i].value == "Monday")
            $scope.daysOperation[0].selected = true;
          if ($rootScope.cachedUser.daysOfOperations[i].value == "Tuesday")
            $scope.daysOperation[1].selected = true;
          if ($rootScope.cachedUser.daysOfOperations[i].value == "Wednesday")
            $scope.daysOperation[2].selected = true;
          if ($rootScope.cachedUser.daysOfOperations[i].value == "Thursday")
            $scope.daysOperation[3].selected = true;
          if ($rootScope.cachedUser.daysOfOperations[i].value == "Friday")
            $scope.daysOperation[4].selected = true;
          if ($rootScope.cachedUser.daysOfOperations[i].value == "Saturday")
            $scope.daysOperation[5].selected = true;
          if ($rootScope.cachedUser.daysOfOperations[i].value == "Sunday")
            $scope.daysOperation[6].selected = true;

        };
        LogService.visibleLog(JSON.stringify($rootScope.cachedUser.freqCities));
        if ($rootScope.cachedUser.freqCities != undefined || $rootScope.cachedUser.freqCities != null) {
          for (var i = 0; i < $rootScope.cachedUser.freqCities.length; i++) {
              $scope.driveToS.push({ id: $rootScope.cachedUser.freqCities[i].key,initialDriveTo : $rootScope.cachedUser.freqCities[i].value });
              LogService.visibleLog('Drive to' + JSON.stringify($scope.driveToS[i]));
          };
        }
        if($rootScope.cachedUser.freqCities.length == 0)
        {
            LogService.visibleLog('Drive to gelmedi boş eklendi');
            $scope.driveToS.push({ id: 1,value : '' });
        }
        if ($rootScope.cachedUser.licenseID != null || $rootScope.cachedUser.licenseID != undefined)
          $scope.newUser.licenseId = parseInt($rootScope.cachedUser.licenseID);
        else
          $scope.newUser.licenseId = '';


        if (LocalStorageService.get('userType') == 'Driver') {
          $scope.showForDriver = true;
          $scope.showForHub = false;
        }
        if (LocalStorageService.get('userType') == 'Hub') {
          $scope.showForDriver = false;
          $scope.showForHub = true;
        }
        if (LocalStorageService.get('userType') == 'Sender') {
          $scope.showForDriver = false;
          $scope.showForHub = false;
          $scope.showForSender = true;
        }
        $scope.newUser.vehicleYear = $rootScope.cachedUser.vehicleYear;
        if($rootScope.cachedUser.openTime != undefined)
        {

          $scope.newUser.opentimeSplit = $rootScope.cachedUser.openTime.split(';')[0];
          $scope.newUser.closeTime = $rootScope.cachedUser.openTime.split(';')[1];
          LogService.visibleLog('$scope.newUser.opentimeSplit : ' + JSON.stringify($scope.newUser.opentimeSplit));
        }
        $scope.newUser.businessStore = $rootScope.cachedUser.businessStore;
        $scope.newUser.locatedHw = $rootScope.cachedUser.locatedHw;
        LoadingService.hide();
      }

    });

    $scope.$watch('newUser.city',function(newValue, oldValue){

      if(newValue != undefined && newValue != $scope.initialCity)
      {
        $scope.newUser.state = $filter('filter')(LocalStorageService.get('cities'), function (d) { return d.id === newValue.originalObject.id; })[0].code;
      }
    });

    $scope.newUser = $rootScope.cachedUser;

    $scope.removeTown = function () {
      if ($scope.driveToS.length > 1)
          $scope.driveToS.splice($scope.driveToS.length - 1, 1);
    };

    $scope.addTown = function () {
      $scope.driveToS.push({
        id: $scope.driveToS.length + 1,
        value : ''
      });
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

    $scope.showProfilePicture = function () {
      $ionicPopup.alert({
        title: 'Your Profile Picture',
        template: '<img style="width:100%" src="' + $scope.profilePicture + '" />'
      });

    };

    $scope.exceptWeekend = function (exceptWeekendValue) {

      if (exceptWeekendValue == true) {
        for (var day = 0; day < $scope.daysOperation.length; day++) {
          if (day > 4)
            $scope.daysOperation[day].selected = false;
          else
            $scope.daysOperation[day].selected = true;
        }
      } else {

        $scope.daysOperation[0].selected = false;
        $scope.daysOperation[1].selected = false;
        $scope.daysOperation[2].selected = false;
        $scope.daysOperation[3].selected = false;
        $scope.daysOperation[4].selected = false;
      }


    };

    $scope.$watch('work724.checked',function(newVal,oldVal){
      if ($scope.work724.checked) {
        $scope.newUser.opentimeSplit = '00:00 AM';
        $scope.newUser.closeTime = '11:59 PM';
      }
      else {
        if($rootScope.cachedUser)
        {
          $scope.newUser.opentimeSplit = $rootScope.cachedUser.openTime.split(';')[0];
          $scope.newUser.closeTime = $rootScope.cachedUser.openTime.split(';')[1];
        }
      }
    });

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
        $scope.newUser.opentimeSplit = moment(selectedItem).format("LT");
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

    $scope.formatPhone = function(keyEvent,field){
      if(field == 1)
      {
        $scope.newUser.phone = PhoneControlService.formatPhone(keyEvent,$scope.newUser.phone);
      }
      if(field == 2)
      {
        $scope.newUser.workPhone = PhoneControlService.formatPhone(keyEvent,$scope.newUser.workPhone);
      }
    };

    $scope.updateProfileButton = function () {
      LoadingService.show();

      var fullFilled = false;
      LogService.visibleLog('City ne olarak gidecek : ' + JSON.stringify($scope.newUser.city));
      LogService.visibleLog('update button initial city : ' + JSON.stringify($scope.initialCity));
      switch (LocalStorageService.get('userType')) {
        case 'Driver':
          if ($scope.driveToS.length != 0 && $scope.newUser.licenseId != undefined && $scope.newUser.licenseIssueState != undefined && $scope.newUser.vehicle != undefined && $scope.newUser.vehicleType != undefined && $scope.newUser.vehicleInsuranceCompany != undefined && $scope.newUser.vehicleYear != undefined && $scope.newUser.name != undefined && $scope.newUser.phone != undefined && $scope.newUser.address1 != undefined && $scope.newUser.city != undefined && $scope.newUser.state != undefined && $scope.newUser.zipcode != undefined)
            fullFilled = false;
          else
            fullFilled = true;
          $scope.newUser.freqCities = [];
          for(var i = 0;i < $scope.driveToS.length;i++)
          {
            $scope.newUser.freqCities.push({key : i + 1,value : $scope.driveToS[i].value.title});
            LogService.visibleLog('For içindeki drivetovalue : ' + JSON.stringify($scope.driveToS[i]));
          }
          LogService.visibleLog('Freq city ne : ' + JSON.stringify($scope.newUser.freqCities));
          break;
        case 'Hub':
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
        case 'Sender':
          LogService.visibleLog(JSON.stringify('fullfilled casei sender için'));
          if ($scope.newUser.name != undefined && $scope.newUser.phone != undefined && $scope.newUser.address1 != undefined && $scope.newUser.city != undefined && $scope.newUser.state != undefined && $scope.newUser.zipcode != undefined)
          {
            LogService.visibleLog(JSON.stringify('fullfilled true setlendi'));
            fullFilled = true;
          }
          break;
        default:
          break;
      }

      $scope.newUser.userType = LocalStorageService.get('userType');
      $scope.newUser.fullFilled = fullFilled;
      LocalStorageService.save('fullFilled',fullFilled);
      if($scope.licenseImageName == undefined)
          $scope.licenseImageName = '';
      LogService.visibleLog(JSON.stringify('$scope.imageName : ' + $scope.imageName + ' | $scope.licenseImageName : ' + $scope.licenseImageName));

      if ($scope.newUser.opentimeSplit != undefined) {
        if ($scope.newUser.opentimeSplit != undefined && $scope.newUser.closeTime != undefined)
          $scope.newUser.openTime = $scope.newUser.opentimeSplit + ';' + $scope.newUser.closeTime;
      }

      if($scope.newUser.city == undefined)
        $scope.newUser.city = { title : $scope.initialCity };
      LogService.visibleLog(JSON.stringify('initial city ne : ' + $scope.initialCity));
      LogService.visibleLog('$scope.newUser.city : ' + JSON.stringify($scope.newUser.city));
      if ($scope.newUser.username != staticUsername)
      {

        var usernameCheckPromise = ProfileService.checkUsername($scope.newUser.username);

        usernameCheckPromise.then(
          function (process) {

            if (process.data.errorCode == 0)
            {
              //-- Decide which part of form filled.If Quick register filled just use this part or other part filled,use that
              if ((/(^\d{5}$)|(^\d{5}-\d{4}$)/.test($scope.newUser.zipcode) != true && $scope.newUser.zipcode != undefined ) && ($scope.newUser.zipcode != ''))
              {
                LoadingService.hide();
                PopupService.alert('Error', 'E106');
              }
              else if ((/(^\d{3}-\d{3}-\d{4}$)|(^\d{3}-\d{4}$)/.test($scope.newUser.phone) != true && $scope.newUser.phone != undefined ) && ($scope.newUser.phone != ''))
              {
                LoadingService.hide();
                PopupService.alert('Oopps !', 'E105');
              }
              else if ((/(^\d{3}-\d{3}-\d{4}$)|(^\d{3}-\d{4}$)/.test($scope.newUser.workPhone) != true && $scope.newUser.workPhone != undefined ) && ($scope.newUser.workPhone != ''))
              {
                LoadingService.hide();
                PopupService.alert('Oopps !', 'E107');
              }
              else if ((/^[0-9A-Za-z_.]+$/.test($scope.newUser.username) != true && $scope.newUser.username != undefined && $scope.newUser.username != '') || ( $scope.newUser.username.length < 3  || $scope.newUser.username .length > 20 ))
              {
                LoadingService.hide();
                PopupService.alert('Error', 'E117');
              }
              //-- If user didn't fill all field, check and decide to requests
              //-- User didn't choose picture so we have accept this issue
              else if ($scope.newUser.name == undefined || $scope.newUser.dateOfBirth == null || $scope.newUser.phone == undefined || $scope.newUser.address1 == undefined || $scope.newUser.city == undefined || $scope.newUser.state == undefined || $scope.newUser.zipcode == undefined)
              {


                if ($scope.imageName != '' && ($scope.licenseImageName == '' || $scope.licenseImageName == saltLicensePicture))
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

                        var registerPromise = ProfileService.updateProfile($scope.newUser,json.imageName, LocalStorageService.get('token'),saltLicensePicture);

                        registerPromise.then(
                          function (process) {


                            if (process.data.errorCode == 0) {
                              staticUsername = $scope.newUser.username;

                              LocalStorageService.save('profilePicture', json.imageName);
                              if($scope.newUser.city.title)
                                LocalStorageService.save('userCity', $scope.newUser.city.title);
                              LoadingService.hide();
                              PopupService.alert('Info', 'S103');

                            } else {
                              LoadingService.hide();
                              PopupService.alert('Error', process.data.errorCode);
                            }
                          },
                          function (errorPayload) {
                            LoadingService.hide();
                            PopupService.alert('Error', process.data.errorCode);
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
                else if($scope.imageName == '' && ($scope.licenseImageName == '' || $scope.licenseImageName == saltLicensePicture))
                {
                  var registerPromise = ProfileService.updateProfile($scope.newUser,saltProfilePicture, LocalStorageService.get('token'),saltLicensePicture);
                  registerPromise.then(
                    function (process) {


                      if (process.data.errorCode == 0) {
                        staticUsername = $scope.newUser.username;
                        PopupService.alert('Info', 'S103');
                        if($scope.newUser.city.title)
                          LocalStorageService.save('userCity', $scope.newUser.city.title);
                        LoadingService.hide();
                      } else {
                        LoadingService.hide();
                        PopupService.alert('Error', process.data.errorCode);
                      }
                    },
                    function (errorPayload) {
                      LoadingService.hide();
                      PopupService.alert('Error', 999);
                    });
                }
                else if ($scope.imageName == '' && ($scope.licenseImageName != '' || $scope.licenseImageName != saltLicensePicture))
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

                        var registerPromise = ProfileService.updateProfile($scope.newUser,saltProfilePicture, LocalStorageService.get('token'),json.imageName);
                        registerPromise.then(
                          function (process) {

                            saltLicensePicture = json.imageName;
                            staticUsername = $scope.newUser.username;
                            if($scope.newUser.city.title)
                              LocalStorageService.save('userCity', $scope.newUser.city.title);
                            LoadingService.hide();
                            PopupService.alert('Info', 'S103');
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
                    var licenseImagePath = $scope.licenseImageName;
                  else
                    var licenseImagePath = cordova.file.dataDirectory + $scope.licenseImageName;

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
                        saltProfilePicture = jsonProfile.imageName;
                        //-- Profile picture uploaded successfully.So start upload license picture
                        var uploadPromiseLicense = RegisterService.uploadLicensePicture(licenseImagePath, $scope.newUser.email);
                        uploadPromiseLicense.then(
                          function (uploadLincese) {
                            var json = JSON.stringify(eval("(" + uploadLincese.response + ")"));
                            json = JSON.parse(json);
                            if (json.status == 'OK') {
                              saltLicensePicture = json.imageName;
                              var registerPromise = ProfileService.updateProfile($scope.newUser,jsonProfile.imageName, LocalStorageService.get('token'),json.imageName);
                              registerPromise.then(
                                function (process) {

                                  if (process.data.errorCode == 0) {
                                    staticUsername = $scope.newUser.username;
                                    saltLicensePicture = $rootScope.licenseThumbnailURL + json.imageName;
                                    saltProfilePicture = $rootScope.profileThumbnailURL + jsonProfile.imageName;
                                    if($scope.newUser.city.title)
                                      LocalStorageService.save('userCity', $scope.newUser.city.title);
                                    LoadingService.hide();
                                    PopupService.alert('Successful', "S103");
                                  } else {
                                    LoadingService.hide();
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
              else
              {

                switch ($scope.newUser.userType) {
                  case 'Hub':
                    $scope.newUser.daysOfOperations = $scope.daysOperation;
                    break;
                  default:
                    break;
                }

                if ($scope.imageName != '' && ($scope.licenseImageName == '' || $scope.licenseImageName == saltLicensePicture))
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

                        var registerPromise = ProfileService.updateProfile($scope.newUser,json.imageName, LocalStorageService.get('token'),saltLicensePicture);

                        registerPromise.then(
                          function (process) {


                            if (process.data.errorCode == 0) {
                              staticUsername = $scope.newUser.username;

                              LocalStorageService.save('profilePicture', json.imageName);
                              if($scope.newUser.city.title)
                                LocalStorageService.save('userCity', $scope.newUser.city.title);
                              LoadingService.hide();
                              PopupService.alert('Info', 'S103');

                            } else {
                              LoadingService.hide();
                              PopupService.alert('Error', process.data.errorCode);
                            }
                          },
                          function (errorPayload) {
                            LoadingService.hide();
                            PopupService.alert('Error', process.data.errorCode);
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
                else if($scope.imageName == '' && ($scope.licenseImageName == '' || $scope.licenseImageName == saltLicensePicture))
                {
                  var registerPromise = ProfileService.updateProfile($scope.newUser,saltProfilePicture, LocalStorageService.get('token'),saltLicensePicture);
                  registerPromise.then(
                    function (process) {


                      if (process.data.errorCode == 0) {
                        staticUsername = $scope.newUser.username;
                        PopupService.alert('Info', 'S103');
                        if($scope.newUser.city.title)
                          LocalStorageService.save('userCity', $scope.newUser.city.title);
                        LoadingService.hide();
                      } else {
                        LoadingService.hide();
                        PopupService.alert('Error', process.data.errorCode);
                      }
                    },
                    function (errorPayload) {
                      LoadingService.hide();
                      PopupService.alert('Error', 999);
                    });
                }
                else if ($scope.imageName == '' && ($scope.licenseImageName != '' || $scope.licenseImageName != saltLicensePicture))
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

                        var registerPromise = ProfileService.updateProfile($scope.newUser,saltProfilePicture, LocalStorageService.get('token'),json.imageName);
                        registerPromise.then(
                          function (process) {

                            saltLicensePicture = json.imageName;
                            staticUsername = $scope.newUser.username;
                            if($scope.newUser.city.title)
                              LocalStorageService.save('userCity', $scope.newUser.city.title);
                            LoadingService.hide();
                            PopupService.alert('Info', 'S103');
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
                    var licenseImagePath = $scope.licenseImageName;
                  else
                    var licenseImagePath = cordova.file.dataDirectory + $scope.licenseImageName;

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
                        saltProfilePicture = jsonProfile.imageName;
                        //-- Profile picture uploaded successfully.So start upload license picture
                        var uploadPromiseLicense = RegisterService.uploadLicensePicture(licenseImagePath, $scope.newUser.email);
                        uploadPromiseLicense.then(
                          function (uploadLincese) {
                            var json = JSON.stringify(eval("(" + uploadLincese.response + ")"));
                            json = JSON.parse(json);
                            if (json.status == 'OK') {
                              saltLicensePicture = json.imageName;
                              var registerPromise = ProfileService.updateProfile($scope.newUser,jsonProfile.imageName, LocalStorageService.get('token'),json.imageName);
                              registerPromise.then(
                                function (process) {

                                  if (process.data.errorCode == 0) {
                                    staticUsername = $scope.newUser.username;
                                    saltLicensePicture = $rootScope.licenseThumbnailURL + json.imageName;
                                    saltProfilePicture = $rootScope.profileThumbnailURL + jsonProfile.imageName;
                                    if($scope.newUser.city.title)
                                      LocalStorageService.save('userCity', $scope.newUser.city.title);
                                    LoadingService.hide();
                                    PopupService.alert('Successful', "S103");
                                  } else {
                                    LoadingService.hide();
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

            }
            else if (process.data.errorCode == 118)
            {
              LoadingService.hide();
              $scope.usernameVerified = false;
              PopupService.alert('Error', 'E108');

            }
            else if (process.data.errorCode == 109)
            {
              LoadingService.hide();
              $scope.usernameVerified = false;
              PopupService.alert('Error', 109);

            }
          },
          function (errorPayload) {
            LoadingService.hide();
            PopupService.alert('Error', 999);
          });
      }
      else
      {
        //-- Decide which part of form filled.If Quick register filled just use this part or other part filled,use that
        if ((/(^\d{5}$)|(^\d{5}-\d{4}$)/.test($scope.newUser.zipcode) != true && $scope.newUser.zipcode != undefined ) && ($scope.newUser.zipcode != ''))
        {
          LoadingService.hide();
          PopupService.alert('Oopps !', 'E106');
        }
        else if ((/(^\d{3}-\d{3}-\d{4}$)|(^\d{3}-\d{4}$)/.test($scope.newUser.phone) != true && $scope.newUser.phone != undefined ) && ($scope.newUser.phone != ''))
        {
          LoadingService.hide();
          PopupService.alert('Oopps !', 'E105');
        }
        else if ((/(^\d{3}-\d{3}-\d{4}$)|(^\d{3}-\d{4}$)/.test($scope.newUser.workPhone) != true && $scope.newUser.workPhone != undefined ) && ($scope.newUser.workPhone != ''))
        {
          LoadingService.hide();
          PopupService.alert('Oopps !', 'E107');
        }
        else if ((/^[0-9A-Za-z_.]+$/.test($scope.newUser.username) != true && $scope.newUser.username != undefined && $scope.newUser.username != '') || ( $scope.newUser.username.length < 3  || $scope.newUser.username .length > 20 )) {
          LoadingService.hide();
          PopupService.alert('Error', 'E117');
        }
        //-- If user didn't fill all field, check and decide to requests
        //-- User didn't choose picture so we have accept this issue
        else if ($scope.newUser.name == undefined || $scope.newUser.dateOfBirth == null || $scope.newUser.phone == undefined || $scope.newUser.address1 == undefined || $scope.newUser.city == undefined || $scope.newUser.state == undefined || $scope.newUser.zipcode == undefined)
        {
          if ($scope.imageName != '' && ($scope.licenseImageName == '' || $scope.licenseImageName == saltLicensePicture))
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

                  var registerPromise = ProfileService.updateProfile($scope.newUser,json.imageName, LocalStorageService.get('token'),saltLicensePicture);

                  registerPromise.then(
                    function (process) {


                      if (process.data.errorCode == 0) {
                        staticUsername = $scope.newUser.username;

                        LocalStorageService.save('profilePicture', json.imageName);
                        if($scope.newUser.city.title)
                          LocalStorageService.save('userCity', $scope.newUser.city.title);
                        LoadingService.hide();
                        PopupService.alert('Info', 'S103');

                      } else {
                        LoadingService.hide();
                        PopupService.alert('Error', process.data.errorCode);
                      }
                    },
                    function (errorPayload) {
                      LoadingService.hide();
                      PopupService.alert('Error', process.data.errorCode);
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
          else if($scope.imageName == '' && ($scope.licenseImageName == '' || $scope.licenseImageName == saltLicensePicture))
          {
            var registerPromise = ProfileService.updateProfile($scope.newUser,saltProfilePicture, LocalStorageService.get('token'),saltLicensePicture);
            registerPromise.then(
              function (process) {


                if (process.data.errorCode == 0) {
                  staticUsername = $scope.newUser.username;
                  PopupService.alert('Info', 'S103');
                  if($scope.newUser.city.title)
                    LocalStorageService.save('userCity', $scope.newUser.city.title);
                  LoadingService.hide();
                } else {
                  LoadingService.hide();
                  PopupService.alert('Error', process.data.errorCode);
                }
              },
              function (errorPayload) {
                LoadingService.hide();
                PopupService.alert('Error', 999);
              });
          }
          else if ($scope.imageName == '' && ($scope.licenseImageName != '' || $scope.licenseImageName != saltLicensePicture))
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

                  var registerPromise = ProfileService.updateProfile($scope.newUser,saltProfilePicture, LocalStorageService.get('token'),json.imageName);
                  registerPromise.then(
                    function (process) {

                      saltLicensePicture = json.imageName;
                      staticUsername = $scope.newUser.username;
                      if($scope.newUser.city.title)
                        LocalStorageService.save('userCity', $scope.newUser.city.title);
                      LoadingService.hide();
                      PopupService.alert('Info', 'S103');
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
              var licenseImagePath = $scope.licenseImageName;
            else
              var licenseImagePath = cordova.file.dataDirectory + $scope.licenseImageName;

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
                  saltProfilePicture = jsonProfile.imageName;
                  //-- Profile picture uploaded successfully.So start upload license picture
                  var uploadPromiseLicense = RegisterService.uploadLicensePicture(licenseImagePath, $scope.newUser.email);
                  uploadPromiseLicense.then(
                    function (uploadLincese) {
                      var json = JSON.stringify(eval("(" + uploadLincese.response + ")"));
                      json = JSON.parse(json);
                      if (json.status == 'OK') {
                        saltLicensePicture = json.imageName;
                        var registerPromise = ProfileService.updateProfile($scope.newUser,jsonProfile.imageName, LocalStorageService.get('token'),json.imageName);
                        registerPromise.then(
                          function (process) {

                            if (process.data.errorCode == 0) {
                              staticUsername = $scope.newUser.username;
                              saltLicensePicture = $rootScope.licenseThumbnailURL + json.imageName;
                              saltProfilePicture = $rootScope.profileThumbnailURL + jsonProfile.imageName;
                              if($scope.newUser.city.title)
                                LocalStorageService.save('userCity', $scope.newUser.city.title);
                              LoadingService.hide();
                              PopupService.alert('Successful', "S103");
                            } else {
                              LoadingService.hide();
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
        else
        {
          switch ($scope.newUser.userType) {
            case 'Hub':
              $scope.newUser.daysOfOperations = $scope.daysOperation;

              break;
            default:
              break;
          }
          if ($scope.imageName != '' && ($scope.licenseImageName == '' || $scope.licenseImageName == saltLicensePicture))
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

                  var registerPromise = ProfileService.updateProfile($scope.newUser,json.imageName, LocalStorageService.get('token'),saltLicensePicture);

                  registerPromise.then(
                    function (process) {


                      if (process.data.errorCode == 0) {
                        staticUsername = $scope.newUser.username;

                        LocalStorageService.save('profilePicture', json.imageName);
                        if($scope.newUser.city.title)
                          LocalStorageService.save('userCity', $scope.newUser.city.title);
                        LoadingService.hide();
                        PopupService.alert('Info', 'S103');

                      } else {
                        LoadingService.hide();
                        PopupService.alert('Error', process.data.errorCode);
                      }
                    },
                    function (errorPayload) {
                      LoadingService.hide();
                      PopupService.alert('Error', process.data.errorCode);
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
          else if($scope.imageName == '' && ($scope.licenseImageName == '' || $scope.licenseImageName == saltLicensePicture))
          {
            var registerPromise = ProfileService.updateProfile($scope.newUser,saltProfilePicture, LocalStorageService.get('token'),saltLicensePicture);
            registerPromise.then(
              function (process) {


                if (process.data.errorCode == 0) {
                  staticUsername = $scope.newUser.username;
                  PopupService.alert('Info', 'S103');
                  if($scope.newUser.city.title)
                    LocalStorageService.save('userCity', $scope.newUser.city.title);
                  LoadingService.hide();
                } else {
                  LoadingService.hide();
                  PopupService.alert('Error', process.data.errorCode);
                }
              },
              function (errorPayload) {
                LoadingService.hide();
                PopupService.alert('Error', 999);
              });
          }
          else if ($scope.imageName == '' && ($scope.licenseImageName != '' || $scope.licenseImageName != saltLicensePicture))
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

                  var registerPromise = ProfileService.updateProfile($scope.newUser,saltProfilePicture, LocalStorageService.get('token'),json.imageName);
                  registerPromise.then(
                    function (process) {

                      saltLicensePicture = json.imageName;
                      staticUsername = $scope.newUser.username;
                      if($scope.newUser.city.title)
                        LocalStorageService.save('userCity', $scope.newUser.city.title);
                      LoadingService.hide();
                      PopupService.alert('Info', 'S103');
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
              var licenseImagePath = $scope.licenseImageName;
            else
              var licenseImagePath = cordova.file.dataDirectory + $scope.licenseImageName;

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
                  saltProfilePicture = jsonProfile.imageName;
                  //-- Profile picture uploaded successfully.So start upload license picture
                  var uploadPromiseLicense = RegisterService.uploadLicensePicture(licenseImagePath, $scope.newUser.email);
                  uploadPromiseLicense.then(
                    function (uploadLincese) {
                      var json = JSON.stringify(eval("(" + uploadLincese.response + ")"));
                      json = JSON.parse(json);
                      if (json.status == 'OK') {
                        saltLicensePicture = json.imageName;
                        var registerPromise = ProfileService.updateProfile($scope.newUser,jsonProfile.imageName, LocalStorageService.get('token'),json.imageName);
                        registerPromise.then(
                          function (process) {

                            if (process.data.errorCode == 0) {
                              staticUsername = $scope.newUser.username;
                              saltLicensePicture = $rootScope.licenseThumbnailURL + json.imageName;
                              saltProfilePicture = $rootScope.profileThumbnailURL + jsonProfile.imageName;
                              if($scope.newUser.city.title)
                                LocalStorageService.save('userCity', $scope.newUser.city.title);
                              LoadingService.hide();
                              PopupService.alert('Successful', "S103");
                            } else {
                              LoadingService.hide();
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
      }
    };

    $scope.resetStyle = function () {
      var usernameFieldWithStyle = angular.element(document.getElementById('usernameFieldWithStyle'));
      if (usernameFieldWithStyle.hasClass('usernameInvalid'))
        usernameFieldWithStyle.removeClass('usernameInvalid');
    };

    $scope.resetStyleForName = function () {
      var usernameFieldWithStyle = angular.element(document.getElementById('nameFieldWithStyle'));
      var usernameFieldWithInput = angular.element(document.getElementById('nameFieldWithStyleInput'));

      if (usernameFieldWithStyle.hasClass('usernameInvalid'))
        usernameFieldWithStyle.removeClass('usernameInvalid');
      if (usernameFieldWithInput.hasClass('usernameField'))
        usernameFieldWithInput.removeClass('usernameField');
    };

    $scope.checkUsernameTaken = function (username) {

      if (username == staticUsername)
        $scope.usernameVerified = true;
      else {
        var usernameCheckPromise = ProfileService.checkUsername(username);

        usernameCheckPromise.then(
          function (process) {

            if (process.data.errorCode == 0) {
              $scope.usernameVerified = true;

            } else if (process.data.errorCode == 118) {

              $scope.usernameVerified = false;
              var usernameFieldWithStyle = angular.element(document.getElementById('usernameFieldWithStyle'));
              usernameFieldWithStyle.addClass('usernameInvalid');

            } else if (process.data.errorCode == 109) {
              $scope.usernameVerified = false;
              PopupService.alert('Error', 999);
            }
          },
          function (errorPayload) {
            PopupService.alert('Error', 999);
          });
      }
    };

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

    $scope.addLicensePicture = function () {

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
                $scope.scopeSaltLicensePicture = imageData;
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
                    $scope.licenseImage = cordova.file.dataDirectory + newName;
                    $scope.scopeSaltLicensePicture = cordova.file.dataDirectory + newName;
                    $scope.licenseImageName = newName;
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

  }])
  .controller('OpenTimeModalInstanceCtrl', function ($scope, $uibModalInstance, opentimepicker) {
    $scope.ok = function (deneme) {
      $uibModalInstance.close(deneme);
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  });
