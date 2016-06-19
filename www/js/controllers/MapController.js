angular.module('Pakkage.MapController', [])
  .controller('MapCtrl', ['$scope', '$state', 'LoadingService','leafletData', function($scope, $state, LoadingService,leafletData) {
    angular.extend($scope, {
        istanbul: {
            lat: 41.045002,
            lng: 29.001957,
            zoom: 12
        },
        layers: {

                  baselayers: {
                    googleRoadmap: {
                        name: 'Google Streets',
                        layerType: 'ROADMAP',
                        type: 'google'
                    },
                      googleTerrain: {
                          name: 'Google Terrain',
                          layerType: 'TERRAIN',
                          type: 'google'
                      },
                      googleHybrid: {
                        name: 'Google Hybrid',
                        layerType: 'HYBRID',
                        type: 'google'
                    }

                  }


        },
        markers: {

            uskudar: {
                group: 'istanbul',
                lat: 41.011559,
                lng: 29.052887,
                label: {
                    message: "<h1>Üsküdar da bir yer</h1><br /> alt satır"
                }
            },

            umraniye: {
                group: 'istanbul',
                lat: 41.045738,
                lng: 29.096907,
                label: {
                    message: "Ümraniyede bir yer "
                }
            }
        },
    });
  }])
