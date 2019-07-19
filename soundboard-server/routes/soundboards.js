var express     = require("express"),
    mongoose    = require("mongoose"),
    router      = express.Router(),
    multer      = require("multer"),
    crypto      = require("crypto"),
    mime        = require("mime"),
    Soundboard  = require("../models/soundboard"),
    passport    = require("passport"),
    config      = require("../utilities/config"),
    fs          = require("fs"),
    path        = require("path");

function getExtension (mimetype)
{
    var extension = mime.getExtension(mimetype);

    if(!extension)
    {
        switch (mimetype) {
            case "audio/aiff":
                extension = "aiff";
                break;

            case "audio/vnd.wave":
                extension = "wav";
                break;
        
            default:
                break;
        }
    }

    return extension;
}

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "..", "uploads/"))
    },
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            var extension = getExtension(file.mimetype);
            cb(null, raw.toString('hex') + Date.now() + '.' + extension);
        });
    }
});

var fileFilter = function(req, file, cb){
    var extension = getExtension(file.mimetype);
    if(extension !== "jpg" && extension!== "jpeg" && extension!== "png"
        && extension !== "mp3" && extension !== "wav" && extension!== "aiff" 
        && extension != "mpga" && extension !== "aif")
    {
        return cb(new Error("File type not supported!"));
    }
    cb(null, true);
};

var upload = multer({dest : path.join(__dirname, "..", "uploads/"), storage : storage, 
                    fileFilter: fileFilter, limits: {
                        fileSize : config.fileSizeLimit,
                        files : config.soundsLimit + 1,
                    }});

var checkIfBanned = function(req, res, next){
    if(req.user && req.user.isBanned)
    {
        return res.json({
            success : false,
            message : "Your account was banned, if you beleive this is unjust, please contact us!"
        });
    }

    next();
};

// upload new soundboard
router.post("/soundboards", 
[
    passport.authenticate('jwt', {session: false}),
    checkIfBanned, 
    upload.array('files[]', config.soundsLimit + 1)
], function(req, res){
    if(!req.files || !req.body.name || !req.body.soundNames)
    {
        return res.json({
            success : false,
            message : "Invalid soundboard!"
        });
    }
    var files = [];
    for(var i = 0; i < req.body.soundNames.length; i++)
    {
        files.push({
            name : req.body.soundNames[i],
            soundFile : req.files[i].filename
        });
    }

    var soundboard = new Soundboard({
        name : req.body.name,
        image : req.files[req.files.length - 1].filename,
        soundFiles : files,
        creator : req.user._id
    });

    soundboard.save();

    return res.json({
        success : true,
        message : "Successfully uploaded soundboard!"
    });
});

// get all soundboards (don't need soundfiles yet)
router.get("/soundboards", function(req, res, next){
    passport.authenticate('jwt', {session: false}, function(err, user, info){
        if(err) {
            console.error(err);
            return res.json({
                success : false,
                message : "Something went wrong!"
            });
        }
        else
        {
            if(user && user.isBanned)
            {
                return res.json({
                    success : false,
                    message : "Your account was banned, if you beleive this is unjust, please contact us!"
                });
            }

            var page = Number(req.query["page"]);
            var limit = Number(req.query["limit"]);
            var name = req.query["name"];
            var type = req.query["type"];

            if(!page || !limit || !type || (type != "hottest" && type != "newest"))
            {
                return res.json({
                    success : false,
                    message : "Invalid query params."
                });
            }

            var sort = (type === "hottest") ? {favourites : -1} : {created_at : - 1};

            var paginateOpts = {
                leanWithId : true,
                page : page,
                limit : limit,
                populate : 'creator',
                sort : sort
            };

            var query = (name) ? {name : {$regex: name, $options: "i"}} : {};
            if(user) query.reportedBy = {$nin: [{_id : mongoose.Types.ObjectId(user._id)}]};
            if(user) query.creator = {$nin: user.blockedUsers};

            Soundboard.paginate(query, paginateOpts, function(err, result){
                if(err) {
                    console.error(err);
                    return res.json({
                        success : false,
                        message : "Something went wrong!"
                    });
                }
                else
                {
                    var boards = [];
                    result.docs.forEach((soundboard) => {
                        boards.push({
                            name : soundboard.name,
                            image : soundboard.image,
                            favourites : soundboard.favourites.length,
                            id : soundboard._id,
                            creatorId : soundboard.creator._id,
                            creatorUsername : soundboard.creator.username,
                            createdAt : soundboard.created_at
                        });
                    });

                    return res.json({
                        success : true,
                        soundboards : boards
                    });
                }
            });
        }
    })(req, res, next);
});

// get a specific soundboard
router.get("/soundboards/:id", function(req, res, next){
    passport.authenticate('jwt', {session: false}, function(err, user, info){
        if(err) {
            console.error(err);
            return res.json({
                success : false,
                message : "Something went wrong!"
            });
        }
        else
        {
            if(user && user.isBanned)
            {
                return res.json({
                    success : false,
                    message : "Your account was banned, if you beleive this is unjust, please contact us!"
                });
            }
            
            Soundboard.findById(req.params.id).populate('creator').exec(function(err, soundboard){
                if(err)
                {
                    return res.json({
                        success : false,
                        message : "Soundboard not found!"
                    });
                }
                else
                {
                    if(soundboard)
                    {
                        var favourited = false;
                        if(user)
                        {
                            favourited = soundboard.favourites.some(function (favourite) {
                                return favourite.equals(user._id);
                            });
                        }
        
                        return res.json({
                            success : true,
                            favourited : favourited,
                            soundboard : {
                                name : soundboard.name,
                                image : soundboard.image,
                                soundFiles : soundboard.soundFiles,
                                id : soundboard._id,
                                creatorId : soundboard.creator._id,
                                creatorUsername : soundboard.creator.username,
                                createdAt: soundboard.created_at
                            }
                        });
                    }
                    else
                    {
                        return res.json({
                            success : false,
                            message : "Soundboard not found!"
                        });
                    }
                }
            });
        }
    })(req, res, next);
    
});

