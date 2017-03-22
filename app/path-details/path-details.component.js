angular.
  module('pathDetails').
  filter('trusted', function($sce){
      return function(html){
          return $sce.trustAsHtml(html)
      }
   }).
  component('pathDetails', {
    templateUrl: 'path-details/path-details.template.html',
    controller: [
      'geolocation', 
      'Apiurl', 
      '$http', 
      '$routeParams', 
      '$scope', 
      'uiGmapIsReady', 
      '$animate', 
      '$translate',
      '$window',
      'Analytics',
      function PathDetailsController(
        geolocation, 
        Apiurl, 
        $http, 
        $routeParams, 
        $scope, 
        uiGmapIsReady, 
        $animate, 
        $translate,
        $window,
        Analytics
      ) {
        var self = this;
        $scope.markers = [];

// FEATURES
        self.itemSuccess = function itemSuccess(item){
          item.is_succeeded = true;
          self.openPlaces(item.places_on_success);
          self.openObjects(item.objects_on_success);
          self.saveProgress();
        }

        self.testPassword = function testPassword(){
          if(self.current_content.user_password && self.current_content.user_password.toLowerCase().indexOf(self.current_content.success_key)>-1){
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
        self.keyboardPassword = function keyboardPassword(e){
          if(e.keyCode == 13){
            self.testPassword();
          }
        }
        self.flipContent = function flipContent(){
          document.getElementById("card").classList.toggle("flipped");
          $("#content_container").animate({scrollTop: 0},1000);
          //document.getElementById("content_container").scrollTop = 0;
        }

        self.computeDistance = function computeDistance(pointA,pointB){
          var lat_place1 = pointA.latitude;
          var lat_place2 = pointB.latitude;
          var long_place1 = pointA.longitude;
          var long_place2 =  pointB.longitude;
          return Math.acos(Math.sin(lat_place1 * Math.PI / 180)*Math.sin((Math.PI / 180 * lat_place2))+Math.cos((Math.PI / 180 * lat_place1))*Math.cos((Math.PI / 180 * lat_place2))*Math.cos(Math.PI / 180 * (long_place1-long_place2)))*6371 ;
        }

        self.showContent = function showContent(item, forcePreview){
          console.log(item);
          if(item.__t=="Place"){
            if(self.position){
              distance = Math.round(1000*self.computeDistance(item, self.position));
              item.distance = distance;
            }else{
              item.distance = "???";
              distance=1000;
            }
            if(distance>30 && !forcePreview){
              item.preview = true;
            }else{
              item.preview = false;
              item.is_visited = true;
              self.showOnMap(item);
              self.centerMap(item);
            }            
          }

          
          if (item.init_content && item.init_content.sub_objects){
            item.init_content.sub_obj = [];
            item.init_content.sub_objects.forEach(function(objId){
              item.init_content.sub_obj.push(self.getObjectFromId(objId));
            });
          }
          if (item.success_content && item.success_content.sub_objects){
            item.success_content.sub_obj = [];
            item.success_content.sub_objects.forEach(function(objId){
              item.success_content.sub_obj.push(self.getObjectFromId(objId));
            });
          }

          if(!item.preview){
            if(item.places_on_open){
              item.places_opened_name = [];
              item.places_on_open.forEach(function(plaId){
                var tmp_place = self.getPlaceFromId(plaId);
                item.places_opened_name.push(tmp_place.name);
              });
              self.openPlaces(item.places_on_open);
            }
            if(item.objects_on_open){
              item.objects_opened_name = [];
              item.objects_on_open.forEach(function(objId){
                var tmp_object = self.getObjectFromId(objId);
                item.objects_opened_name.push(tmp_object.name);
              });
              self.openObjects(item.objects_on_open);
            }
            if(item.places_on_success){
              item.places_success_name = [];
              item.places_on_success.forEach(function(plaId){
                var tmp_place = self.getPlaceFromId(plaId);
                item.places_success_name.push(tmp_place.name);
              });
            }
            if(item.objects_on_success){
              item.objects_success_name = [];
              item.objects_on_success.forEach(function(objId){
                var tmp_object = self.getObjectFromId(objId);
                item.objects_success_name.push(tmp_object.name);
              });
            }
            
            if(item.success_condition === "place"){
              if(self.getPlaceFromId(item.success_key) && self.getPlaceFromId(item.success_key).is_visited){
                self.itemSuccess(item);
                console.log(self.getPlaceFromId(item.success_key));
              }
            }
            if(item.success_condition === "object"){
              if(self.getObjectFromId(item.success_key) && self.getObjectFromId(item.success_key).is_visible){
                self.itemSuccess(item);
              }
            }

            self.saveProgress();
          }

          item.source = {
            type: item.__t,
            id: item._id
          };

          // Fix temporraire

          // if(self.current_content && self.current_content.is_shown){
          //   self.current_content.is_shown = false;
          //   setTimeout(function(){
          //     self.current_content.is_shown = true;
          //   },1000);
          // }else{
          //   item.is_shown =true;
          // }
          item.is_shown =true;

          // Fin de fix tmp

          self.current_content = item;

          if(!item.preview){
            setTimeout(function(){
              if(item.is_succeeded){
                if(document.getElementById("card")){
                  document.getElementById("card").classList.add("flipped");
                }
              }else{
                if(document.getElementById("card")){
                  document.getElementById("card").classList.remove("flipped");
                }
              }
            },550);
          }
        }

        self.closeContent = function closeContent(){
          self.current_content.is_shown = false;
        }

        self.showOnMap = function showOnMap(place){
          place.is_visible = true;
          if(place.is_visited){
            var icon = "//s3.eu-central-1.amazonaws.com/openyoureyes/green_pin.png";
          }else{
            var icon = "//s3.eu-central-1.amazonaws.com/openyoureyes/grey_pin.png"
          }
          var newMarker = {
            latitude: place.latitude,
            longitude: place.longitude,
            extId: place._id,
            idKey: $scope.markers.length,
            id: $scope.markers.length,
            title: place.name,
            click: self.test_click,
            options: {labelClass:'marker_labels',labelAnchor:'50 50',labelContent:place.name},
            icon:icon
          };

          if(!place.marker){
            place.marker=$scope.markers.length;
            $scope.markers.push(newMarker);
          }else{
            newMarker.id = place.marker;
            newMarker.idKey = place.marker;
            var markerToReplace = $scope.markers.find(function(mark){
              return mark.id === place.marker;
            });
            if(markerToReplace){
              markerToReplace.icon = icon;
            }else{
              $scope.markers.push(newMarker);
            }
            
          }
        }

        self.checkPlaceReached = function checkPlaceReached(){
          self.response.places.forEach(function(place){
            if(place.is_visible && self.position && self.computeDistance(self.position,place) < 0.03){
              self.showContent(place,true);
            }
          });
        }

        self.centerMap = function centerMap(position){
          $scope.map = { 
            center: {longitude: position.longitude, latitude:position.latitude}, 
            zoom: 16
          };
        }

        self.getPosition = function getPosition(callback){
          geolocation.getLocation().then(function(data){
            self.position = data.coords;
            if(callback){callback();}
            
            self.centerMap(data.coords);
            myMarker = $scope.markers.find(function(marker){
              return marker.id === 0
            });
            myMarker.longitude = data.coords.longitude;
            myMarker.latitude = data.coords.latitude;
          }, function(error) {
             console.log(error);
             if(callback){callback();}
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
            if(type=="place"){
              self.showOnMap(tmp_item);
            }
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
          self.getPosition(function(){
            self.showContent(self.getPlaceFromId(marker.extId))
          });
        }

        self.editItem = function editItem(item){
          window.open(Apiurl.host+"/keystone/"+item.source.type+"/"+item.source.id);
        }

        self.openObjects = function openObjects(extIdArray){
          if(extIdArray){
            extIdArray.forEach(function(objId){
              self.getObjectFromId(objId).is_visible = true;
              if(!self.getObjectFromId(objId).open_date){
                var now = new Date();
                self.getObjectFromId(objId).open_date = now;
                console.log(now);
              }
            });
          }
        }
        self.openPlaces = function openPlaces(extIdArray){
          self.updateProgress();
          if(extIdArray){
            extIdArray.forEach(function(plaId){
              self.showOnMap(self.getPlaceFromId(plaId));
            });
          }
        }
        self.getItinirary = function getItinirary(place){
          var url = "https://www.google.com/maps/dir/Ma+Position/"+place.latitude+","+place.longitude;
          window.open(url);
        }
        self.updateProgress = function updateProgress(){
          var num=0;
          var denom=0;
          self.response.places.forEach(function(place){
            denom++;
            if(place.is_visited){num++;}
          });
          document.getElementById("my-progress").style.width=num/denom*100+"%"
        }
        self.saveProgress = function saveProgress(){
          localStorage.setItem(self.response.path.key,JSON.stringify(self));
        }

        self.showPathGoals = function showPathGoals(){
          var primaryGoalsAchieved = true;
          self.response.goals.forEach(function(goal){
            goal.progress = 0;
            goal.objective = 0;
            if(goal.open_objects){
              goal.open_objects.forEach(function(openObj){
                goal.objective ++;
                goal.progress += self.getObjectFromId(openObj).is_visible||0;
              });
            }
            if(goal.open_place){
              goal.open_place.forEach(function(openPla){
                goal.objective ++;
                goal.progress += self.getPlaceFromId(openPla).is_visible||0;
              });
            }
            if(goal.success_objects){
              goal.success_objects.forEach(function(sucObj){
                goal.objective++;
                goal.progress += self.getObjectFromId(sucObj).is_succeeded||0;
              });
            }
            if(goal.success_place){
              goal.success_place.forEach(function(sucPla){
                goal.objective++;
                goal.progress += self.getPlaceFromId(sucPla).is_succeeded||0;
              });
            }
            if(goal.type=="primary" && goal.progress != goal.objective){
              primaryGoalsAchieved = false;
            }
          });

          $translate('PATH_DETAILS.GOALS.NAME').then(function (goal_string) {
            self.showContent({
              name:goal_string,
              init_content:"",
              is_goals:true, 
              is_succeeded:primaryGoalsAchieved,
              success_content: self.response.path.success_content
            });
          });

        }

        self.showPathInfo = function showPathInfo(){
          self.showContent(self.response.path);
        }

        self.initPath = function initPath(data){
          self.response = data;

          data.path.__t="Path";

          Analytics.pageView();

          self.openObjects(data.path.init_objects);
          self.openPlaces(data.path.init_places);

          self.response = data;
          self.showPathInfo();

          self.centerMap(self.response.path);
        }


// GETTING DATA
        // init with dummy values
        $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
        $scope.markers.push({
          longitude: 0,
          latitude: 0,
          idKey: 0,
          id:0,
          title: "me"
        });

        //getting data
        var previous_self = localStorage.getItem($routeParams.pathId);
        if(previous_self){
          previous_self = JSON.parse(previous_self);
          self.initPath(previous_self.response);
          self.response.places.forEach(function(pla){
            if(pla.is_visible){
              self.openPlaces([pla._id]);
            }
          });
        }else{
          $http({
            url: Apiurl.host + '/api/pathdetails',
            method: 'GET',
            params: {key: $routeParams.pathId}
          })
          .then(function(response) {
            self.initPath(response.data);
          });
        }


      }
    ]
  });