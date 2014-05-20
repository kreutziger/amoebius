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
