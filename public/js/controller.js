function LoginCtrl($scope, $http) {

}

function CreateCtrl($scope, $http) {

}

function MenuCtrl($scope, $http) {
    $http.get('/api/own_docs').success(function(data) {
        if (data === 'docs') {
            $scope.docs = data.own_docs;
        } else {
            $scope.own_message = data.own_message;
        }
    });
    $http.get('/api/other_docs').success(function(data) {
        if (data === 'docs') {
            $scope.docs = data.own_docs;
        } else {
            $scope.other_message = data.other_message;
        }
    });
}
