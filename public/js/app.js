define([
    'angular',
    'ui.router',
    'ngCookies',
    './../modules/index',
    //'./directives/index',
    //'./filters/index',
    //'./services/index'
    'ngFileUpload',
    'ui.bootstrap',
    'lightbox',
    'angular-md5',
    'bootstrap-datepicker'
], function (ng) {
    'use strict';

    return ng.module('app', [
        //'app.services',
        'app.controllers',
        'ngCookies',
        //'app.filters',
        //'app.directives',
        'ui.router',
        'ngFileUpload',
        'ui.bootstrap',
        'angular-md5'
    ])

});