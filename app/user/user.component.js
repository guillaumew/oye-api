angular.
  module('user').
  component('user', {
    templateUrl: 'user/user.template.html',
    controller: ['Apiurl', '$http', '$routeParams', '$translate',
      function UserController(Apiurl, $http, $routeParams, $translate) {
        var self = this;
        $http({
            url: Apiurl.host + '/api/user',
            method: 'GET'
          })
        .then(function(response) {
        	if(response.data && response.data._id){
	          	self.is_connected = true;
	          	self.name = response.data.name.first + " " + response.data.name.last;
	          	self.link = "/keystone/ys/"+response.data._id;
	          	if(response.data.avatar && response.data.avatar.url){
	          		self.avatar = response.data.avatar.url;
	          	}else{
	          		self.avatar = "//s3.eu-central-1.amazonaws.com/openyoureyes/default_avatar.png";
	          	}
              if(response.data.language){
                $translate.use(response.data.language);
              }
        	}else{
          		self.is_connected = false;
	          	self.link = "/keystone/";
	          	self.avatar = "//s3.eu-central-1.amazonaws.com/openyoureyes/default_avatar.png";
         	}
        });
      }
    ]
  });