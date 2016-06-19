angular.module('Pakkage.UIServices', [])
.factory('PopupService', function ($ionicPopup,ErrorCodeService) {
        return {
            alert: function (title,errorCode) {
                return $ionicPopup.alert({
                    title: title,
                    template: ErrorCodeService.getError(errorCode)
                });
            },
            confirm : function(title,errorCode){
                return $ionicPopup.confirm({
                     title: title,
                     template: ErrorCodeService.getError(errorCode)
                   });
            }
        }
})
.factory('LoadingService', function ($ionicLoading) {
        return {
                show: function () {
                    return  $ionicLoading.show({
                                template : '<img src="img/loading.gif" width="200" />',
                                showBackdrop: true,
                                maxWidth: 200,
                                hideOnStateChange: true,
                                showDelay: 0
                            });
                },
                hide: function () {
                    $ionicLoading.hide();
                }
            }
})
.factory('LogService', function () {
        return {
                visibleLog: function (input) {
                    //console.log('PakkageLog : ' + input);
                }
            }
});
