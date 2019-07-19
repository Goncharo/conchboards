var express     = require("express"),
    mongoose    = require("mongoose"),
    router      = express.Router(),
    Soundboard  = require("../models/soundboard"),
    User        = require("../models/user"),
    passport    = require("passport"),
    mail        = require("../utilities/mail"),
    config      = require("../utilities/config"),
    fs          = require("fs"),
    path        = require("path");

var checkIfAdmin = function(req, res, next){
    if(req.user && !req.user.isAdmin)
    {
        return res.json({
            success : false,
            message : "You don't have permission to do this!"
        });
    }

    next();
};

// send email to all non-admin users
router.post("/admin/email", [passport.authenticate('jwt', {session: false}), checkIfAdmin], function(req, res){
    if(!req.body.subject || !req.body.body)
    {
        return res.json({
            success : false,
            message : "Must provide a subject and an HTML body!"
        });
    }

    User.find({isAdmin: "false"}, function(err, users){
        if (err) 
        {
            console.error(err);
            return res.json({
                success : false,
                message : "Something went wrong!"
            });
        }

        var toStr = "";
        if(users)
        {
            for(var i = 0; i < users.length; i++)
            {
                toStr += users[i].email  + ",";
            }
            toStr = toStr.slice(0, -1);

            mail.sendMail(toStr, req.body.subject, req.body.body, null, function(err){
                if(err)
                {
                    console.error(err);
                    return res.json({
                        success : false,
                        message : "Something went wrong!"
                    });
                }
                else
                {
                    return res.json({
                        success : true,
                        message : "Sent out emails successfully."
                    });
                }
            });
        }
        else
        {
            return res.json({
                success : true,
                message : "Call successfull, but found no users to send mail to."
            });
        }
    });
});

// get list of most malicious users + soundboards
router.get("/admin/malicious", [passport.authenticate('jwt', {session: false}), checkIfAdmin], function(req, res){
    var page = Number(req.query["page"]);
    var limit = Number(req.query["limit"]);

    if(!page || !limit)
    {
        return res.json({
            success : false,
            message : "Invalid query params."
        });
    }

    var paginateOpts = {
        leanWithId : true,
        page : page,
        limit : limit,
        sort : {reportedBy: -1}
    };
    
    Soundboard.paginate({}, paginateOpts, function(err, result){
        if(err)
        {
            console.error(err);
            return res.json({
                success : false,
                message : "Something went wrong!"
            });
        }
        else
        {
            var users = [];
            result.docs.forEach((soundboard) => {
                var index = users.findIndex(el => soundboard.creator.equals(el.userID));
                var sbInfoObj = {
                    id: soundboard._id,
                    name: soundboard.name,
                    reportCount: soundboard.reportedBy.length
                };
                if(index != -1)
                {
                    users[index].soundboards.push(sbInfoObj);
                }
                else
                {
                    users.push({
                        userID: soundboard.creator,
                        soundboards: [sbInfoObj]
                    });
                }
            });

            return res.json({
                success : true,
                users: users
            });
        }
    });
});

// ban/unban user
router.post("/admin/ban/:id", [passport.authenticate('jwt', {session: false}), checkIfAdmin], function(req, res){
    User.findById(req.params.id, function(err, user){
        if (err)
        {
            console.error(err);
            return res.json({
                success : false,
                message : "Something went wrong!"
            });
        }
        else
        {
            if(user)
            {
                user.isBanned = !user.isBanned;
                user.save();
                var banStr = user.isBanned ? "banned" : "un-banned";
                return res.json({
                    success : true,
                    message : `Successfully ${banStr} user!`
                });
            }
            else
            {
                return res.json({
                    success : false,
                    message : "Cannot ban user that does not exist."
                });
            }
        }
    });
});

// banhammer, will ban user and delete all associated soundboards
router.post("/admin/banhammer/:id", [passport.authenticate('jwt', {session: false}), checkIfAdmin], function(req, res){
    User.findById(req.params.id, function(err, user){
        if (err)
        {
            console.error(err);
            return res.json({
                success : false,
                message : "Something went wrong!"
            });
        }
        else
        {
            if(user)
            {
                return res.json({
                    success : true,
                    message : "To be implemented if necessary!"
                });
            }
            else
            {
                return res.json({
                    success : false,
                    message : "Cannot banhammer user that does not exist."
                });
            }
        }
    });
});

module.exports = router;