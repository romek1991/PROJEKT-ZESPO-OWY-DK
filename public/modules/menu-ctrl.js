define(['./module'], function (controllers) {
    'use strict';

    controllers.controller('MenuCtrl', ['AuthenticationService', 'UserService', '$cookies', '$scope', '$state',
        function (AuthenticationService, UserService, $cookies, $scope, $state) {
        var mCtrl = this;

        if(!(typeof $cookies.get('token') === 'undefined')){
            AuthenticationService.setLoggedInFlag(true);
            var user = JSON.parse($cookies.get('user'));
            console.log('zmartwychwstanie: ' + user);
            AuthenticationService.setUser(user);
            mCtrl.user = user;
        }



        $scope.$watch(function(){return AuthenticationService.getLoggedInFlag()},
            function(value){
                mCtrl.isLogged = value;
            }
        );


        mCtrl.logout = function () {
            UserService.logOut();
        };


    }]);
});