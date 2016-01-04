
define(['./module'], function (controllers) {
    'use strict';



    controllers.controller('TripController', ['$scope', '$location', '$window', 'UserService', 'AuthenticationService',
        '$cookies',
        function ($scope, $location, $window, UserService, AuthenticationService, $cookies){

        
        
		
		$scope.addTrip = function(name, description){
			if(name !== undefined && description !== undefined ){
				UserService.addTrip(name, description).success(function(data){
					if(data.success){
						//alert("Dziala");
					}
					// tu jak sie uda.
					// w data jest odpowiedz z serwera
				}).error(function(status, data){
					// tu kod jak sie post nie uda
					
				});
			}
			
		}
       

    }]);
});