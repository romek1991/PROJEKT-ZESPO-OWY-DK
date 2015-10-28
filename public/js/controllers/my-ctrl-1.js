define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('MyCtrl1', ['$scope', function ($scope) {
        alert("aaa");
        $scope.name = "aaa";



    }]);
});