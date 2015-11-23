/**
 * Created by Michal Kozakiewicz
 */
 
define(['./../module'], function (controllers) {
    'use strict';

    controllers.controller('StartController', ['$location', '$window', 'AuthenticationService', '$cookies',
        function StartCtrl($location, $window, AuthenticationService, $cookies) {
            var vm = this;
            console.log("start controller");
            
            var token = $cookies.get('token');
            var user = AuthenticationService.getUser();
            console.log(user.firstName);

            vm.firstName = user.login;
          
        }
    ]);
});