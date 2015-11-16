define(['./module'], function (controllers) {
    'use strict';

    controllers.controller('MenuCtrl', function ($cookies) {
        var mCtrl = this;
        mCtrl.isLogged = $cookies.get('token');

        mCtrl.logout = function logout() {
            if ($cookies.get('token')) {
                $cookies.remove('token');
            }
        };

    });
});