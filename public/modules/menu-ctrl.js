define(['./module'], function (controllers) {
    'use strict';

    controllers.controller('MenuCtrl', ['AuthenticationService', 'UserService', '$cookies', '$scope', '$state',
        function (AuthenticationService, UserService, $cookies, $scope, $state) {
        var mCtrl = this;

        mCtrl.getUser = function(){return JSON.parse($cookies.get('user'));}

        if(!(typeof $cookies.get('token') === 'undefined')){
            AuthenticationService.setLoggedInFlag(true);
            mCtrl.user = mCtrl.getUser();
            AuthenticationService.setUser(mCtrl.user);
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