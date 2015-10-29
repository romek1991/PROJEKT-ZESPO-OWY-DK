require.config({
    paths: {
        'angular' : '../bower_components/angular/angular',
        'domReady' : '../bower_components/requirejs-domready/domReady',
        //'ngResource': '../bower_components/angular-resource/angular-resource',
        'ngRoute': '../bower_components/angular-route/angular-route',
        'ngCookies': '../bower_components/angular-cookies/angular-cookies',
        //'ngProgressLite': '../bower_components/ngprogress-lite/ngprogress-lite'
    },
    shim: {
        ngRoute: {
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
        }
    },
    //baseUrl: '/js'
    deps: ['./bootstrap']
});

/*require(['app'], function (app) {
    app.init();
});*/
