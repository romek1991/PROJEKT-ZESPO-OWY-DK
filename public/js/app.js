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
    'lightbox'
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
        'ui.bootstrap'
    ])

});