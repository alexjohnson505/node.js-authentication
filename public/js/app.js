
var app = angular.module("PassportApp", ["ngRoute"]);

app.config(function($routeProvider, $httpProvider) {
    $routeProvider
      .when('/home', {
          templateUrl: 'views/home/home.html'
      })
      .when('/courses', {
          templateUrl: 'views/courses/courses.html',
          controller: 'CoursesCtrl',
      })
      .when('/user', {
          templateUrl: 'views/user/user.html',
          controller: 'UserCtrl',
          resolve: {
              loggedin: checkLoggedin
          }
      })
      .when('/login', {
          templateUrl: 'views/login/login.html',
          controller: 'LoginCtrl'
      })
      .when('/register', {
          templateUrl: 'views/register/register.html',
          controller: 'RegisterCtrl'
      })
      .otherwise({
          redirectTo: '/home'
      });
});

var checkLoggedin = function($q, $timeout, $http, $location, $rootScope){
    var deferred = $q.defer();

    $http.get('/loggedin').success(function(user){
        $rootScope.errorMessage = null;
        // User is Authenticated
        if (user !== '0'){
            $rootScope.currentUser = user;
            deferred.resolve();
        }
        // User is Not Authenticated
        else {
            $rootScope.errorMessage = 'You need to log in.';
            deferred.reject();
            $location.url('/login');
        }
    });
    
    return deferred.promise;
};

app.factory('courses', function courseFactory($http) {
    return {

        // GET
        get : function(callback){

            $http.get("/api/course")

            .success(function(courses){
                callback(courses);
            })
            .error(function(){
                alert("API Error in removing course");
            })
        },

        // DELETE
        delete : function(index, callback){
            $http.delete('/api/course/' + index)
            .success(function(courses){
               callback(courses);
            })
            .error(function(){
                alert("API Error in removing course");
            })
        },

        // PUT
        put : function(id, course, callback){
            $http.put('/api/course/' + id, course)
            .success(function(courses){
                callback(courses);
            })
            .error(function(){
                alert("API Error in updating course");
            })
        },

        // POST
        post : function(course, callback){

            // Convert array to object
            // (Makes Node happier).
            var course = {
                name : course['name'],
                category : course['category'],
                dateCreated : course['dateCreated'],
                description : course['description'],
            }

            $http.post('/api/course', course)
            .success(function(courses){
                callback(courses)
            })
            .error(function(){
                alert("API Error in adding course");
            })
        }
    }
});
