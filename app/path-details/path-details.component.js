angular.
  module('pathDetails').
  filter('trusted', function($sce){
      return function(html){
          return $sce.trustAsHtml(html)
      }
   }).
  component('pathDetails', {
    templateUrl: 'path-details/path-details.template.html',
    controller: ['geolocation', 'Apiurl', '$http', '$routeParams', '$scope', 'uiGmapIsReady',
      function PathDetailsController(geolocation, Apiurl, $http, $routeParams, $scope, uiGmapIsReady) {
        var self = this;
        $scope.markers = [];

// FEATURES
        self.showContent = function showContent(item){
          content = item.init_content;
          if (content.sub_objects){
            content.sub_obj = [];
            content.sub_objects.forEach(function(objId){
              content.sub_obj.push(self.getObjectFromId(objId));
            });
          }
          self.openPlaces(item.places_on_open);
          self.openObjects(item.objects_on_open);

          content.source = {
            type: item.__t,
            id: item._id
          };
          content.title = item.name;
          
          content.is_shown = true;
          self.current_content = content;
        }

        self.closeContent = function closeContent(){
          self.current_content.is_shown = false;
        }

        self.showOnMap = function showOnMap(place){
          place.is_visible = true;
          $scope.markers.push({
            latitude: place.latitude,
            longitude: place.longitude,
            extId: place._id,
            idKey: $scope.markers.length,
            id:$scope.markers.length,
            title: place.name,
            click: self.test_click 
          });
        }
        self.initMap = function initMap(){
          $scope.map = { 
            center: { 
              latitude: self.response.path.latitude, 
              longitude: self.response.path.longitude
            }, 
            zoom: 16
          };
        }
        self.getPosition = function getPosition(){
          geolocation.getLocation().then(function(data){
            self.position = data.coords;
            $scope.map = { 
              center: {longitude: data.coords.longitude, latitude:data.coords.latitude}, 
              zoom: 16
            };
            myMarker = $scope.markers.find(function(marker){
              return marker.id === 0
            });
            myMarker.longitude = data.coords.longitude;
            myMarker.latitude = data.coords.latitude;
          });
        }

        self.addItem = function addItem(type, name){
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

        self.getObjectFromId = function getObjectFromId(key){
          return self.response.objects.find(function(obj){
            return obj._id === key;
          });
        }

        self.getPlaceFromId = function getPlaceFromId(key){
          return self.response.places.find(function(pla){
            return pla._id === key;
          });         
        }
        self.test_click = function test_click(instance,event,marker){
          self.showContent(self.getPlaceFromId(marker.extId));
        }

        self.editItem = function editItem(source){
          window.open(Apiurl.host+"/keystone/"+source.type+"/"+source.id);
        }

        self.openObjects = function openObjects(extIdArray){
          if(extIdArray){
            extIdArray.forEach(function(objId){
              self.getObjectFromId(objId).is_visible = true;
            });
          }
        }
        self.openPlaces = function openPlaces(extIdArray){
          if(extIdArray){
            extIdArray.forEach(function(plaId){
              self.showOnMap(self.getPlaceFromId(plaId));
            });
          }
        }
// GETTING DATA
        $http({
          url: Apiurl.host + '/api/pathdetails',
          method: 'GET',
          params: {key: $routeParams.pathId}
        })
        .then(function(response) {
          var ans = response.data;
          self.response = ans;

          ans.path.__t="Path";

          self.showContent(ans.path);

          self.openObjects(ans.path.init_objects);
          self.openPlaces(ans.path.init_places);
          
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


      }
    ]
  });