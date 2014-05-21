angular.module('amoebius', ['ui.router']).
    config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider.
        state('/', {
            url: '/',
            templateUrl: 'partials/menu',
            controller: 'MenuCtrl',
            onEnter: function() {
                console.log('entered menu');
            }
        }).
        state('delete', {
            url: '/delete/:id',
            templateUrl: 'partials/delete',
            controller: 'DeleteCtrl',
            onEnter: function() {
                console.log('entered delete');
            }
        }).
        state('sticker', {
            url: '/sticker/:id',
            templateUrl: 'partials/sticker',
            controller: 'StickerCtrl',
            onEnter: function() {
                console.log('entered sticker');
            }
        }).
        state('edit', {
            url: '/edit/:id',
            templateUrl: 'partials/edit',
            controller: 'EditCtrl',
            onEnter: function() {
                console.log('entered edit');
            }
        }).
        state('view', {
            url: '/view/:id',
            templateUrl: 'partials/view',
            controller: 'ViewCtrl',
            onEnter: function() {
                console.log('entered view');
            }
        }).
        state('link', {
            url: '/link/:id',
            templateUrl: 'partials/link',
            controller: 'LinkCtrl',
            onEnter: function() {
                console.log('entered link');
            }
        }).
        state('create', {
            url: '/create',
            templateUrl: 'partials/create',
            controller: 'CreateCtrl',
            onEnter: function() {
                console.log('entered create');
            }
        }).
        state('login', {
            url: '/login',
            templateUrl: 'partials/login',
            controller: 'LoginCtrl',
            onEnter: function() {
                console.log('entered login');
            }
        });
    }]);
