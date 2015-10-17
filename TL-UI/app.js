define([
    'angular',
    './modules/index',
    './directives/index',
    './filters/index',
    './services/index'
], function (ng) {
    'use strict';

    return ng.module('app', [
        'app.services',
        'app.modules',
        'app.filters',
        'app.directives'
    ]);
});
