/**
 * Created by Pawel on 2015-10-28.
 */

define(['./../module'], function (controllers) {
    'use strict';

    // controllers.factory('TokenInterceptor', function ($q, $window, $location, AuthenticationService, $cookies) {
        // return {

            // request: function (config) {
               // alert($cookies.get('token'));
                // config.headers = config.headers || {};
                // if ($cookies.get('token')) {

                    // config.headers['x-access-token'] = $cookies.get('token');
                // }
                // return config;
            // },

            // requestError: function(rejection) {
                // return $q.reject(rejection);
            // },

        // };
    // });


    // controllers.factory('AuthenticationService', function() {
        // var auth = {
            // isLogged: false
        // }

        // function set(flag) {
            // auth.isLogged = flag;
        // }
        // function get() {
            // return auth.isLogged;
        // }

        // return {
            // setIsLogged: set,
            // getIsLogged: get
        // }

    // });

//
    // controllers.factory('UserService', function($http) {
        // var baseUrl = "http://localhost:3000";
        // return {

            // register: function(username, password) {
                // return $http.post(baseUrl + '/signup', {
					
					
					// "login": username				
					// "password": password
					// "email":email
					// "firstName":firstName
					// "lastName":lastName				
					
					
					// });
            // },

            // logOut: function() {

            // },

            // getUsers: function(){
                // return $http.get(baseUrl + '/users');
            // }

        // }
    // });


    controllers.controller('RegisterController', ['$location', '$window', 'UserService', 'AuthenticationService',
        '$cookies',
        function LoginCtrl($location, $window, UserService, AuthenticationService, $cookies){
		var vm = this;
		
		vm.register = function(login, password, email, firstName, lastName){
			if(login !== undefined && password !== undefined && email !== undefined && firstName !== undefined && lastName
			!== undefined){
				UserService.register(login, password, email, firstName, lastName).success(function(data){
					
						alert("Dziala");
						//tu mam  wziasc ktory service?
						//w sumie tu nic nie trzeba robic wg mnie, bo to tylko rejestracja. wysylasz dane, a serwer
						//sam wie co zrobic.// to jak je wyslac
						// musisz powiazac to z widokiem (ten kontroler). dane sie wysla jak klikniesz przycisk w rejestarcji xd
					// tu jak sie uda.
					// w data jest odpowiedz z serwera
				}).error(function(status, data){
					// tu kod jak sie post nie uda
					
				});
			}
			
		}
       

    }]);
});