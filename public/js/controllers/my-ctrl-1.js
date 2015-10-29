define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('MyCtrl1', ['$scope', '$location', function ($scope, $location) {

        $scope.name = "XXXXXX";
        alert($scope.name);



    }]);
});