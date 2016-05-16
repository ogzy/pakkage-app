angular.module('Pakkage.MapController', [])
  .controller('MapCtrl', ['$scope', '$state', 'LoadingService','leafletData', function($scope, $state, LoadingService,leafletData) {
    angular.extend($scope, {
        istanbul: {
            lat: 41.045002,
            lng: 29.001957,
            zoom: 18
        },

        markers: {

            uskudar: {
                group: 'istanbul',
                lat: 41.011559,
                lng: 29.052887,
                label: {
                    message: "Üsküdar da bir yer",
                    options: {
                        noHide: true
                    }
                }
            },

            umraniye: {
                group: 'istanbul',
                lat: 41.045738,
                lng: 29.096907,
                label: {
                    message: "Ümraniyede bir yer ",
                    options: {
                        noHide: true
                    }
                }
            }
        },
    });
  }])
