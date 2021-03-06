angular.module('Pakkage.PackageController', [])
.controller('PackageCtrl', ['$scope', 'LocalStorageService', '$state', 'LoadingService', 'PackageService', '$cordovaCamera', '$ionicActionSheet', '$cordovaFile', '$cordovaFileTransfer', 'PopupService', '$rootScope','PhoneControlService','$filter','$ionicPopup', function ($scope, LocalStorageService, $state, LoadingService, PackageService, $cordovaCamera, $ionicActionSheet, $cordovaFile, $cordovaFileTransfer, PopupService, $rootScope,PhoneControlService,$filter,$ionicPopup) {
    if (LocalStorageService.get('isAuthenticated') != true) {
        $state.go("tab.login");
    }

    /*if (LocalStorageService.get('fullFilled') != true) {
        PopupService.alert('Warning','E115').then(function(){
            $state.go("app.profile");
        });
    }*/

    $scope.newPackage = {};
    $scope.packagePicture = 'img/pakkage2.png';
    $scope.imageName = '';
    $scope.showPackagePicture = function () {
        var alertPopup = $ionicPopup.alert({
            title: 'Package Picture',
            template: '<img style="width:100%" src="' + $scope.packagePicture + '" />'
        });
    };

    $rootScope.$watch('clearedPackage', function (newValue, oldValue) {
    	console.log($rootScope.clearedPackage);
        $scope.newPackage = $rootScope.clearedPackage;
        /*if (LocalStorageService.get('fullFilled') != true) {
            PopupService.alert('Warning','E115').then(function(){
                $state.go("app.profile");
            });
        }*/
    });
    $scope.cities = LocalStorageService.get('cities')[0].cities;
    $scope.$watch('newPackage.city',function(newValue, oldValue){
        if(newValue != undefined)
        {
            $scope.newPackage.state = $filter('filter')(LocalStorageService.get('cities'), function (d) { return d.id === newValue.originalObject.id; })[0].code;
        }
    });

    $scope.formatPhone = function(keyEvent){
        $scope.newPackage.phone = PhoneControlService.formatPhone(keyEvent,$scope.newPackage.phone);
    };

    $scope.saveAsDraft = function(){
        LoadingService.show();

        if ($scope.newPackage.zipcode == undefined)
            $scope.newPackage.zipcode = '';
        //-- Check basic validations
        if ($scope.newPackage.name == undefined || $scope.newPackage.email == undefined || $scope.newPackage.phone == undefined || $scope.newPackage.address1 == undefined ||
            $scope.newPackage.address2 == undefined || $scope.newPackage.city == undefined || $scope.newPackage.state == undefined || $scope.newPackage.zipcode == undefined) {

            if ($scope.newPackage.name == undefined && $scope.newPackage.email == undefined && $scope.newPackage.phone == undefined && $scope.newPackage.address1 == undefined &&
                $scope.newPackage.address2 == undefined && $scope.newPackage.city == undefined && $scope.newPackage.state == undefined && $scope.newPackage.zipcode == undefined) {
                LoadingService.hide();
                PopupService.alert('Warning', 'E112');
            }
            else if ((/(^\d{3}-\d{3}-\d{4}$)|(^\d{3}-\d{4}$)/.test($scope.newPackage.phone) != true && $scope.newPackage.phone != undefined ) && ($scope.newPackage.phone != ''))
            {
                LoadingService.hide();
                PopupService.alert('Oopps !', 'E105');
            }
            else if ((/(^\d{5}$)|(^\d{5}-\d{4}$)/.test($scope.newPackage.zipcode) != true && $scope.newPackage.zipcode != undefined ) && ($scope.newPackage.zipcode != '')) {
                LoadingService.hide();
                PopupService.alert('Oopps !', 'E106');
            }
            //-- Check email is valid
            else if (((/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($scope.newPackage.email) != true && $scope.newPackage.email != undefined)) && ($scope.newPackage.email != '')) {
                LoadingService.hide();
                PopupService.alert('Oopps !', 'E111');
            } else {
                if ($scope.imageName != '') {
                    if ($scope.imageType == 0)
                        var imagePath = $scope.imageName;
                    else
                        var imagePath = cordova.file.dataDirectory + $scope.imageName;

                    var uploadPromise = PackageService.uploadPicture(imagePath, LocalStorageService.get('email'));
                    uploadPromise.then(
                        function (upload) {
                            var json = JSON.stringify(eval("(" + upload.response + ")"));
                            json = JSON.parse(json);
                            if (json.status == 'OK') {

                                var packagePromise = PackageService.createPakkage($scope.newPackage, json.imageName, '0', LocalStorageService.get('token'), LocalStorageService.get('email'));
                                packagePromise.then(
                                    function (process) {
                                        LoadingService.hide();
                                        if (process.data.errorCode == 0) {
                                            PopupService.alert('Awesome !', 'S104').then(function(){
                                                $state.go('app.home');
                                            });
                                        } else {
                                            PopupService.alert('Error', process.data.errorCode);
                                        }
                                    },
                                    function (errorPayload) {
                                        LoadingService.hide();
                                        PopupService.alert('Error', 'E109');
                                    });
                            } else {
                                LoadingService.hide();
                                PopupService.alert('Error', 'E110');
                            }
                        },
                        function (errorPayload) {
                            LoadingService.hide();
                            PopupService.alert('Error', 999);
                        });
                } else {
                    var packagePromise = PackageService.createPakkage($scope.newPackage, 'noPackage.png', '0', LocalStorageService.get('token'), LocalStorageService.get('email'));

                    packagePromise.then(
                        function (process) {
                            LoadingService.hide();
                            if (process.data.errorCode == 0) {
                                PopupService.alert('Awesome !', 'S104').then(function(){
                                    $state.go('app.home');
                                });
                            } else {
                                PopupService.alert('Error', process.data.errorCode);
                            }
                        },
                        function (errorPayload) {
                            LoadingService.hide();
                            PopupService.alert('Error', 'E109');
                        });
                }
            }
        }
        //--- Phone number valid control
        else if ((/(^\d{3}-\d{3}-\d{4}$)|(^\d{3}-\d{4}$)/.test($scope.newPackage.phone) != true && $scope.newPackage.phone != undefined ) && ($scope.newPackage.phone != ''))
        {
            LoadingService.hide();
            PopupService.alert('Oopps !', 'E105');
        }
        else if ((/(^\d{5}$)|(^\d{5}-\d{4}$)/.test($scope.newPackage.zipcode) != true && $scope.newPackage.zipcode != undefined ) && ($scope.newPackage.zipcode != '')) {
            LoadingService.hide();
            PopupService.alert('Oopps !', 'E106');
        }
        //-- Check email is valid
        else if (((/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($scope.newPackage.email) != true && $scope.newPackage.email != undefined)) && ($scope.newPackage.email != '')) {
            LoadingService.hide();
            PopupService.alert('Oopps !', 'E111');
        } else {
            if ($scope.imageName == '') {

                //-- Just call register service without check image
                var packagePromise = PackageService.createPakkage($scope.newPackage, 'noPackage.png', '0', LocalStorageService.get('token'), LocalStorageService.get('email'));

                packagePromise.then(
                    function (process) {
                        LoadingService.hide();
                        if (process.data.errorCode == 0) {
                            PopupService.alert('Awesome !', 'S104').then(function(){
                                $state.go('app.home');
                            });
                        } else {
                            PopupService.alert('Error', process.data.errorCode);
                        }
                    },
                    function (errorPayload) {
                        LoadingService.hide();
                        PopupService.alert('Error', 'E109');
                    });
            } else {
                if ($scope.imageType == 0)
                    var imagePath = $scope.imageName;
                else
                    var imagePath = cordova.file.dataDirectory + $scope.imageName;

                var uploadPromise = PackageService.uploadPicture(imagePath, LocalStorageService.get('email'));
                uploadPromise.then(
                    function (upload) {
                        var json = JSON.stringify(eval("(" + upload.response + ")"));
                        json = JSON.parse(json);
                        if (json.status == 'OK') {

                            var packagePromise = PackageService.createPakkage($scope.newPackage, json.imageName, '0', LocalStorageService.get('token'), LocalStorageService.get('email'));
                            packagePromise.then(
                                function (process) {
                                    LoadingService.hide();
                                    if (process.data.errorCode == 0) {

                                        PopupService.alert('Awesome !', 'S104').then(function(){
                                            $state.go('app.home');
                                        });
                                    } else {
                                        PopupService.alert('Error', process.data.errorCode);
                                    }
                                },
                                function (errorPayload) {
                                    LoadingService.hide();
                                    PopupService.alert('Error', 'E109');
                                });
                        } else {
                            LoadingService.hide();
                            PopupService.alert('Error', 'E110');
                        }
                    },
                    function (errorPayload) {
                        LoadingService.hide();
                        PopupService.alert('Error', 999);
                    });

            }
        }
    };

    $scope.sendAPackageButton = function () {
        LoadingService.show();
        if ($scope.newPackage.zipcode == undefined)
            $scope.newPackage.zipcode = '';
        //-- Check basic validations
        if ($scope.newPackage.name == undefined || $scope.newPackage.email == undefined || $scope.newPackage.phone == undefined || $scope.newPackage.address1 == undefined ||
            $scope.newPackage.address2 == undefined || $scope.newPackage.city == undefined || $scope.newPackage.state == undefined || $scope.newPackage.zipcode == undefined) {
            if ($scope.newPackage.name == undefined && $scope.newPackage.email == undefined && $scope.newPackage.phone == undefined && $scope.newPackage.address1 == undefined &&
                $scope.newPackage.address2 == undefined && $scope.newPackage.city == undefined && $scope.newPackage.state == undefined && $scope.newPackage.zipcode == undefined) {
                LoadingService.hide();
                PopupService.alert('Warning', 'E112');
            }
            //--- Phone number valid control
            else if ((/(^\d{3}-\d{3}-\d{4}$)|(^\d{3}-\d{4}$)/.test($scope.newPackage.phone) != true && $scope.newPackage.phone != undefined ) && ($scope.newPackage.phone != ''))
            {
                LoadingService.hide();
                PopupService.alert('Oopps !', 'E105');
            }
            else if ((/(^\d{5}$)|(^\d{5}-\d{4}$)/.test($scope.newPackage.zipcode) != true && $scope.newPackage.zipcode != undefined ) && ($scope.newPackage.zipcode != '')) {
                LoadingService.hide();
                PopupService.alert('Oopps !', 'E106');
            }
            //-- Check email is valid
            else if (((/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($scope.newPackage.email) != true && $scope.newPackage.email != undefined)) && ($scope.newPackage.email != '')) {
                LoadingService.hide();
                PopupService.alert('Oopps !', 'E111');
            } else {
                LoadingService.hide();
                PopupService.confirm('Confirm', 'C102')
                .then(function (click) {
                    LoadingService.show();

                    if (click) {
                        //console.log($scope.imageName);
                        if ($scope.imageName != '') {
                            if ($scope.imageType == 0)
                                var imagePath = $scope.imageName;
                            else
                                var imagePath = cordova.file.dataDirectory + $scope.imageName;

                            var uploadPromise = PackageService.uploadPicture(imagePath, LocalStorageService.get('email'));
                            uploadPromise.then(
                                function (upload) {
                                    var json = JSON.stringify(eval("(" + upload.response + ")"));
                                    json = JSON.parse(json);
                                    if (json.status == 'OK') {

                                        var packagePromise = PackageService.createPakkage($scope.newPackage, json.imageName, '0', LocalStorageService.get('token'), LocalStorageService.get('email'));
                                        packagePromise.then(
                                            function (process) {
                                                LoadingService.hide();
                                                if (process.data.errorCode == 0) {
                                                    PopupService.alert('Awesome !', 'S105').then(function(){
                                                        $state.go('app.home');
                                                    });
                                                } else {
                                                    PopupService.alert('Error', process.data.errorCode);
                                                }
                                            },
                                            function (errorPayload) {
                                                LoadingService.hide();
                                                PopupService.alert('Error', 'E109');
                                            });
                                    } else {
                                        LoadingService.hide();
                                        PopupService.alert('Error',  'E110');
                                    }
                                },
                                function (errorPayload) {
                                    LoadingService.hide();
                                    PopupService.alert('Error', 999);
                                });
                        } else {
                            var packagePromise = PackageService.createPakkage($scope.newPackage, 'noPackage.png', '0', LocalStorageService.get('token'), LocalStorageService.get('email'));

                            packagePromise.then(
                                function (process) {
                                    LoadingService.hide();
                                    if (process.data.errorCode == 0) {
                                        PopupService.alert('Awesome !', 'S105').then(function(){
                                                        $state.go('app.home');
                                                    });
                                    } else {
                                        PopupService.alert('Error', process.data.errorCode);
                                    }
                                },
                                function (errorPayload) {
                                    LoadingService.hide();
                                    PopupService.alert('Error', 'E109');
                                });
                        }
                    }
                    else
                    {
                    	LoadingService.hide();
                    }
                })
            }
        }
        //--- Phone number valid control
        else if ((/(^\d{3}-\d{3}-\d{4}$)|(^\d{3}-\d{4}$)/.test($scope.newPackage.phone) != true && $scope.newPackage.phone != undefined ) && ($scope.newPackage.phone != ''))
        {
            LoadingService.hide();
            PopupService.alert('Oopps !', 'E105');
        }
        else if ((/(^\d{5}$)|(^\d{5}-\d{4}$)/.test($scope.newPackage.zipcode) != true && $scope.newPackage.zipcode != undefined ) && ($scope.newPackage.zipcode != '')) {
            LoadingService.hide();
            PopupService.alert('Oopps !', 'E106');
        }
        //-- Check email is valid
        else if (((/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($scope.newPackage.email) != true && $scope.newPackage.email != undefined)) && ($scope.newPackage.email != '')) {
            LoadingService.hide();
            PopupService.alert('Oopps !', 'E111');
        } else {
            if ($scope.imageName == '') {
                LoadingService.hide();
                PopupService.confirm('Confirm', 'C103')
                .then(function (click) {
                    LoadingService.show();

                    if (click) {
                        //-- Just call register service without check image
                        var packagePromise = PackageService.createPakkage($scope.newPackage, 'noPackage.png', '1', LocalStorageService.get('token'), LocalStorageService.get('email'));

                        packagePromise.then(
                            function (process) {
                                LoadingService.hide();
                                if (process.data.errorCode == 0) {
                                    $state.go('app.availableHubs',{cache:false});
                                } else {
                                    PopupService.alert('Error', process.data.errorCode);
                                }
                            },
                            function (errorPayload) {
                                LoadingService.hide();
                                PopupService.alert('Error', 'E109');
                            });
                    }
                    else
                        LoadingService.hide();
                });
            } else {
                LoadingService.hide();
                PopupService.confirm('Confirm', 'C103')
                .then(function (click) {
                    LoadingService.show();

                    if (click) {
                        if ($scope.imageType == 0)
                            var imagePath = $scope.imageName;
                        else
                            var imagePath = cordova.file.dataDirectory + $scope.imageName;

                        var uploadPromise = PackageService.uploadPicture(imagePath, LocalStorageService.get('email'));
                        uploadPromise.then(
                            function (upload) {
                                var json = JSON.stringify(eval("(" + upload.response + ")"));
                                json = JSON.parse(json);
                                if (json.status == 'OK') {

                                    var packagePromise = PackageService.createPakkage($scope.newPackage, json.imageName, '1', LocalStorageService.get('token'), LocalStorageService.get('email'));
                                    packagePromise.then(
                                        function (process) {
                                            LoadingService.hide();
                                            if (process.data.errorCode == 0) {

                                              $state.go('app.availableHubs',{cache:false});

                                            } else {
                                                PopupService.alert('Error', process.data.errorCode);
                                            }
                                        },
                                        function (errorPayload) {
                                            LoadingService.hide();
                                            PopupService.alert('Error', 'E109');
                                        });
                                } else {
                                    LoadingService.hide();
                                    PopupService.alert('Error', 'E110');
                                }
                            },
                            function (errorPayload) {
                                LoadingService.hide();
                                PopupService.alert('Error', 999);
                            });
                    }
                    else
                        LoadingService.hide();
                });
            }
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

                        $scope.packagePicture = imageData;
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
                                $scope.packagePicture = cordova.file.dataDirectory + newName;

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
.controller('EditPackageCtrl', ['$scope', 'LocalStorageService', '$state', 'PackageService', '$ionicPopup', '$cordovaCamera', '$ionicActionSheet', '$cordovaFile', '$cordovaFileTransfer', 'PopupService', '$stateParams', 'LoadingService','PhoneControlService','$filter', function ($scope, LocalStorageService, $state, PackageService, $ionicPopup, $cordovaCamera, $ionicActionSheet, $cordovaFile, $cordovaFileTransfer, PopupService, $stateParams, LoadingService,PhoneControlService,$filter) {
    if (LocalStorageService.get('isAuthenticated') != true) {
        $state.go("tab.login");
    }

    LoadingService.show();

    var packageId = $stateParams.packageId;

    $scope.newPackage = {};
    $scope.packagePicture = '';
    $scope.imageName = '';
    var saltPackagePicture  = '';
    $scope.cities = LocalStorageService.get('cities')[0].cities;
    $scope.$watch('newPackage.city',function(newValue, oldValue){
        if(newValue != undefined && newValue != '')
        {
            if(newValue.title != undefined && newValue.title != '')
            {
                $scope.newPackage.state = $filter('filter')(LocalStorageService.get('cities'), function (d) { return d.id === newValue.originalObject.id; })[0].code;
            }
        }
    });

    var getPackagePromise = PackageService.getPackageById(packageId, LocalStorageService.get('email'), LocalStorageService.get('token'));
    getPackagePromise.then(
        function (package) {
            if (package.data.errorCode == 0) {
                console.log(package.data.package.receiver[0].address[0].city);
                $scope.newPackage.comment = package.data.package.comment;
                $scope.newPackage.name = package.data.package.receiver[0].name;
                $scope.newPackage.email = package.data.package.receiver[0].email;
                $scope.newPackage.phone = package.data.package.receiver[0].phone;
                if (package.data.package.receiver[0].address[0] != undefined) {
                    $scope.newPackage.address1 = package.data.package.receiver[0].address[0].address1;
                    $scope.newPackage.address2 = package.data.package.receiver[0].address[0].address2 || '';
                    $scope.newPackage.city = package.data.package.receiver[0].address[0].city || '';
                    $scope.newPackage.state = package.data.package.receiver[0].address[0].state || '';
                    $scope.newPackage.zipcode = package.data.package.receiver[0].address[0].zipCode || '';
                }

                if (package.data.package.packageImage == undefined)
                    package.data.package.packageImage = 'noPackage.png';

                $scope.packagePicture = 'http://192.99.176.14:9096/uploads/packageImages/thumbnail/' + package.data.package.packageImage;
                saltPackagePicture = package.data.package.packageImage;

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

    $scope.showPackagePicture = function () {
        var alertPopup = $ionicPopup.alert({
            title: 'Package Picture',
            template: '<img style="width:100%" src="' + $scope.packagePicture + '" />'
        });
    };

    $scope.formatPhone = function(keyEvent){
        $scope.newPackage.phone = PhoneControlService.formatPhone(keyEvent,$scope.newPackage.phone);
    };


    $scope.saveAsDraft = function(){
        LoadingService.show();
        if($scope.newPackage.city != undefined)
        {
            if($scope.newPackage.city.title == undefined)
                $scope.newPackage.city = { title : $scope.newPackage.city };
        }


        if ($scope.newPackage.zipcode == undefined)
            $scope.newPackage.zipcode = '';
        //-- Check basic validations
        if ($scope.newPackage.name == undefined || $scope.newPackage.email == undefined || $scope.newPackage.phone == undefined || $scope.newPackage.address1 == undefined ||
            $scope.newPackage.address2 == undefined || $scope.newPackage.city == undefined || $scope.newPackage.state == undefined || $scope.newPackage.zipcode == undefined) {

            if ($scope.newPackage.name == undefined && $scope.newPackage.email == undefined && $scope.newPackage.phone == undefined && $scope.newPackage.address1 == undefined &&
                $scope.newPackage.address2 == undefined && $scope.newPackage.city == undefined && $scope.newPackage.state == undefined && $scope.newPackage.zipcode == undefined) {
                LoadingService.hide();
                PopupService.alert('Warning', 'E112');
            }
            else if ((/(^\d{3}-\d{3}-\d{4}$)|(^\d{3}-\d{4}$)/.test($scope.newPackage.phone) != true && $scope.newPackage.phone != undefined ) && ($scope.newPackage.phone != ''))
            {
                LoadingService.hide();
                PopupService.alert('Oopps !', 'E105');
            }
            else if ((/(^\d{5}$)|(^\d{5}-\d{4}$)/.test($scope.newPackage.zipcode) != true && $scope.newPackage.zipcode != undefined ) && ($scope.newPackage.zipcode != '')) {
                LoadingService.hide();
                PopupService.alert('Oopps !', 'E106');
            }
            //-- Check email is valid
            else if (((/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($scope.newPackage.email) != true && $scope.newPackage.email != undefined)) && ($scope.newPackage.email != '')) {
                LoadingService.hide();
                PopupService.alert('Oopps !', 'E111');
            } else {
                if ($scope.imageName != '') {
                    if ($scope.imageType == 0)
                        var imagePath = $scope.imageName;
                    else
                        var imagePath = cordova.file.dataDirectory + $scope.imageName;

                    var uploadPromise = PackageService.uploadPicture(imagePath, LocalStorageService.get('email'));
                    uploadPromise.then(
                        function (upload) {
                            var json = JSON.stringify(eval("(" + upload.response + ")"));
                            json = JSON.parse(json);
                            if (json.status == 'OK') {

                                var packagePromise = PackageService.updatePackage($scope.newPackage, json.imageName, '0', LocalStorageService.get('token'), LocalStorageService.get('email'), packageId);
                                packagePromise.then(
                                    function (process) {
                                        LoadingService.hide();
                                        if (process.data.errorCode == 0) {
                                            PopupService.alert('Awesome !', 'S104').then(function(){
                                                $state.go('app.home');
                                            });
                                        } else {
                                            PopupService.alert('Error', process.data.errorCode);
                                        }
                                    },
                                    function (errorPayload) {
                                        LoadingService.hide();
                                        PopupService.alert('Error', 'E109');
                                    });
                            } else {
                                LoadingService.hide();
                                PopupService.alert('Error', 'E110');
                            }
                        },
                        function (errorPayload) {
                            LoadingService.hide();
                            PopupService.alert('Error', 999);
                        });
                } else {

                    var packagePromise = PackageService.updatePackage($scope.newPackage, saltPackagePicture, '0', LocalStorageService.get('token'), LocalStorageService.get('email'), packageId);

                    packagePromise.then(
                        function (process) {
                            LoadingService.hide();
                            if (process.data.errorCode == 0) {
                                PopupService.alert('Awesome !', 'S104').then(function(){
                                    $state.go('app.home');
                                });
                            } else {
                                PopupService.alert('Error', process.data.errorCode);
                            }
                        },
                        function (errorPayload) {
                            LoadingService.hide();
                            PopupService.alert('Error', 'E109');
                        });
                }
            }
        }
        //--- Phone number valid control
        else if ((/(^\d{3}-\d{3}-\d{4}$)|(^\d{3}-\d{4}$)/.test($scope.newPackage.phone) != true && $scope.newPackage.phone != undefined ) && ($scope.newPackage.phone != ''))
        {
            LoadingService.hide();
            PopupService.alert('Oopps !', 'E105');
        }
        else if ((/(^\d{5}$)|(^\d{5}-\d{4}$)/.test($scope.newPackage.zipcode) != true && $scope.newPackage.zipcode != undefined ) && ($scope.newPackage.zipcode != '')) {
            LoadingService.hide();
            PopupService.alert('Oopps !', 'E106');
        }
        //-- Check email is valid
        else if (((/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($scope.newPackage.email) != true && $scope.newPackage.email != undefined)) && ($scope.newPackage.email != '')) {
            LoadingService.hide();
            PopupService.alert('Oopps !', 'E111');
        } else {
            if ($scope.imageName == '') {

                //-- Just call register service without check image
                var packagePromise = PackageService.updatePackage($scope.newPackage, saltPackagePicture, '0', LocalStorageService.get('token'), LocalStorageService.get('email'), packageId);

                packagePromise.then(
                    function (process) {
                        LoadingService.hide();
                        if (process.data.errorCode == 0) {
                            PopupService.alert('Awesome !', 'S104').then(function(){
                                $state.go('app.home');
                            });
                        } else {
                            PopupService.alert('Error', process.data.errorCode);
                        }
                    },
                    function (errorPayload) {
                        LoadingService.hide();
                        PopupService.alert('Error', 'E109');
                    });
            } else {
                if ($scope.imageType == 0)
                    var imagePath = $scope.imageName;
                else
                    var imagePath = cordova.file.dataDirectory + $scope.imageName;

                var uploadPromise = PackageService.uploadPicture(imagePath, LocalStorageService.get('email'));
                uploadPromise.then(
                    function (upload) {
                        var json = JSON.stringify(eval("(" + upload.response + ")"));
                        json = JSON.parse(json);
                        if (json.status == 'OK') {

                            var packagePromise = PackageService.updatePackage($scope.newPackage,json.imageName, '0', LocalStorageService.get('token'), LocalStorageService.get('email'), packageId);
                            packagePromise.then(
                                function (process) {
                                    LoadingService.hide();
                                    if (process.data.errorCode == 0) {
                                        PopupService.alert('Awesome !', 'S104').then(function(){
                                            $state.go('app.home');
                                        });
                                    } else {
                                        PopupService.alert('Error', process.data.errorCode);
                                    }
                                },
                                function (errorPayload) {
                                    LoadingService.hide();
                                    PopupService.alert('Error', 'E109');
                                });
                        } else {
                            LoadingService.hide();
                            PopupService.alert('Error', 'E110');
                        }
                    },
                    function (errorPayload) {
                        LoadingService.hide();
                        PopupService.alert('Error', 999);
                    });

            }
        }
    };

    $scope.updatePackageButton = function () {
        LoadingService.show();

        //-- Check basic validations
        if ($scope.newPackage.name == undefined || $scope.newPackage.email == undefined || $scope.newPackage.phone == undefined || $scope.newPackage.address1 == undefined || $scope.newPackage.city == undefined || $scope.newPackage.state == undefined || $scope.newPackage.zipcode == undefined ||
            $scope.newPackage.name == '' || $scope.newPackage.email == '' || $scope.newPackage.phone == '' || $scope.newPackage.address1 == '' ||
            $scope.newPackage.city == '' || $scope.newPackage.state == '' || $scope.newPackage.zipcode == '') {
            if ($scope.newPackage.name == undefined && $scope.newPackage.email == undefined && $scope.newPackage.phone == undefined && $scope.newPackage.address1 == undefined && $scope.newPackage.city == undefined && $scope.newPackage.state == undefined && $scope.newPackage.zipcode == undefined) {
                LoadingService.hide();
                PopupService.alert('Oopps !', 'E112');
            }
            //--- Phone number valid control
            else if ((/(^\d{3}-\d{3}-\d{4}$)|(^\d{3}-\d{4}$)/.test($scope.newPackage.phone) != true && $scope.newPackage.phone != undefined ) && ($scope.newPackage.phone != ''))
            {
                LoadingService.hide();
                PopupService.alert('Oopps !', 'E105');
            }
            else if ((/(^\d{5}$)|(^\d{5}-\d{4}$)/.test($scope.newPackage.zipcode) != true && $scope.newPackage.zipcode != undefined ) && ($scope.newPackage.zipcode != '')) {
                LoadingService.hide();
                PopupService.alert('Oopps !', 'E106');
            }
            //-- Check email is valid
            else if (((/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($scope.newPackage.email) != true && $scope.newPackage.email != undefined)) && ($scope.newPackage.email != '')) {
                LoadingService.hide();
                PopupService.alert('Oopps !', 'E111');
            } else {
                LoadingService.hide();
                PopupService.confirm('Confirm', 'C102')
                    .then(function (click) {
                        LoadingService.show();
                        if (click) {

                            if ($scope.imageName != '') {
                                if ($scope.imageType == 0)
                                    var imagePath = $scope.imageName;
                                else
                                    var imagePath = cordova.file.dataDirectory + $scope.imageName;

                                var uploadPromise = PackageService.uploadPicture(imagePath, LocalStorageService.get('email'));
                                uploadPromise.then(
                                    function (upload) {
                                        var json = JSON.stringify(eval("(" + upload.response + ")"));
                                        json = JSON.parse(json);
                                        if (json.status == 'OK') {

                                            var packagePromise = PackageService.updatePackage($scope.newPackage, json.imageName, '0', LocalStorageService.get('token'), LocalStorageService.get('email'), packageId);
                                            packagePromise.then(
                                                function (process) {
                                                    LoadingService.hide();
                                                    if (process.data.errorCode == 0) {
                                                        PopupService.alert('Awesome !', 'S105');
                                                    } else {
                                                        PopupService.alert('Error', process.data.errorCode);
                                                    }
                                                },
                                                function (errorPayload) {
                                                    LoadingService.hide();
                                                    PopupService.alert('Error', 'E113');
                                                });
                                        } else {
                                            LoadingService.hide();
                                            PopupService.alert('Error', 'E110');
                                        }
                                    },
                                    function (errorPayload) {
                                        LoadingService.hide();
                                        PopupService.alert('Error', 999);
                                    });
                            } else {

                                var packagePromise = PackageService.updatePackage($scope.newPackage, saltPackagePicture, '0', LocalStorageService.get('token'), LocalStorageService.get('email'), packageId);

                                packagePromise.then(
                                    function (process) {
                                        LoadingService.hide();
                                        if (process.data.errorCode == 0) {
                                            PopupService.alert('Awesome !', 'S105');
                                        } else {
                                            PopupService.alert('Error', process.data.errorCode);
                                        }
                                    },
                                    function (errorPayload) {
                                        LoadingService.hide();
                                        PopupService.alert('Error', 'E113');
                                    });
                            }
                        }
                    });
            }
        }
        //--- Phone number valid control
        else if ((/(^\d{3}-\d{3}-\d{4}$)|(^\d{3}-\d{4}$)/.test($scope.newPackage.phone) != true && $scope.newPackage.phone != undefined ) && ($scope.newPackage.phone != ''))
        {
            LoadingService.hide();
            PopupService.alert('Oopps !', 'E105');
        }
        else if ((/(^\d{5}$)|(^\d{5}-\d{4}$)/.test($scope.newPackage.zipcode) != true && $scope.newPackage.zipcode != undefined ) && ($scope.newPackage.zipcode != '')) {
            LoadingService.hide();
            PopupService.alert('Oopps !', 'E106');
        }
        //-- Check email is valid
        else if (((/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($scope.newPackage.email) != true && $scope.newPackage.email != undefined)) && ($scope.newPackage.email != '')) {
            LoadingService.hide();
            PopupService.alert('Oopps !', 'E110');
        } else {
            if ($scope.imageName == '') {
                LoadingService.hide();
                PopupService.confirm('Confirm', 'C103')
                .then(function (click) {
                    LoadingService.show();

                    if (click) {
                        //-- Just call register service without check image
                        var packagePromise = PackageService.updatePackage($scope.newPackage, saltPackagePicture, '1', LocalStorageService.get('token'), LocalStorageService.get('email'), packageId);

                        packagePromise.then(
                            function (process) {
                                LoadingService.hide();
                                if (process.data.errorCode == 0) {
                                    $state.go('app.availableHubs',{cache:false});
                                } else {
                                    PopupService.alert('Error', process.data.errorCode);
                                }
                            },
                            function (errorPayload) {
                                LoadingService.hide();
                                PopupService.alert('Error', 'E109');
                            });
                    }
                    else
                        LoadingService.hide();
                });
            } else {
                LoadingService.hide();
                PopupService.confirm('Confirm', 'C103')
                .then(function (click) {
                    LoadingService.show();

                    if (click) {

                        if ($scope.imageType == 0)
                            var imagePath = $scope.imageName;
                        else
                            var imagePath = cordova.file.dataDirectory + $scope.imageName;

                        var uploadPromise = PackageService.uploadPicture(imagePath, LocalStorageService.get('email'));
                        uploadPromise.then(
                            function (upload) {
                                var json = JSON.stringify(eval("(" + upload.response + ")"));
                                json = JSON.parse(json);
                                if (json.status == 'OK') {

                                    var packagePromise = PackageService.updatePackage($scope.newPackage, json.imageName, '1', LocalStorageService.get('token'), LocalStorageService.get('email'), packageId);
                                    packagePromise.then(
                                        function (process) {
                                            LoadingService.hide();
                                            if (process.data.errorCode == 0) {
                                                $state.go('app.availableHubs',{cache:false});
                                            } else {
                                                PopupService.alert('Error', process.data.errorCode);
                                            }
                                        },
                                        function (errorPayload) {
                                            LoadingService.hide();
                                            PopupService.alert('Error', 'E109');
                                        });
                                } else {
                                    LoadingService.hide();
                                    PopupService.alert('Error', 'E110');
                                }
                            },
                            function (errorPayload) {
                                LoadingService.hide();
                                PopupService.alert('Error', 999);
                            });
                    }
                    else
                        LoadingService.hide();
                });

            }

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

                        $scope.packagePicture = imageData;
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
                                $scope.packagePicture = cordova.file.dataDirectory + newName;

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

}]);
