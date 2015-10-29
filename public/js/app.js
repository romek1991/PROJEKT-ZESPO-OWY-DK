define([
    'angular',
    'ngRoute',
    'ngCookies',
    './controllers/index'
    //'./directives/index',
    //'./filters/index',
    //'./services/index'
], function (ng) {
    'use strict';

    return ng.module('app', [
        //'app.services',
        'app.controllers',
        'ngCookies',
        //'app.filters',
        //'app.directives',
        'ngRoute'
    ]).config(function ($httpProvider) {
            $httpProvider.interceptors.push('TokenInterceptor');
        });

});