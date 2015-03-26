app.controller('CoursesCtrl', function($scope, $http, courses){

    // Local variable for course list
    $scope.courses = [];

    // Local variable for the current
    // active course (edit or new)
    $scope.course = {};

    // initialize course list from server
    courses.get(function(courses){
        $scope.courses = courses;
    });

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

    // Open edit modal
    $scope.openEdit = function(index){
        $scope.activeTitle = "Edit Course";
        
        $scope.course = courses[index];
        
        $("#editModal").modal()
    }

    // Open create modal
    $scope.openNew = function(){
        $scope.activeTitle = "Create New Course";
        $scope.course = [];
        $("#editModal").modal()
    }

    // Save a course
    $scope.save = function(course){
        cons

    }

});