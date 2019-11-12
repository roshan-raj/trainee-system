var Employee = require('../app/models/employee');

module.exports = function (app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function (req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function (req, res) {

        // render the page and pass in any flash data if it exists
        res.render('trainee.ejs', {
            message: req.flash('loginMessage')
        });
    });

    // process the login form
    // app.post('/login', do all our passport stuff here);

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function (req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', {
            message: req.flash('signupMessage')
        });
    });

    // process the signup form
    // app.post('/signup', do all our passport stuff here);

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    app.get('/profile', isLoggedIn, function (req, res) {
        if (req.user.designation == "Trainee") {
            res.render('traineepage.ejs', {
                employee: req.user
            });
        } else {
            Employee.find({ "designation": "Trainee" }, { "_id": 0, "name": 1, "empid": 1, "email": 1, "phone": 1, "marks.java": 1, "marks.sql": 1, "marks.unix": 1, "marks.web": 1 }, (err, result) => {
                if (err) return console.log(err)
                res.render('managerpage.ejs', { trainee: result, employee: req.user })
            });
        }
    });

    app.put('/changePassword/:_id', isLoggedIn, (req, res) => {
        if (req.body.temppass == req.body.password) {
            var newPass = new Employee();
            req.body.password = newPass.generateHash(req.body.password);
            console.log(req.body.password);
            Employee.findByIdAndUpdate(req.params._id, {
                $set: {
                    "password": req.body.password
                }
            }, (error, result) => {
                if (error) {
                    console.log("Failed");
                    return res.status(500).send(error);
                }
                res.send(result.result);
            });
        } else {
            console.log("password aint matching nigga");
            return res.status(500);
        }
    });

    app.put('/updateProfile/:_id', isLoggedIn, (req, res) => {
        Employee.findByIdAndUpdate(req.params._id, {
            $set: {
                "proofs": {
                    "pan": req.body.pan,
                    "aadhaar": req.body.aadhaar
                },
                "social": {
                    "twitter": req.body.twitter,
                    "linkedin": req.body.linkedin
                },
                "college": {
                    "name": req.body.collegename,
                    "percentage": req.body.collegeper
                },
                "university": {
                    "name": req.body.universityname,
                    "percentage": req.body.universityper
                },
                "school": {
                    "name": req.body.schoolname,
                    "percentage": req.body.schoolper
                }
            }
        }, (error, result) => {
            if (error) {
                console.log("Failed");
                return res.status(500).send(error);
            }
            res.send(result.result);
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}