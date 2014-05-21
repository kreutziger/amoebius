function LoginCtrl($scope, $http) {

}

function CreateCtrl($scope, $http) {

}

function StickerCtrl($scope, $stateParams) {
    $scope.id = $stateParams.id;
}

function DeleteCtrl($scope, $http, $stateParams) {
    $http.get('/api/doc/' + $stateParams.id).success(function(data) {
        $scope.doc = data.doc;
    });
}

function LinkCtrl($scope, $http, $stateParams) {
    $http.get('/api/doc/' + $stateParams.id).success(function(data) {
        $scope.doc = data.doc;
    });
}

function EditCtrl($scope, $http, $stateParams) {
    $http.get('/api/doc/' + $stateParams.id).success(function(data) {
        $scope.doc = data.doc;
    });
}

function ViewCtrl($scope, $http, $stateParams, $q) {
    $scope.doc = $http.get('/api/doc/' + $stateParams.id, {cache: false});
    $scope.users = $http.get('/api/linked_users/' + $stateParams.id, {cache: false});
    $q.all([$scope.doc, $scope.users]).then(function(values) {
        $scope.doc = values[0].data.doc;
        if (values[1].data.linked_message) {
            $scope.linked_message = values[1].data.linked_message;
        } else {
            $scope.linked_users = values[1].data.linked_users;
        }
    });
//    $http.get('/api/doc/' + $stateParams.id).success(function(data) {
//        $scope.doc = data.doc;
//    });
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
