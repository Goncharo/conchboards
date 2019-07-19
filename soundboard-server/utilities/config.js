var config = {};

//================================================
// Webapp URL
//================================================
config.webappURL = process.env.WEBAPP_URL;

//================================================
// Application Config
//================================================
config.soundsLimit = 12; // maximum number of sounds a user can upload per soundboard
config.fileSizeLimit = 2500000; // maximum file size in bytes (2.5MB)

//================================================
// JWT Configuration
//================================================
config.JWTSecret = process.env.JWT_SECRET;
config.JWTExpiry = 604800; // 7 days

//================================================
// reCaptcha Configuration
//================================================
config.recaptchaSecret = process.env.RECAPTCHA_SECRET;
config.recaptchaURL = "https://www.google.com/recaptcha/api/siteverify";

//================================================
// Mailgun API Keys
//================================================

//Your api key, from Mailgun’s Control Panel
config.mailgun_api_key               = process.env.MAILGUN_API_KEY;

//Your domain, from the Mailgun Control Panel
config.mailgun_domain                = process.env.MAILGUN_DOMAIN;

//Your sending email address
config.mailgun_from_who              = process.env.MAILGUN_FROM_WHO;

module.exports = config;