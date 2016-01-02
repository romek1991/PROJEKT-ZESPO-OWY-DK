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
            },

            updateProfile: function(login, email, firstName, lastName, token) {
                return $http.put(baseUrl + '??', {
                    'login': login,
                    'email': email,
                    'firstName': firstName,
                    'lastName': lastName,
                    headers: {
                        'x-access-token': token
                    }
                });
            },
            
            resetAvatar: function(login, token) {
              return $http.post(baseUrl + '/photo/avatar/reset', {
                    headers: {
                        'x-access-token': token
                    }
                });
            }
        }
    });



    controllers.controller('ProfileController', ['$location', '$window', '$stateParams', 'ProfileService', 'AuthenticationService',
        'UserService', '$cookies', '$http', '$state', '$scope',
        function ProfileCtrl($location, $window, $stateParams, ProfileService, AuthenticationService, UserService, $cookies, $http, $state, $scope) {
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


            // gdy nie ma loginu w adresie -> wyświetl profil zalogowanego usera
            if(loginToDisplay === '') {
                loginToDisplay = user.login;
                if(loginToDisplay == user.login){   // w razie czego double check
                    vm.canEditProfile=true;
                }
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


            vm.removeUser = function(){
                jQuery('#removeUser').on('hidden.bs.modal', function () {
                    $http.delete(baseUrl + /user/ + loginToDisplay).success(function(data){
                        console.log('function(data): '+ data );
                        UserService.logOut();
                    }).error(function(data, status){
                        console.log('function(data, status): '+ data + " status: " + status);
                    });
                    $state.go('index');
                });
            };
        }
    ]);
});