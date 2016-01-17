require.config({
    paths: {
        'angular' : '../bower_components/angular/angular',
        'domReady' : '../bower_components/requirejs-domready/domReady',
        //'ngRoute': '../bower_components/angular-route/angular-route',
        'ui.router' : '../bower_components/angular-ui-router/release/angular-ui-router',
        'ngCookies': '../bower_components/angular-cookies/angular-cookies',
        //'ngProgressLite': '../bower_components/ngprogress-lite/ngprogress-lite'
        'ngFileUpload': '../bower_components/ng-file-upload/ng-file-upload',
        'ui.bootstrap': '../bower_components/angular-bootstrap/ui-bootstrap',
        'jquery': '../bower_components/jquery/dist/jquery',
        'lightbox': '../bower_components/lightbox2/dist/js/lightbox',
        'angular-md5': '../bower_components/angular-md5/angular-md5',
        'bootstrap-datepicker': '../bower_components/bootstrap-datepicker/dist/js/bootstrap-datepicker',
        'bootstrap-minified': '../js/bootstrap.min',
        'scripts': '../js/scripts'

    },
    shim: {
 /*       ngRoute: {
            deps: ['angular'],
            exports: 'angular'
        },*/
        'ui.router':{
            deps: ['angular'],
            exports: 'angular'
        },
        ngCookies: {
            deps: ['angular']
        },
        /*
        ngProgress: {
            deps: ['angular'],
            exports: 'angular'
        },*/
        angular: {
            exports : 'angular'
        },
        ngFileUpload: {
            deps: ['angular']
        },
        'ui.bootstrap': {
            deps: ['angular']
        },
        'angular-md5': {
            deps: ['angular']
        },
        'scripts': {
            deps: ['jquery']
        },
        'bootstrap-minified':{
            deps:['jquery']
        }

    },
    //baseUrl: '/js'
    deps: ['./bootstrap']
});

/*require(['app'], function (app) {
    app.init();
});*/
