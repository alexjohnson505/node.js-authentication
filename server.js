var express = require('express');
var app = express();

var bodyParser    = require('body-parser');
var multer        = require('multer'); 
var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cookieParser  = require('cookie-parser');
var session       = require('express-session');
var mongoose      = require('mongoose');

// change ip based on hosting config
var ip     = process.env.OPENSHIFT_NODEJS_IP   || '127.0.0.1';
var port   = process.env.OPENSHIFT_NODEJS_PORT || 3000;
var db_url = process.env.OPENSHIFT_MONGODB_URL || 'localhost/test';

// Open Database Connection
var db = mongoose.connect('mongodb://' + db_url);

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    email: String,
});

var UserModel = mongoose.model('UserModel', UserSchema);

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data
app.use(session({ secret: 'this is the secret' }));
app.use(cookieParser())
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));

app.get("/api/", function(req, res){
    
    // Return courses list
    res.json({ message : "Hello! Welcome to the API.",
               mongo : db_url });
});

// REVEAL FOR TESTING ONLY
// app.get("/env/", function(req, res){

//     // Return courses lis
//     res.json({ message : process.env });
// });

/***************************************
         Authentication
 ***************************************/

passport.use(new LocalStrategy(
function(username, password, done){
    UserModel.findOne({username: username, password: password}, function(err, user){
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        return done(null, user);
    })
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

app.post("/login", passport.authenticate('local'), function(req, res){
    var user = req.user;
    res.json(user);
});

app.get('/loggedin', function(req, res){
    res.send(req.isAuthenticated() ? req.user : '0');
});
    
app.post('/logout', function(req, res){
    req.logOut();
    res.send(200);
});     

app.post('/register', function(req, res){
    var newUser = req.body;
    newUser.roles = ['student'];
    UserModel.findOne({username: newUser.username}, function(err, user){
        if(err) { return next(err); }
        if(user){
            res.json(null);
            return;
        }
        var newUser = new UserModel(req.body);
        newUser.save(function(err, user){
            req.login(user, function(err){
                if(err) { return next(err); }
                res.json(user);
            });
        });
    });
});

var auth = function(req, res, next){
    if (!req.isAuthenticated()) {
        res.send(401);
    } else {
        next();
    }
};

/***************************************
             Users
 ***************************************/

app.get("/api/user", auth, function(req, res){
    UserModel.find(function(err, users){
        res.json(users);
    });
});

app.delete("/api/user/:id", auth, function(req, res){
    UserModel.findById(req.params.id, function(err, user){
        user.remove(function(err, count){
            UserModel.find(function(err, users){
                res.json(users);
            });
        });
    });
});

app.put("/api/user/:id", auth, function(req, res){
    UserModel.findById(req.params.id, function(err, user){
        user.update(req.body, function(err, count){
            UserModel.find(function(err, users){
                res.json(users);
            });
        });
    });
});

app.post("/api/user", auth, function(req, res){
    UserModel.findOne({username: req.body.username}, function(err, user) {
        if(user == null) {
            user = new UserModel(req.body);
            user.save(function(err, user){
                UserModel.find(function(err, users){
                    res.json(users);
                });
            });
        } else {
            UserModel.find(function(err, users){
                res.json(users);
            });
        }
    });
});

/***************************************
             Courses
 ***************************************/

// Temp data
var courses = [ 
    { name : "Java 101", category : "PROG", dateCreated : "1/1/2015", description : "Wow" },
    { name : "MongoDB 101", category : "DB", dateCreated : "2/1/2015", description : "Good" },
    { name : "Express 101", category : "PROG", dateCreated : "3/1/2015", description : "Better" }, 
    { name : "AngularJS 101", category : "WEB", dateCreated : "4/1/2015", description : "Best" }, 
    { name : "NodeJS 101", category : "PROG", dateCreated : "5/1/2015", description : "Awesome" }
];

app.get("/api/course", function(req, res){
    
    // Return courses lis
    res.json(courses);
});

app.get("/api/course/:id", function(req, res){
    
    // Return specific course
    res.json(courses[req.params.id]);
});

app.delete("/api/course/:id", function(req, res){
    
    // get ID
    var id = req.params.id;

    // Save course to memory
    var deletedCourse = courses[id];
    
    // Remove from array
    courses.splice(id, 1);
    
    // Return deleted course
    res.json(courses);
});

app.put("/api/course/:id", function(req, res){
    
    // Get id
    var id = req.params.id;

    var oldCourse = courses[id];

    // Get course from request body
    var course = {
        name : req.body.name,
        category : req.body.category,
        description : req.body.description,

        // Use former date created
        dateCreated : oldCourse.dateCreated
    }

    // Update course
    courses[id] = course;

    // Return course
    res.json(courses)
});

app.post("/api/course", function(req, res){
    
    // Get course from request body
    var course = {
        name : req.body.name,
        category : req.body.category,
        dateCreated : req.body.dateCreated,
        description : req.body.description
    }

    // Add course
    courses.push(course);

    // Return course list
    res.json(courses)
});

/***************************************
             Server
 ***************************************/

app.listen(port, ip);

console.log("\nServer Running on Port " + port);

