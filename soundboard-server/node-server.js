var express         = require("express"),
    app             = express(),
    router          = express.Router(),
    mongoose        = require("mongoose"),
    bodyParser      = require("body-parser"),
    path            = require("path"),
    cors            = require("cors"),
    passport        = require("passport"),
    jwt             = require("jsonwebtoken"),
    passportUtil    = require("./utilities/passport"),
    delay           = require("express-delay");


// TEST BLOCK - (un)comment to test latency
// app.use(delay(2000));
// END TEST BLOCK

// configure body-parser
app.use(bodyParser.urlencoded({ extended: false }));  
app.use(bodyParser.json());

// configure CORS
app.use(cors());

// configure routes
var soundboardRoutes = require("./routes/soundboards");
app.use('/api', soundboardRoutes);
var authRoutes = require("./routes/auth");
app.use('/api', authRoutes);
var adminRoutes = require("./routes/admin");
app.use('/api', adminRoutes);
var indexRoutes = require("./routes");
app.use('/api', indexRoutes);

app.use('/api', router);

// configure passport 
app.use(passport.initialize());
passportUtil.jwtStrategy(passport);


// connect to the database
var dbURL = process.env.DATABASEURL || "mongodb://localhost/soundboards"
mongoose.connect(dbURL);

// serve static files from uploads dir
app.use("/api/static", express.static(path.join(__dirname, "uploads")));



var server = app.listen(process.env.PORT, process.env.IP, function(req){
    console.log(`soundboard server started on port ${process.env.PORT} with on host ${process.env.IP}`);
    
});