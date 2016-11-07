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
              click: test_click 
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

        self.addObject = function addObject(){
          var objectName = prompt("Nom de l'object ?");
          $http({
            url: Apiurl.host + '/api/additem',
            method: 'POST',
            params : {
              type: "object",
              name: objectName,
              path_id: self.response.path['_id']
            }
          }).then(function(response){
            tmp_object = response.data;
            tmp_object.is_visible = true;
            self.response.objects.push(tmp_object);
          })
        }
      
        self.addPlace = function addPlace(){
          var placeName = prompt("Nom du lieu ?");
          $http({
            url: Apiurl.host + '/api/additem',
            method: 'POST',
            params : {
              type: "place",
              name: placeName,
              path_id: self.response.path['_id'],
              longitude: self.position.longitude,
              latitude: self.position.latitude
            }
          }).then(function(response){
            tmp_place = response.data;
            self.response.places.push(tmp_place);
            console.log(tmp_place);
          })
        }



      }
    ]
  });

  function test_click(instance,event,marker){
    console.log(marker);
  }