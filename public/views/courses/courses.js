app.controller('CoursesCtrl', function($scope, $http, $filter, courses){

    // Local variable for course list
    $scope.courses = [];

    // Local variable for the current
    // active course (edit or new)
    $scope.course = {};

    // The last selected ID.
    // null, equals a course is being created
    $scope.selectedCourseId = -1;

    // initialize course list from server
    courses.get(function(courses){
        $scope.courses = courses;
    });

    /*****************
            UI 
     *****************/

    // Open edit modal
    $scope.openEdit = function(index){

        // Selected ID
        $scope.selectedCourseId = index;

        // Update Model Title
        $scope.activeTitle = "Edit Course";
        
        // Copy course to memory
        $scope.course = angular.copy($scope.courses[index]);

        $("#editModal").modal()
    }

    // Open create modal
    $scope.openNew = function(){

        $scope.selectedCourseId = -1;

        $scope.activeTitle = "Create New Course";

        $scope.course = [];

        $("#editModal").modal()
    }

    // Save a course
    $scope.save = function(course){

        var id = $scope.selectedCourseId;
        
        // Edit
        if (id > -1){

            // Update existing course
            $scope.update(id, course);
        
        // New
        } else {

            // Generate today's date
            course.dateCreated = $filter('date')(new Date(), 'MM/dd/yyyy');

            // Add new course
            $scope.add(course)
        }

        // Close modal when done
        $("#editModal").modal("hide");

    }

    /*****************
           CRUD
     *****************/

    $scope.delete = function(index){

        if (!confirm("Delete this course?")) return;

        courses.delete(index, function(courses){
           $scope.courses = courses; 
        })
    }
    
    $scope.update = function(id, course){
        courses.put(id, course, function(courses){
           $scope.courses = courses; 
        })
    }
    
    $scope.add = function(course){
        courses.post(course, function(courses){
            $scope.courses = courses; 
        });
    }

});