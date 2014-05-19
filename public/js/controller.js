function LoginCtrl($scope, $http) {

}

function CreateCtrl($scope, $http) {

}

function MenuCtrl($scope, $http) {
    $http.get('/api/own_docs').success(function(data) {
        if (data.own_docs) {
            $scope.own_docs = data.own_docs;
        } else {
            $scope.own_message = data.own_message;
        }
    });
    $http.get('/api/other_docs').success(function(data) {
        if (data.other_docs) {
            $scope.other_docs = data.other_docs;
        } else {
            $scope.other_message = data.other_message;
        }
    });
}
