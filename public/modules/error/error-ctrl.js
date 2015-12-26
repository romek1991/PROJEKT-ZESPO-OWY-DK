/**
 * Created by Michal Kozakiewicz
 */
 
define(['./../module'], function (controllers) {
  'use strict';
  
  controllers.controller('ErrorController', ['$location', '$window', '$stateParams', 'TripService', 'AuthenticationService', '$cookies', '$state',
    function ErrorCtrl($location, $window, $stateParams, TripService, AuthenticationService, $cookies, $state) {
      var vm = this;
      console.log($stateParams);
      
    }  
  ]);
});