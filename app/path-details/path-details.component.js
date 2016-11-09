angular.
  module('pathDetails').
  filter('trusted', function($sce){
      return function(html){
          return $sce.trustAsHtml(html)
      }
   }).
  component('pathDetails', {
    templateUrl: 'path-details/path-details.template.html',
    controller: ['geolocation', 'Apiurl', '$http', '$routeParams', '$scope', 'uiGmapIsReady', '$animate',
      function PathDetailsController(geolocation, Apiurl, $http, $routeParams, $scope, uiGmapIsReady, $animate) {
        var self = this;
        $scope.markers = [];

// FEATURES
        self.itemSuccess = function itemSuccess(item){
          self.openPlaces(item.places_on_success);
          self.openObjects(item.objects_on_success);
        }

        self.testPassword = function testPassword(){
          if(self.current_content.user_password && self.current_content.user_password.toLowerCase().indexOf(self.current_content.success_key)>-1){
            self.current_content.is_succeeded = true;
            self.flipContent();
            if(self.current_content.source.type == "Object"){
              self.itemSuccess(self.getObjectFromId(self.current_content._id));
            }else{
              self.itemSuccess(self.getPlaceFromId(self.current_content._id));
            }
          }else{
            var element = document.getElementById("password_input");
            $animate.addClass(element, 'shake').then(function() {
              element.classList.remove('shake');
            });
          }
        }
        self.flipContent = function flipContent(){
          document.getElementById("card").classList.toggle("flipped");
          $("#content_container").animate({scrollTop: 0},1000);
          //document.getElementById("content_container").scrollTop = 0;
        }

        self.showContent = function showContent(item){
          $("#card").removeClass("flipped");
          if (item.init_content.sub_objects){
            item.init_content.sub_obj = [];
            item.init_content.sub_objects.forEach(function(objId){
              item.init_content.sub_obj.push(self.getObjectFromId(objId));
            });
          }
          self.openPlaces(item.places_on_open);
          self.openObjects(item.objects_on_open);

          item.source = {
            type: item.__t,
            id: item._id
          };

          item.is_shown =true;
          
          self.current_content = item;
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