/**
 * Created by Pawel on 2015-10-28.
 */

define(['./module'], function (controllers) {
    'use strict';


controllers.controller('LoginStateController', ['$scope', '$location', '$window', 'UserService', 'AuthenticationService',
    function LoginCtrl($scope, $location, $window, UserService, AuthenticationService){

        alert("LoginStateController");
        $scope.loggedInFlag = AuthenticationService.isLogged;

        $scope.$watch(function () { return AuthenticationService.get(); },
            function (value) {
                $scope.loggedInFlag = value;
            }
        );


    }]);



});