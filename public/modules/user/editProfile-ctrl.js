define(['./../module'], function (controllers) {
    'use strict';
    controllers.controller('ProfileEditController', ['ProfileService', 'AuthenticationService',
        'UserService', '$cookies', '$http', '$state', 'Upload', "$rootScope",
        function ProfileCtrl(ProfileService, AuthenticationService, UserService, $cookies, $http, $state, Upload, $rootScope) {
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
				if (vm.firstName && vm.lastName)
                ProfileService.updateProfile(user.id, vm.login, vm.email, vm.firstName, vm.lastName, token).
                success(function(){
                        user.email = vm.email;
                        user.firstName = vm.firstName;
                        user.lastName = vm.lastName;
                   AuthenticationService.setUser(user);
				   
				   $state.go('app.profile', {
						userDataUpdateSuccess: true
					});
                }).error(function(data) {
					vm.userDataUpdateFailed = true;
				});
                //$state.go($state.current, {}, {reload: true});
                

                        /*var cookieUser = JSON.parse($cookies.get('user'));

                        cookieUser.firstName = vm.firstName;
                        cookieUser.lastName = vm.lastName;

                        $cookies.put('user', JSON.stringify(cookieUser));
                        $rootScope.$$childTail.$$childTail.mCtrl.getUser();*/
                });

                $state.go('app.profile');
            };
            
            vm.resetAvatar = function() {
              ProfileService.resetAvatar(vm.login, token);
              $state.go('app.profile');
            };




            vm.uploadAvatar = function() {
                console.log("test:");
                console.log(vm.file);
                console.log(vm.tripIdent);
                Upload.upload({
                    url: 'http://localhost:3000/photo/avatar',
                    data: {username: vm.login, token: vm.token, avatar: vm.file},
                    method: 'POST'
                }).then(function (resp) {
                    console.log('Success ');
                }, function (resp) {
                    console.log('Error status: ' + resp.status);
                }, function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ');
                });
            }

        }
    ]);
});