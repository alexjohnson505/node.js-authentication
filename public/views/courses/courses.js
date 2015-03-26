app.controller('CoursesCtrl', function($scope, $http, courses){

    $scope.courses = [];

    // Load courses
    courses.get(function(courses){
        $scope.courses = courses;
    });

    //    $scope.add({name : "Node", dateCreated : "10/12", category : "urple", description : "what"})

    $scope.delete = function(index){
        courses.delete(index, function(courses){
           $scope.courses = courses; 
        })
    }
    
    $scope.update = function(course){
        courses.put(course, function(courses){
           $scope.courses = courses; 
        })
    }
    
    $scope.add = function(course){
        courses.post(course, function(courses){
            $scope.courses = courses; 
        });
    }
    

    /********
        UI 
     ********/


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