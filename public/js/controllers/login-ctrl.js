/**
 * Created by Pawel on 2015-10-28.
 */

define(['./module'], function (controllers) {
    'use strict';


    controllers.factory('AuthenticationService', function() {
        var auth = {
            isLogged: false
        }

        function set(flag) {
            auth.isLogged = flag;
        }
        function get() {
            return auth.isLogged;
        }

        return {
            set: set,
            get: get
        }

    });

    controllers.factory('UserService', function($http) {
        return {
            logIn: function(username, password) {
                return $http.post("http://localhost:3000" + '/login', {login: username, password: password});
            },

            logOut: function() {

            }
        }
    });


/*odnosze sie do zlego scopa
* osobno tworzony jest kontroler login-ctrl w index.html, a osobno dla partial/login.html
* */


    controllers.controller('LoginController', ['$scope', '$location', '$window', 'UserService', 'AuthenticationService',
        function LoginCtrl($scope, $location, $window, UserService, AuthenticationService){
        $scope.nazwa = "AAAAA";

        $scope.credsOk = true;
        $scope.logIn = function logIn(username, password) {
            if (username !== undefined && password !== undefined) {

                UserService.logIn(username, password).success(function(data) {
                    if(data.success){
                        //AuthenticationService.isLogged = true;
                        AuthenticationService.set(true);
                        $window.sessionStorage.token = data.token;
                        $location.path("/");
                    }
                    else{
                        $scope.credsOk = false;
                    }
                    console.log(data);
                }).error(function(status, data) {
                    console.log(status);
                    console.log(data);
                });
            }
        }


        $scope.logout = function logout() {
            if (AuthenticationService.get()) {
                AuthenticationService.set(false);
                delete $window.sessionStorage.token;
                $location.path("/");
            }
        }



    }]);
});