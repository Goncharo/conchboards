var express     = require("express"),
    router      = express.Router(),
    jwt         = require("jsonwebtoken"),
    User        = require("../models/user"),
    util        = require("../utilities/util"),
    config      = require("../utilities/config"),
    crypto      = require("crypto"),
    mail        = require("../utilities/mail"),
    passport    = require("passport"),
    request     = require("request"),
    emailValidator   = require("email-validator");

function newUser(email, password, username, callback)
{
    if(!emailValidator.validate(email))
    {
        callback(null, false, "Provided email is invalid.");
        return;
    }

    if(!util.validatePassword(password))
    {
        callback(null, false, "Provided password is invalid.");
        return;
    }

    if(!util.validateUsername(username))
    {
        callback(null, false, "Provided username is invalid.");
        return;
    }

    var newUser = new User({
        email : email,
        password : password,
        username : username,
        verified : false,
        isAdmin : false,
        isBanned : false
    });

    newUser.save(function(err){
        if(err)
        {
            callback(null, false, "User with provided email or username already exists!");
            return;
        }

        var verificationToken = crypto.randomBytes(16).toString('hex') + newUser._id;
        newUser.verificationToken = verificationToken;
        newUser.save();

        mail.sendVerificationMail(newUser.email, newUser.username, verificationToken, function(err){
            if(err)
            {
                callback(err);
                return;
            }
            callback(null, true, "Account created successfully! Please verify your account before logging in using the verification link that was emailed to you.");
            return;
        });
    });
}

//========================================================
// AUTHENTICATION ROUTES
//========================================================
router.post("/signup", function(req, res){
    if(!req.body.email || !req.body.password || (!req.body.mobile && !req.body.captchaResponse)
       || !req.body.username)
    {
        return res.json({
            success : false,
            message : "Must provide all required information!"
        });
    }

    // if this request is not from a mobile app, must do captcha validation
    if(!req.body.mobile)
    {
        request.post(config.recaptchaURL, 
            {form:{secret: config.recaptchaSecret, response: req.body.captchaResponse}},
            function(error, response, body){
                if(!error && response.statusCode == 200)
                {
                    newUser(req.body.email, req.body.password, req.body.username, function(err, success, message){
                        if(err){
                            console.error(err);
                            return res.json({
                                success : false,
                                message : "Something went wrong!"
                            });
                        }
                        return res.json({
                            success : success,
                            message : message
                        });
                    });
                }
                else
                {
                    return res.json({
                        success : false,
                        message : "Re-captcha verification failed!"
                    });
                }
            });
    }
    else
    {
        newUser(req.body.email, req.body.password, req.body.username, function(err, success, message){
            if(err) {
                console.error(err);
                return res.json({
                    success : false,
                    message : "Something went wrong!"
                });
            }

            return res.json({
                success : success,
                message : message
            });
        });
    }

});

router.get("/usernameExists/:username", function(req, res){
    User.findOne({username: req.params.username}, function(err, user){
        if(err) {
            console.error(err);
            return res.json({
                success : false,
                message : "Something went wrong!"
            });
        }

        return res.json({
            success : true,
            userExists : user ? true : false
        });
    });
});

router.post("/signin", function(req, res){
    User.findOne({email : req.body.email}, function(err, user){
        if(err) {
            console.error(err);
            return res.json({
                success : false,
                message : "Something went wrong!"
            });
        }

        if(!user)
        {
            return res.json({
                success : false,
                message : "User with provided email doesn't exist."
            });
        }

        if(user.isBanned)
        {
            return res.json({
                success : false,
                message : "Your account was banned, if you beleive this is unjust, please contact us!"
            });
        }

        user.comparePassword(req.body.password, function(err, match){
            if(err || !match)
            {
                return res.json({
                    success : false,
                    message : "Incorrect password provided."
                });
            }

            if(!user.verified)
            {
                return res.json({
                    success : false,
                    message : "Please verify your account using the email that was sent to you before logging in."
                });
            }

            return res.json({
                success : true,
                message : "Successfully logged in!",
                jwt : "Bearer " + jwt.sign(user.toJSON(), config.JWTSecret, {expiresIn : config.JWTExpiry}),
                tokenValidFor : config.JWTExpiry,
                id: user._id,
                isAdmin: user.isAdmin
            });
        });
    });
});

