var express = require("express");
var User = require("../models/User");

var router = express.Router();

//login API endpoint
router.route("/login").post((req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email, password: password }).then((doc) => {

        if (doc != null) {

            res.send({ status: "success", email: email, password:password });

        } else {
            //invalid user
            res.send({ status: "invalid_user", "message": "Incorrent email or password." });
        }

    }).catch((e) => {
        res.send({ status: "failed", "message": e});
    });

});

//register API endpoint
router.route("/register").post((req, res) => {

    var firstName = req.body.first_name;
    var lastName = req.body.last_name;
    var mobileNumber = req.body.mobile_number;
    var email = req.body.email;
    var city = req.body.city;
    var password = req.body.password;

    //validate details
    if (firstName == null || firstName == "" ||
        lastName == null || lastName == "" ||
        mobileNumber == null || mobileNumber == "" ||
        email == null || email == "" ||
        city == null || city == "" ||
        password == null || password == "") {

        res.send({ "status": "required_failed", "message": "Please send required details." });

        return;
    }

    //check email is already
    User.findOne({ email: email }).then((doc) => {

        if (doc == null) {

            //save user details
            var user = new User();
            user.first_name = firstName;
            user.last_name = lastName;
            user.mobile_number = mobileNumber;
            user.email = email;
            user.city = city;
            user.password = password;

            user.save().then(() => {
                res.send({ "status": "success", "message": "User is register success." });
            }).catch((e) => {
                res.send({ "status": "failed", "message": "Somthing error. Please try again." });
            });

        } else {
            res.send({ "status": "already_email", "message": "This email is already taken." });
        }

    }).catch((e) => {
        res.send({ "status": "failed", "message": "Somthing error. Please try again." });
    });

});


// fetch users for notification system
router.route("/users").get((req, res) => {
    User.find({}).then((users) => {

        console.log(users);
        if (users.length > 0) {
            res.send({ status: "success", users: users });
        } else {
            res.send({ status: "no_users", message: "No users found." });
        }
    }).catch((e) => {
        res.send({ status: "failed", message: "Something went wrong. Please try again." });
    });
});

router.get('/api/admin/register', async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({
            message: 'All users retrieved successfully',
            status: 'success',
            data: users  // Ensure this matches the data structure you expect
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving users',
            status: 'error',
            error: error.message
        });
    }
});



module.exports = router;