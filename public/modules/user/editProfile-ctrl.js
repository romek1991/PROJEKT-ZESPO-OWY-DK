define(['./../module'], function (controllers) {
    'use strict';
    controllers.controller('ProfileEditController', ['ProfileService', 'AuthenticationService',
        'UserService', '$cookies', '$http', '$state',
        function ProfileCtrl(ProfileService, AuthenticationService, UserService, $cookies, $http, $state) {
            console.log('editProfile controller');
            
            var vm = this;

            var token = $cookies.get('token');
            vm.token = token;
            var user = AuthenticationService.getUser();

            vm.login = user.login;
            vm.email = user.email;
            vm.firstName = user.firstName;
            vm.lastName = user.lastName;

            vm.updateProfile = function() {
              ProfileService.updateProfile(vm.login, vm.email, vm.firstName, vm.lastName);
            }
            
            vm.resetAvatar = function() {
              ProfileService.resetAvatar(vm.login, token);
              $state.go('app.profile');
            }
        }
    ]);
});