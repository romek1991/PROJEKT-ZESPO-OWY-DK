/**
 * Created by Michal Kozakiewicz
 */
 
define(['./../module'], function (controllers) {
  'use strict';
  
  controllers.factory('TripService', function($http) {
    var baseUrl = "http://localhost:3000";
    return {
      getComments: function(tripId, token) {
        return $http.get(baseUrl + '/trip/' + tripId + '/comments', {
          headers: {
            'x-access-token': token
          }
        });
      },
      
      addComment: function(tripId, commentText, token) {
        console.log(tripId + ' ' + commentText + ' ' + token);
        return $http.post(baseUrl + '/trip/' + tripId + '/comment', {
          'text': commentText,
          headers: {
            'x-access-token': token
          }
        });
      }
    }
  });

  controllers.controller('TripController', ['$location', '$window', '$stateParams', 'TripService', 'AuthenticationService', '$cookies',
    function TripCtrl($location, $window, $stateParams, TripService, AuthenticationService, $cookies) {
      var vm = this;
      console.log("trip controller");
      
      var token = $cookies.get('token');
      var tripId = '5647e897572538ec27750e0c';
      
      var refreshComments = function() {
        TripService.getComments(tripId, token).success(function(data) {            
          vm.comments = data.comments;
          console.log(vm.comments);
        }).error(function(status, data){
          console.log('error with comments: ' + status)
          vm.userNotFound = null;
        });
      }
      
      vm.addComment = function() {
        if(vm.newCommentText) {
          TripService.addComment(tripId, vm.newCommentText, token).success(function(data) {
            console.log('comment added');
            vm.newCommentText = '';
            refreshComments();
          }).error(function(data){
            console.error(data)
          });
        }
      }
      
      refreshComments();
      
    }
    
  ]);
});