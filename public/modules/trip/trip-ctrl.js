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
      
      getTrip: function(tripId, token) {
        return $http.get(baseUrl + '/trip/' + tripId, {
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
      },
      
      addTrip: function(name, description, publicAccess, token) {
        console.log(name + ' ' + description + ' ' + token);
        return $http.post(baseUrl + '/trip', {
          'name': name,
          'description': description,
          'publicAccess': publicAccess,  //todo : pozniej do parametru
          headers: {
            'x-access-token': token
          }
        });
      },

      updateTrip: function(id,name, description, publicAccess, token) {
        console.log(name + ' ' + description + ' ' + token);
        console.log("UPDATE");
        console.log(publicAccess);
        return $http.put(baseUrl + '/trip/', {
          'id': id,
          'name': name,
          'description': description,
          'publicAccess': publicAccess,
          headers: {
            'x-access-token': token
          }
        });
      }
      
    }
  });

  controllers.controller('TripController', ['$location', '$window', '$stateParams', 'TripService', 'AuthenticationService', '$cookies', '$state',
    function TripCtrl($location, $window, $stateParams, TripService, AuthenticationService, $cookies, $state) {
      var vm = this;
      console.log("trip controller");
      
      var token = $cookies.get('token');
      var tripId = $stateParams.tripId;
      var user = AuthenticationService.getUser();

      vm.tripIsEditable = false;
      
      vm.user = user;


      vm.addTrip = function(name, description, publicAccess)  {
        if(name !== undefined && description !== undefined ){
          TripService.addTrip(name, description, publicAccess, token).success(function(data){
            $state.go('app.trip', {
              tripId: data.tripId
            });
          }).error(function(status, data){
            // TODO: dodać w GUI gdy się nie uda
            alert("Błąd przy dodawaniu wycieczki!");
          });
        }
        
      };
      
      var tripToDisplay = $stateParams.tripId;
      
      if(tripToDisplay === ''){
        vm.tripNotFound = true;
      }else if(tripToDisplay){
        TripService.getTrip(tripId, token).success(function(data){
          vm.tripName = data.trip.name;
          vm.tripDescription = data.trip.description;
          vm.tripIdent = tripId;
          vm.publicAccess = data.trip.publicAccess;
          if(data.trip.author === user.id) {
            vm.tripIsEditable = true;
          }
          else{
            vm.tripIsEditable = false;
          }
          refreshComments();
        }).error(function(data){
          console.log('ERROR on get trip');

          $state.go('app.error', {
            message: "Brak dostępu do wycieczki!"
          });
        });
      }
      
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
      };

      

      vm.updateTrip = function(){
        console.log("UPDATE");
        TripService.updateTrip(tripId, vm.tripName, vm.tripDescription, vm.publicAccess, false, token) //todo: jak wdrozymy publiczne/prywatne to parametr publicAccess wycuagnac do UI
          .success(function(data) {
              $state.go('app.start')
        }).error(function(status, data){
          alert("Bład aktualizacji " + status +" data " + data);
        });
      }
    }
    
  ]);
});