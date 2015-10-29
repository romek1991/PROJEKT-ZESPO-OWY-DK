define([
    'require',
    'angular',
    'app',
    'routes'
], function (require, ng, app) {
    'use strict';
    require(['domReady!'], function (document) {
        app.config(function ($httpProvider) {
            $httpProvider.interceptors.push('TokenInterceptor');
        });
        ng.bootstrap(document, ['app']);
    });
});