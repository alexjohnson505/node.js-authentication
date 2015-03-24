app.controller("RegisterCtrl", function($scope, $http, $location, $rootScope){
    $scope.register = function(user){

        if(user.password != user.password2 || !user.password || !user.password2){
            $rootScope.message = "Your passwords don't match";
        } else {
            $http.post("/register", user)
            .success(function(response){
            
                if(response != null){
                    $rootScope.currentUser = response;
                    $location.url("/profile");
                }
            });
        }
    }
});
