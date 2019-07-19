var mongoose    = require("mongoose"),
    paginate    = require("mongoose-paginate");

var SoundboardSchema = new mongoose.Schema({
    name : String,
    image : String,
    soundFiles : [{
        name : String,
        soundFile : String
    }],
    favourites : [{
        user : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    }],
    reportedBy : [{
        user : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    }],
    creator : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { 
    timestamps: { createdAt: 'created_at' } 
});

// add pagination to the soundboards schema
SoundboardSchema.plugin(paginate);

module.exports = mongoose.model("Soundboard", SoundboardSchema);