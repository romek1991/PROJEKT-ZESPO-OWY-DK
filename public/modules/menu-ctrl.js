define(['./module'], function (controllers) {
    'use strict';
    
    controllers.factory('SearchService', function($http) {
        var baseUrl = "http://localhost:3000";
        return {

            searchUsers: function(searchString, token) {
                var users = $http.post(baseUrl + '/user/search/', {
                    'searchString': searchString,
                    headers: {
                        'x-access-token': token
                    }
                });
                return users;
            },
            
            searchTrips: function(searchString, token) {
                var trips = $http.post(baseUrl + '/trip/search/', {
                    'searchString': searchString,
                    headers: {
                        'x-access-token': token
                    }
                });
                return trips;
            }

        }
    });

    controllers.controller('MenuCtrl', ['AuthenticationService', 'UserService', 'SearchService', '$cookies', '$scope', '$state',
        function (AuthenticationService, UserService, SearchService, $cookies, $scope, $state) {
        var mCtrl = this;
        var token = $cookies.get('token');
        
        mCtrl.searchString = "";
        mCtrl.foundUsers = null;
        mCtrl.foundTrips = null;

        mCtrl.firstName = "";
        mCtrl.lastName = "";


        mCtrl.getUser = function(){
            var user = JSON.parse($cookies.get('user'));
            mCtrl.firstName = user.firstName;
            mCtrl.lastName = user.lastName;
            return user;
        };

        if(!(typeof(token) === 'undefined')){
            AuthenticationService.setLoggedInFlag(true);
            mCtrl.user = mCtrl.getUser();
            AuthenticationService.setUser(mCtrl.user);
        }
        
        $scope.$watch(function(){return AuthenticationService.getLoggedInFlag()},
            function(value){
                mCtrl.isLogged = value;
            }
        );

        $scope.$watch('mCtrl.searchString', function() {
            mCtrl.foundUsers = null;
            mCtrl.foundTrips = null;
            
            if (mCtrl.isLogged) {
                SearchService.searchUsers(mCtrl.searchString, token).success(function(data){


                    console.log(data);
                    for (var i = 0; i < data.length; i++){
                        data[i].avatarName = data[i].login + "?" + new Date().getTime();
                    }

                    mCtrl.foundUsers = data;

                });
                
                SearchService.searchTrips(mCtrl.searchString, token).success(function(data){
                    mCtrl.foundTrips = data;
                });
              
            }
            
        });

        mCtrl.logout = function () {
            UserService.logOut();
        };


    }]);
});