// favourite or un-favourite a soundboard
router.post("/soundboards/favourite/:id", [passport.authenticate('jwt', {session: false}), checkIfBanned], function(req, res){
    Soundboard.findById(req.params.id, function(err, soundboard){
        if(err) {
            console.error(err);
            return res.json({
                success : false,
                message : "Something went wrong!"
            });
        }
        else
        {
            if(soundboard)
            {

                var index = -1;
                var isInArray = soundboard.favourites.some(function (favourite) {
                    index++;
                    return favourite.equals(req.user._id);
                });

                if(!isInArray)
                {
                    soundboard.favourites.push(req.user._id);
                    soundboard.save();
                    return res.json({
                        success : true,
                        message : "Soundboard added to favourites!"
                    });
                }
                else
                {
                    soundboard.favourites.splice(index, 1);
                    soundboard.save();
                    return res.json({
                        success : true,
                        message : "Soundboard removed from favourites!"
                    });
                }
            }
            else
            {
                return res.json({
                    success : false,
                    message : "Soundboard not found!"
                });
            }
        }
    });
});

// report a soundboard
router.post("/soundboards/report/:id", [passport.authenticate('jwt', {session: false}), checkIfBanned], function(req, res){
    Soundboard.findById(req.params.id, function(err, soundboard){
        if(err) {
            console.error(err);
            return res.json({
                success : false,
                message : "Something went wrong!"
            });
        }
        else
        {
            if(soundboard)
            {
                var blockUser = req.query["blockUser"];
                var index = -1;
                var isInArray = soundboard.reportedBy.some(function (report) {
                    index++;
                    return report.equals(req.user._id);
                });

                if(!isInArray)
                {
                    soundboard.reportedBy.push(req.user._id);
                    soundboard.save();
                }

                var blockedUserStr = ""
                if(blockUser === "true")
                {
                    req.user.blockedUsers.push(soundboard.creator);
                    blockedUserStr = " and the user has been blocked"
                    req.user.save();
                }

                return res.json({
                    success : true,
                    message : `Thank you for your feedback! The soundboard has been reported${blockedUserStr}.`
                });
            }
            else
            {
                return res.json({
                    success : false,
                    message : "Soundboard not found!"
                });
            }
        }
    });
});

// get all soundboards that a user has either created or favourited
router.get("/mysoundboards", [passport.authenticate('jwt', {session: false}), checkIfBanned], function(req, res){
    var query = {};
    var type = req.query["type"];
    var page = Number(req.query["page"]);
    var limit = Number(req.query["limit"]);

    if(!type || !page || !limit)
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
        sort : {created_at : - 1},
        populate : 'creator'
    };
    if(type === "created")
    {
        query = {creator: req.user._id};
    }
    else if (type === "favourited")
    {
        query = {favourites: {$elemMatch : {$eq: {_id : mongoose.Types.ObjectId(req.user._id)}}}};
    }
    else
    {
        return res.json({
            success : false,
            message : "Invalid query params."
        });
    }

    Soundboard.paginate(query, paginateOpts, function(err, result){
        if(err) {
            console.error(err);
            return res.json({
                success : false,
                message : "Something went wrong!"
            });
        }
        else
        {
            var soundboards = [];

            if(result.docs && result.docs.length > 0)
            {         
                result.docs.forEach((soundboard) => {
                    var sb = {
                        name : soundboard.name,
                        image : soundboard.image,
                        favourites : soundboard.favourites.length,
                        id : soundboard._id,
                        creatorId : soundboard.creator._id,
                        creatorUsername : soundboard.creator.username,
                        createdAt : soundboard.created_at
                    };

                    soundboards.push(sb);   
                });
            }
            
            return res.json({
                success : true,
                soundboards: soundboards
            });
        }
    });
});

// delete a specific soundboard
router.delete("/soundboards/:id", [passport.authenticate('jwt', {session : false}), checkIfBanned], function(req, res){
    Soundboard.findById(req.params.id, function(err, soundboard){
        if(err) {
            console.error(err);
            return res.json({
                success : false,
                message : "Something went wrong!"
            });
        }
        if(soundboard)
        {
            if(!soundboard.creator.equals(req.user._id) && !req.user.isAdmin)
            {
                return res.json({
                    success : false,
                    message : "You do not have permission to delete this soundboard."
                });
            }
            // delete all sound files
            soundboard.soundFiles.forEach((soundFile) => {
                fs.unlink(path.join(__dirname, "..", "uploads", soundFile.soundFile), 
                    function(err){
                        if(err) console.log(err);
                    });
            });

            // delete soundboard picture 
            fs.unlink(path.join(__dirname, "..", "uploads", soundboard.image), 
                function(err){
                    if(err) console.log(err);
                });

            soundboard.remove();

            return res.json({
                success : true,
                message : "Soundboard deleted successfully!"
            });
        }
        else
        {
            return res.json({
                success : false,
                message : "Soundboard not found!"
            });
        }
    });
});

module.exports = router;
