var JwtStrategy     = require("passport-jwt").Strategy,
    ExtractJwt      = require("passport-jwt").ExtractJwt,
    User            = require("../models/user"),
    config          = require("../utilities/config");

var passportUtil = {};

passportUtil.jwtStrategy = function(passport)
{
    var options = 
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.JWTSecret
    }

    passport.use(new JwtStrategy(options, function(payload, done)
    {
        User.findOne({_id: payload._id}, function(err, user){
            if(err)
            {
                return done(err, false);
            }
            if(user)
            {
                done(null, user);
            }
            else
            {
                done(null, false);
            }
        })
    }));
};

module.exports = passportUtil;