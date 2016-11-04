angular.
  module('map').
  component('map', {
    templateUrl: 'map/map.template.html',
    controller: MapController
    }
  );

MapController.$inject = ['$scope'];

function MapController($scope) {
    var ctrl = this;
    angular.extend(ctrl, {
        san_fran: {
            lat: 37.78,
            lng: -122.42,
            zoom: 13
        },
        events: {},
        layers: {
            baselayers: {
                osm: {
                    name: 'OpenStreetMap',
                    url: 'https://{s}.tiles.mapbox.com/v3/examples.map-i875mjb7/{z}/{x}/{y}.png',
                    type: 'xyz'
                }
            }
        },
        defaults: {
            scrollWheelZoom: false
        }
    });
}