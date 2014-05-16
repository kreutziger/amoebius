angular.module('amoebius', ['ui.router']).
    config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider.
        state('login', {
            url: '/login',
            templateUrl: 'partials/login',
            controller: 'LoginCtrl',
            onEnter: function() {
                console.log('entered login');
            }
        });
    }]);
