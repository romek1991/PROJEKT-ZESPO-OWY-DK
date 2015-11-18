define(['./module'], function (controllers) {
    'use strict';

    controllers.controller('MenuCtrl', function ($cookies) {
        var mCtrl = this;

        mCtrl.isLogged = $cookies.get('token');
        mCtrl.isLogged = false;
        mCtrl.logout = function logout() {
            if ($cookies.get('token')) {
                $cookies.remove('token');
                $cookies.remove('login');
            }
        };

    });
});