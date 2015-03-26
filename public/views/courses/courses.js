app.controller('CoursesCtrl', function($scope, $http){
    
    $scope.courses = [];

    $http.get("/api/course")
    .success(function(courses){
        $scope.courses = courses;
    });
    
    $scope.remove = function(index){
        $http.delete('/api/course/' + index)
        .success(function(courses){
           $scope.courses = courses; 
        })
        .error(function(){
            alert("API Error in removing course");
        })
    }
    
    $scope.update = function(course){
        $http.put('/api/course/'+course._id, course)
        .success(function(courses){
            $scope.courses = courses; 
        })
        .error(function(){
            alert("API Error in updating course");
        })
    }
    
    $scope.add = function(course){
        $http.post('/api/course', course)
        .success(function(courses){
            $scope.courses = courses; 
        })
        .error(function(){
            alert("API Error in adding course");
        })
    }
    
    $scope.edit = function(course){
        $scope.course = course;
    }

    $scope.addCourse = function(){
        $("#editModal").modal()
    }

    $scope.test = function(){
        alert("wtf")
    }
});