var express     = require("express"),
    router      = express.Router(),
    passport    = require("passport");

// Test Authentication Route
router.get("/", passport.authenticate('jwt', {session: false}), function(req, res){
    return res.json({
        success : true,
        message : "Successfully authenticated."
    });
});

module.exports = router;