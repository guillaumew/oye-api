angular.
    module('menu').
    component('menu', {
        templateUrl: 'menu/menu.template.html',
        controller: ['$routeParams', '$scope',
            function MenuController($routeParams, $scope) {
                var self = this;

                self.show_path_options = false;
                $scope.$routeParams = $routeParams;
                $scope.$watch('$routeParams.pathId',function(newVal, oldVal){
                    if(newVal && newVal.length>0){
                        self.path = $routeParams.pathId;
                        self.show_path_options = true;
                    }else{
                        self.show_path_options = false;
                        self.path = null;
                    }
                },true);

                self.toggleFullScreen = function toggleFullScreen(){
                    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
                        if (document.documentElement.requestFullscreen) {
                            document.documentElement.requestFullscreen();
                        } else if (document.documentElement.mozRequestFullScreen) {
                            document.documentElement.mozRequestFullScreen();
                        } else if (document.documentElement.webkitRequestFullscreen) {
                            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                        }
                      } else {
                        if (document.cancelFullScreen) {
                            document.cancelFullScreen();
                        } else if (document.mozCancelFullScreen) {
                            document.mozCancelFullScreen();
                        } else if (document.webkitCancelFullScreen) {
                            document.webkitCancelFullScreen();
                        }
                    }
                }
                self.deleteProgress = function deleteProgress(){
                    localStorage.removeItem(self.path);
                    document.location.reload(true);
                }
            }
        ]
    });