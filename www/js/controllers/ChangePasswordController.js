/**
 * Created by Fatih on 20.3.2016.
 */
angular.module('Pakkage.ChangePassword', [])
  .controller('ChangeUserPasswordCtrl',['$scope', '$state','LoadingService','ChangePasswordService','PopupService',function($scope,$state,LoadingService,ChangePasswordService,PopupService){
    $scope.user = {};
    $scope.changePasswordButton = function(){
      LoadingService.show();
      console.log($scope.user.newPassword);
      if($scope.user.newPassword  != $scope.user.confirmPassword)
      {
        LoadingService.hide();
        PopupService.alert('Warning','E101');
      }
      else if($scope.user.newPassword.trim().length < 6 || $scope.user.newPassword.trim().length > 20 )
      {
        LoadingService.hide();
        PopupService.alert('Error', 'E104');
      }
      else
      {
        var changePromise = ChangePasswordService.changeUserPassword($scope.user.newPassword);
        changePromise.then(function(response){
          if(response.data.errorCode == 0)
          {
            LoadingService.hide();
            PopupService.alert('Success','S102').then(function(){
              $state.go('app.home');
            });
          }
          else
          {
            LoadingService.hide();
            PopupService.alert('Error',response.data.errorCode);
          }
        },function(errorPayload){
          LoadingService.hide();
          PopupService.alert('Error',999);
        });
      }
    };
  }]);
