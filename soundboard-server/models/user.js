var mongoose    = require("mongoose"),
    bcrypt      = require("bcrypt");

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    username: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    verificationToken: {
        type: String
    },
    passwordResetToken: {
        type: String
    },
    verified: Boolean,
    isAdmin: Boolean,
    isBanned: Boolean,
    blockedUsers : [{
        user : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    }]
});

// Pre-hook that will hash + salt the user's password before 
// saving the user to the database
UserSchema.pre('save', function(next){
    var user = this;
    if(this.isModified('password') || this.isNew)
    {
        // generate salt
        bcrypt.genSalt(10, function(err, salt){
            if(err)
            {
                return next(err);
            }
            else
            {
                // generate hash
                bcrypt.hash(user.password, salt, function(err, hash)
                {
                    if(err)
                    {
                        return next(err);
                    }
                    else
                    {
                        user.password = hash;
                        next();
                    }    
                });
            }
        });
    }
    else
    {
        return next();
    }
});

// Method to compare passwords
UserSchema.methods.comparePassword = function(password, callback)
{
    bcrypt.compare(password, this.password, function(err, match){
        if(err)
        {
            return callback(err);
        } 
        else
        {
            callback(null, match);
        }
    })
};

module.exports = mongoose.model("User", UserSchema);