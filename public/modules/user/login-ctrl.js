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

        var log = {
            loggedInFlag: false
        }

        function set(user) {
            auth.user = user;
            console.log('auth.user:' + auth.user);
        }
        function get() {
            return auth.user;
        }

        function setLoggedIn(flag){
            log.loggedInFlag = flag;
            console.log('set logged in flag: ' + log.loggedInFlag);
        }

        function getLoggedIn() {
            console.log('get logged in flag: ' + log.loggedInFlag);
            return log.loggedInFlag;
        }

        return {
            setUser: set,
            getUser: get,
            setLoggedInFlag: setLoggedIn,
            getLoggedInFlag: getLoggedIn
        }

    });


    controllers.factory('LoginFlagService', function()    {

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
        '$cookies', '$state',
        function LoginCtrl($location, $window, UserService, AuthenticationService, $cookies, $state){

            var vm = this;
            //alert("login controller");
            vm.credsOk = true;
            vm.logIn = function logIn(username, password) {
                //alert("costam");
                if (username !== undefined && password !== undefined) {
                    UserService.logIn(username, password).success(function(data) {
                        AuthenticationService.setUser(data.login);
                        AuthenticationService.setLoggedInFlag(true);
                        $cookies.put('token', data.token);
                        $cookies.put('login', data.login);
                        $state.go('app');
                    }).error(function(data, status) {
                        vm.credsOk = false;
                        console.log(data);
                        console.log(status + ': ' + data.message);
                    });
                }
            }


            vm.logout = function(){
                vm.credsOk = true;
                if (AuthenticationService.getUser()) {
                    AuthenticationService.setUser(null);
                    AuthenticationService.setLoggedInFlag(false);
                    //alert("Logging out");
                    $cookies.remove('token');
                    $cookies.remove('user');
                    $location.path("/");
                }
            };


            vm.getUsers = function() {
                UserService.getUsers().success(function(data){

                    console.log(data);

                });

            }
        }]);
});