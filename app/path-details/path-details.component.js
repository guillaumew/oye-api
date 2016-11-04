angular.
  module('pathDetails').
  component('pathDetails', {
    templateUrl: 'path-details/path-details.template.html',
    controller: ['geolocation', 'Apiurl', '$http', '$routeParams', '$scope', 'uiGmapIsReady',
      function PathDetailsController(geolocation, Apiurl, $http, $routeParams, $scope, uiGmapIsReady) {
        var self = this;
// GETTING DATA
  	    $http({
          url: Apiurl.host + '/api/pathdetails',
          method: 'GET',
          params: {key: $routeParams.pathId}
        })
        .then(function(response) {
          var ans = response.data;
          for(var i=0; i<ans.objects.length; i++){
            ans.objects[i].is_visible = true;
          }
  	      self.response = ans;
  	    });

        $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };

// FEATURES

        self.getPosition = function getPosition(){
          geolocation.getLocation().then(function(data){
            self.position = data.coords;
            $scope.map = { 
              center: {longitude: data.coords.longitude, latitude:data.coords.latitude}, 
              zoom: 8 
            };
            $scope.marker = {
              key: "0",
              coords: {longitude: data.coords.longitude, latitude:data.coords.latitude}
            };


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