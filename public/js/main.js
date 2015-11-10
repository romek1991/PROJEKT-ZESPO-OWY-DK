require.config({
    paths: {
        'angular' : '../bower_components/angular/angular',
        'domReady' : '../bower_components/requirejs-domready/domReady',
        //'ngRoute': '../bower_components/angular-route/angular-route',
        'ui.router' : '../bower_components/angular-ui-router/release/angular-ui-router',
        'ngCookies': '../bower_components/angular-cookies/angular-cookies'
        //'ngProgressLite': '../bower_components/ngprogress-lite/ngprogress-lite'
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
        }
    },
    //baseUrl: '/js'
    deps: ['./bootstrap']
});

/*require(['app'], function (app) {
    app.init();
});*/