router.get("/verify/:token", function(req, res){
    User.findOne({verificationToken: req.params.token}, function(err, user){
        if(err) {
            console.error(err);
            return res.json({
                success : false,
                message : "Something went wrong!"
            });
        }

        if(!user)
        {
            return res.json({
                success : false,
                message : "Verification token not valid!"
            });
        }

        user.verificationToken = "";
        user.verified = true;
        user.save();

        return res.json({
            success : true,
            message : "Account verified successfully, you can now log in!"
        });
    });
});

router.post("/forgotpass", function(req, res){
    if(!req.body.email || (!req.body.mobile && !req.body.captchaResponse))
    {
        return res.json({
            success : false,
            message : "Must provide all required information!"
        });
    }

    User.findOne({email: req.body.email}, function(err, user){
        if(err) {
            console.error(err);
            return res.json({
                success : false,
                message : "Something went wrong!"
            });
        }
        if (user)
        {
            if(user.isBanned)
            {
                return res.json({
                    success : false,
                    message : "Your account was banned, if you beleive this is unjust, please contact us!"
                });
            }

            if(!req.body.mobile)
            {
                request.post(config.recaptchaURL, 
                    {form:{secret: config.recaptchaSecret, response: req.body.captchaResponse}},
                    function(error, response, body){
                        if(!error && response.statusCode == 200)
                        {
                            var passwordResetToken = crypto.randomBytes(16).toString('hex') + user._id;
                            user.passwordResetToken = passwordResetToken;
                            user.save();
                
                            mail.sendPasswordResetMail(user.email, passwordResetToken, function(err){
                                if(err) {
                                    console.error(err);
                                    return res.json({
                                        success : false,
                                        message : "Something went wrong!"
                                    });
                                }
                                return res.json({
                                    success: true,
                                    message: "A password reset token will be emailed to you shortly!"
                                });
                            });
                        }
                        else
                        {
                            return res.json({
                                success : false,
                                message : "Re-captcha verification failed!"
                            });
                        }
                    });
            }
            else
            {
                var passwordResetToken = crypto.randomBytes(16).toString('hex') + user._id;
                user.passwordResetToken = passwordResetToken;
                user.save();
    
                mail.sendPasswordResetMail(user.email, passwordResetToken, function(err){
                    if(err) {
                        console.error(err);
                        return res.json({
                            success : false,
                            message : "Something went wrong!"
                        });
                    }
                    return res.json({
                        success: true,
                        message: "A password reset token will be emailed to you shortly!"
                    });
                });
            }
        }
        else 
        {
            return res.json({
                success : false,
                message : "Account with provided email not found."
            });
        }
    });
});

router.post("/resetpass/:token", function(req, res){
    if(!req.body.password || !req.params.token)
    {
        return res.json({
            success : false,
            message : "Invalid request."
        });
    }

    User.findOne({passwordResetToken: req.params.token}, function(err, user){
        if(err) {
            console.error(err);
            return res.json({
                success : false,
                message : "Something went wrong!"
            });
        }

        if(user)
        {
            user.password = req.body.password;
            user.passwordResetToken = "";
            user.save();
            return res.json({
                success : true,
                message : "Password changed succesfully! Please login again."
            });
        }
        else
        {
            return res.json({
                success : false,
                message : "Token is invalid."
            });
        }
    });
});

router.post("/changepass", passport.authenticate('jwt', {session: false}), function(req, res){
    if(!req.body.password || !req.body.currentPassword)
    {
        return res.json({
            success : false,
            message : "Invalid request."
        });
    }

    if(req.user.isBanned)
    {
        return res.json({
            success : false,
            message : "Your account was banned, if you beleive this is unjust, please contact us!"
        });
    }
    
    req.user.comparePassword(req.body.currentPassword, function(err, match){
        if(err || !match)
        {
            return res.json({
                success : false,
                message : "Current password does not match."
            });
        }
        
        req.user.password = req.body.password;
        req.user.save();
        return res.json({
            success : true,
            message : "Password changed succesfully!"
        });
    });
})

module.exports = router;