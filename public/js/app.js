angular.module('amoebius', ['ui.router']).
    config(['$stateProvider', '$urlRouterProvier',
        function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    }]);
