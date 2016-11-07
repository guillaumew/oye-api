angular.
  module('pathDetails').
  component('pathDetails', {
    templateUrl: 'path-details/path-details.template.html',
    controller: ['geolocation', 'Apiurl', '$http', '$routeParams', '$scope', 'uiGmapIsReady',
      function PathDetailsController(geolocation, Apiurl, $http, $routeParams, $scope, uiGmapIsReady) {
        var self = this;
        $scope.markers = [];
// GETTING DATA
        $http({
          url: Apiurl.host + '/api/pathdetails',
          method: 'GET',
          params: {key: $routeParams.pathId}
        })
        .then(function(response) {
          var ans = response.data;
          ans.objects.forEach(function(obj){
            obj.is_visible = true;
          });
          self.response = ans;
          self.initMap();
        });
        $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
        $scope.markers.push({
          longitude: 0,
          latitude: 0,
          idKey: 0,
          id:0,
          title: "me",
          icon: "https://openyoureyes.herokuapp.com/img/green_pin.png"
        });

// FEATURES
        self.initMap = function initMap(){
          $scope.map = { 
            center: { 
              latitude: self.response.path.latitude, 
              longitude: self.response.path.longitude
            }, 
            zoom: 14
          };
          for(var i=0;i<self.response.places.length;i++){
            place = self.response.places[i];
            $scope.markers.push({
              latitude: place.latitude,
              longitude: place.longitude,
              extId: place._id,
              idKey: i+1,
              id:i+1,
              title: place.name,
              click: self.test_click 
            });
          }
        }
        self.getPosition = function getPosition(){
          geolocation.getLocation().then(function(data){
            self.position = data.coords;
            $scope.map = { 
              center: {longitude: data.coords.longitude, latitude:data.coords.latitude}, 
              zoom: 15
            };
            myMarker = $scope.markers.find(function(marker){
              return marker.id === 0
            });
            myMarker.longitude = data.coords.longitude;
            myMarker.latitude = data.coords.latitude;
          });
        }

        self.editObject = function editObject(objectId){
          window.open("../keystone/objects/"+objectId);
        }
        self.editPlace = function editPlace(placeId){
          window.open("../keystone/places/"+placeId);
        }

        self.addItem = function addObject(type, name){
          var params = {
            type: type,
            name: name,
            path_id: self.response.path['_id']
          };
          if(self.position && self.position.latitude && self.position.longitude){
            params.latitude = self.position.latitude;
            params.longitude = self.position.longitude;
          }
          $http({
            url: Apiurl.host + '/api/additem',
            method: 'POST',
            params : params
          }).then(function(response){
            tmp_item = response.data;
            tmp_item.is_visible = true;
            self.response[type+"s"].push(tmp_item);
          })
        }

        self.addObject = function addObject(){
          var objectName = prompt("Nom de l'object ?");
          if(objectName){
            self.addItem("object", objectName);
          }
        }
      
        self.addPlace = function addPlace(){
          var placeName = prompt("Nom du lieu ?");
          if(placeName){
            self.addItem("place", placeName);
          }
        }

        self.test_click = function test_click(instance,event,marker){
          self.editPlace(marker.extId);
        }

      }
    ]
  });

