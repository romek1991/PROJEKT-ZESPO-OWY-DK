/**
 * Created by Pawel on 2015-10-28.
 */

define(['./../module'], function (controllers) {
    'use strict';

    controllers.factory('TokenInterceptor', function ($q, $window, $location, AuthenticationService, $cookies) {
        return {

            request: function (config) {
                //alert($cookies.get('token'));
                config.headers = config.headers || {};
                if ($cookies.get('token')) {

                    config.headers['x-access-token'] = $cookies.get('token');
                }
                return config;
            },

            requestError: function(rejection) {
                return $q.reject(rejection);
            },

        };
    });


    controllers.factory('AuthenticationService', function() {
        var auth = {
            user: null
        }

        function set(user) {
            auth.user = user;
            console.log('auth.user:' + auth.user);
        }
        function get() {
            return auth.user;
        }

        return {
            setUser: set,
            getUser: get
        }

    });


    controllers.factory('UserService', function($http) {
        var baseUrl = "http://localhost:3000";
        return {

            logIn: function(username, password) {
                return $http.post(baseUrl + '/login', {"login": username, "password": password});
            },

            register: function(login, password, email, firstName, lastName ) {
                return $http.post(baseUrl + '/signup', {

                        //login, password, email,name ,surname
                        "login": login,
                        "password": password,
                        "email":email,
                        "firstName":firstName,
                        "lastName":lastName

                    }
                );
            },

            logOut: function() {

            },

            getUsers: function(){
                return $http.get(baseUrl + '/users');
            }

        }
    });


    controllers.controller('LoginController', ['$location', '$window', 'UserService', 'AuthenticationService',
        '$cookies',
        function LoginCtrl($location, $window, UserService, AuthenticationService, $cookies){

            var vm = this;
            alert("login controller");
            vm.credsOk = true;
            vm.logIn = function logIn(username, password) {
                alert("costam");
                if (username !== undefined && password !== undefined) {
                    UserService.logIn(username, password).success(function(data) {
                        AuthenticationService.setUser(data.login);
                        $cookies.put('token', data.token);
                        $cookies.put('login', data.login);
                    }).error(function(data, status) {
                        console.log(status + ': ' + data.message);
                    });
                } else {
                    vm.credsOk = false;
                }
            }


            vm.logout = function logout() {
                vm.credsOk = true;
                if (AuthenticationService.getUser()) {
                    AuthenticationService.setUser(null);
                    //alert("Logging out");
                    $cookies.remove('token');
                    $cookies.remove('user');
                    $location.path("/");
                }
            };


            vm.getUsers = function logout() {
                UserService.getUsers().success(function(data){
                    console.log(data);

                });

            }
        }]);
});