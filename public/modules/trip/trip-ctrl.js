/**
 * Created by Michal Kozakiewicz
 */
 
define(['./../module'], function (controllers) {
    'use strict';

    controllers.controller('TripController', ['$location', '$window', '$stateParams', 'ProfileService', 'AuthenticationService', '$cookies',
        function ProfileCtrl($location, $window, $stateParams, ProfileService, AuthenticationService, $cookies) {
          var vm = this;
          console.log("trip controller");
          
          var token = $cookies.get('token');
          
      }
    ]);
});