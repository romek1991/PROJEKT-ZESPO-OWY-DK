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
      
      addTrip: function(name, description, startDate, endDate, publicAccess, token) {
		  
		console.log('startDate: ' + startDate);
		console.log('endDate: ' + endDate);

        console.log(name + ' ' + description + ' ' + token );
        return $http.post(baseUrl + '/trip', {
          'name': name,
          'description': description,
          'publicAccess': publicAccess,  //todo : pozniej do parametru,
          'startDate': startDate,
          'endDate': endDate,
          headers: {
            'x-access-token': token
          }
        });
      },




      updateTrip: function(id, name, description, publicAccess, token) {
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
      },

      removeTrip: function(tripId){
        return $http.delete(baseUrl + '/trip/'+tripId,{

        });


      },

      getPhotos: function(tripId, token) {
        console.log("Get photos");
        return $http.get(baseUrl + '/photo/trip/' + tripId, {
          headers: {
            'x-access-token': token
          }
        });
      },

      resolvePhoto: function (photoName, token) {
        return $http.get(baseUrl + '/photo/' + photoName, {
          headers: {
            'x-access-token': token
          }
        });
      },
      
      updatePhoto: function(pic, token) {
        return $http.put(baseUrl + '/photo/', {
          'id': pic._id,
          'name': pic.name,
          headers: {
            'x-access-token': token
          }
        });
      },
      
      deletePhoto: function(pic, token) {
        return $http.delete(baseUrl + '/photo/'+pic._id,{
          headers: {
            'x-access-token': token
          }
        });
      }
      
    }
  });

  controllers.controller('TripController', ['$location', '$window', '$stateParams', 'TripService', 'AuthenticationService', '$cookies', '$state', 'Upload', '$timeout',
    function TripCtrl($location, $window, $stateParams, TripService, AuthenticationService, $cookies, $state, Upload, $timeout) {
      var vm = this;



      var token = $cookies.get('token');
      vm.token = token;
      var tripId = $stateParams.tripId;
      var user = AuthenticationService.getUser();

      vm.tripIsEditable = false;
      
      vm.user = user;
      vm.user.avatarName = vm.user.login + "?" + new Date().getTime();

      vm.photos = [];
      vm.photosToBeUploaded = [];

      //vm.pictures = null;

      vm.updatePhoto = function(pic) {
        TripService.updatePhoto(pic, token).success(function(data){
          alert("Zmieniono nazwę zdjęcia.");
        }).error(function(status, data) {
          alert("Wystąpił błąd podczas zmiany nazwy zdjęcia!");
        });
      }
      
      vm.deletePhoto = function(pic) {
        TripService.deletePhoto(pic, token).success(function(data){
          for (var i in vm.photos) {
            if (pic == vm.photos[i]) {
              console.log('removing i: ' + i);
              vm.photos.splice(i,1);
            }
          }
        }).error(function(status, data) {
          alert("Wystąpił błąd podczas zmiany nazwy zdjęcia!");
        });
      }

      vm.addTrip = function(name, description, startDate, endDate, publicAccess, token)  {
		  var startDate = $("#startDate").val();
		  var endDate = $("#endDate").val();
        if(name !== undefined && description !== undefined && startDate !== undefined && endDate !== undefined){
          TripService.addTrip(name, description, startDate, endDate, publicAccess, token).success(function(data){
            vm.uploadPictures(data.tripId);
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
          vm.startDate = data.trip.startDate;
          vm.endDate = data.trip.endDate;
          vm.createdDate = data.trip.createdDate;
          vm.tripAuthor = data.trip.author;
          vm.tripAuthor.avatarName = data.trip.author.login + "?" + new Date().getTime();

          if(data.trip.author._id === user.id) {
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


        TripService.getPhotos(tripId, token).success(function(data){
/*
          var promises = data.photos;

          promises.forEach(function(element, index, array) {
            TripService.resolvePhoto(element.filename, token).success(function(data){
              vm.photos.push(data);
            }).error(function(data){
              $state.go('app.error', {
                message: "Nie można pobrać zdjęcia!"
              });
            });
          });
*/
          vm.photos = data.photos;

        }).error(function(data){
          $state.go('app.error', {
            message: "Nie można pobrać zdjęć!"
          });
        });
      }
      
      var refreshComments = function() {
        TripService.getComments(tripId, token).success(function(data) {            
          vm.comments = data.comments;
          var comment;
          for (comment in vm.comments){
            //comment.author.avatarName = comment.author.login + "?" + new Date().getTime();
          }
          console.log(vm.comments);
        }).error(function(status, data){
          console.log('error with comments: ' + status)
          vm.userNotFound = null;
        });
      };

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

      vm.removeTrip = function(){
        jQuery('#removeTrip').on('hidden.bs.modal', function() {
          TripService.removeTrip(tripId).success(function () {
                $state.go('index');
              }
          ).error(function () {
                $state.go('app.error', {
                  message: "Nie można usunąć wycieczki!"
                });
              });

        });


      }



      vm.updateTrip = function(){
        console.log("UPDATE");
        TripService.updateTrip(tripId, vm.tripName, vm.tripDescription, vm.publicAccess, token) //todo: jak wdrozymy publiczne/prywatne to parametr publicAccess wycuagnac do UI
          .success(function(data) {
              vm.uploadPictures(vm.tripIdent)
              $state.go('app.start')
        }).error(function(status, data){
          alert("Bład aktualizacji " + status +" data " + data);
        });
      };



////

      vm.submit = function() {
          vm.upload(vm.files);
      };


      vm.upload = function (files) {
        console.log("test:");
        console.log(files);
        console.log(vm.tripIdent);

          //vm.pictures=files;    //zrobilem to tak na razie - dodalem ten panel na UI i moja metoda ma tego timeouta itp
                                // - jak cos zdecydujemy to odkomentujemy. W kazdym razie potrzebowalem metody z parametrem tripId
          //vm.uploadPictures(vm.tripIdent);


        /*Upload.upload({
          url: 'http://localhost:3000/photo',
          arrayKey: '',
          data: {tripId: vm.tripIdent, token: vm.token, photos: files},
          method: 'POST'
        }).then(function (resp) {
          console.log('Success ');
        }, function (resp) {
          console.log('Error status: ' + resp.status);
        }, function (evt) {
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          console.log('progress: ' + progressPercentage + '% ');
        });*/
      };

      vm.uploadPictures = function (tripId) {
        if (vm.photosToBeUploaded && vm.photosToBeUploaded.length) {
          Upload.upload({
              url: 'http://localhost:3000/photo',
              arrayKey: '',
              data: {
                tripId: tripId, token: vm.token, photos: vm.photosToBeUploaded
              },
              method: 'POST'
          }).then(function (response) {
            $timeout(function () {
              vm.result = response.data;
            });
          }, function (response) {
            if (response.status > 0) {
              vm.errorMsg = response.status + ': ' + response.data;
            }
          }, function (evt) {
            vm.progress =
                Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
          });
        }
      };

        vm.removeFromPhotosList = function (index) {
            vm.photosToBeUploaded.splice(index, 1);
      }

    }
    
  ]);
});