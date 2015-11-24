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
            },
            
            getUserTripsHeaders: function(login, token) {
                return $http.get(baseUrl + '/user/' + login + '/trips', {
                    headers: {
                        'x-access-token': token
                    }
                });
            }
        }
    });



    controllers.controller('ProfileController', ['$location', '$window', '$stateParams', 'ProfileService', 'AuthenticationService',
        'UserService', '$cookies', '$http', '$state',
        function ProfileCtrl($location, $window, $stateParams, ProfileService, AuthenticationService, UserService, $cookies, $http, $state) {
            var vm = this;
            var baseUrl = "http://localhost:3000";

            console.log("profile controller");
            
            var token = $cookies.get('token');
            var user = AuthenticationService.getUser();
            var loginToDisplay = $stateParams.login;



            vm.removeTrip = function(tripId){
                $http.delete(baseUrl + "/trip/" + tripId).success(function(data){
                }).error(function(data, status){
                })
            };

            vm.removeUser = function(){
                console.log('remove user!');
                $http.delete(baseUrl + /user/ + AuthenticationService.getUser().login).success(function(data){
                    console.log('function(data): '+data );
                    UserService.logOut();
                    window.location.reload();

                }).error(function(data, status){
                    console.log('function(data, status): '+ data + " status: " + status);
                })



            };

            // gdy nie ma loginu w adresie -> wyświetl profil zalogowanego usera
            if(loginToDisplay === '') {
                loginToDisplay = user.login;
            }

            ProfileService.getProfile(loginToDisplay, token).success(function(data){
                vm.displayName = data.user.firstName + ' ' + data.user.lastName;
                vm.login = data.user.login;
            }).error(function(status, data){
                vm.userNotFound = true;
            });
            
            ProfileService.getUserTripsHeaders(loginToDisplay, token).success(function(data) {
                vm.userTripsHeaders = data.trips
            }).error(function(status, data){
                alert(status + ': ' + data.message);
            });
        }
    ]);
});