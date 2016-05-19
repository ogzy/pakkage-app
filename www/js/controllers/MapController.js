angular.module('Pakkage.MapController', [])
  .controller('MapCtrl', ['$scope', '$state', 'LoadingService', function($scope, $state, LoadingService) {

      // Define a div tag with id="map_canvas"
      var mapDiv = document.getElementById("map_canvas");

      // Initialize the map plugin
      var map = plugin.google.maps.Map.getMap(mapDiv);

      // You have to wait the MAP_READY event.
      map.on(plugin.google.maps.event.MAP_READY, onMapInit);
    

    function onMapInit(map) {
    }
  }])
