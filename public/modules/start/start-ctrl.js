/**
 * Created by Michal Kozakiewicz
 */
 
define(['./../module'], function (controllers) {
    'use strict';

    controllers.controller('StartController', ['$location', '$window', '$stateParams', 'ProfileService', 'AuthenticationService', '$cookies',
        function ProfileCtrl($location, $window, $stateParams, ProfileService, AuthenticationService, $cookies) {
          var vm = this;
          console.log("profile controller");
          
          var token = $cookies.get('token');
          
      }
    ]);
});