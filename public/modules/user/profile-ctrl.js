/**
 * Created by Michal Kozakiewicz on 2015-11-15.
 */
 
define(['./../module'], function (controllers) {
    'use strict';
    
    controllers.factory('ProfileService', function($http) {
        var baseUrl = "http://localhost:3000";
        return {

            getProfile: function(login, token) {
                return $http.get(baseUrl + '/user/' + login, {
                  headers: {
                    'x-access-token': token
                  }
                });
            }
        }
    });

    controllers.controller('ProfileController', ['$location', '$window', 'ProfileService', '$cookies',
        function ProfileCtrl($location, $window, ProfileService, $cookies){
          var vm = this;

          vm.getProfile = function(login){
              var token = $cookies.get('token');
              alert('token:' + token);

              if(login !== undefined){
                  ProfileService.getProfile(login, token).success(function(data){
                
                  vm.displayName = data.user.firstName + ' ' + data.user.lastName
                  vm.login = data.user.login
                  // tu jak sie uda.
                  // w data jest odpowiedz z serwera
              }).error(function(status, data){
                // tu kod jak sie post nie uda

            });
          }
          
        }
       

    }]);
});