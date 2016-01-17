/**
 * Created by Michal Kozakiewicz
 */
 
define(['./../module'], function (controllers) {
    'use strict';
    
    controllers.factory('StartService', function($http) {
        var baseUrl = "http://localhost:3000";
        return {
            getNewestTripsHeaders: function(token) {
                return $http.get(baseUrl + '/trip/newest', {
                    headers: {
                        'x-access-token': token
                    }
                });
            }
        }
    });

    controllers.controller('StartController', ['$location', '$window', '$stateParams', 'StartService', 'AuthenticationService', '$cookies', '$state',
        function StartCtrl($location, $window, $stateParams, StartService, AuthenticationService, $cookies, $state) {
            var vm = this;
            console.log("start controller");
            
            var token = $cookies.get('token');
            var user = AuthenticationService.getUser();
            console.log(user);

            vm.user = user;
          
            StartService.getNewestTripsHeaders(token).success(function(data) {
                vm.newestTripsHeaders = data.trips;
            }).error(function(status, data){
                alert(status + ': ' + data.message);
            });
          
        }
    ]);
});