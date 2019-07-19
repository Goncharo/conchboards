var config      = require('./config'),
    Mailgun     = require('mailgun-js')({apiKey: config.mailgun_api_key, domain: config.mailgun_domain});

var mail = {};

mail.sendMail = function(to, subject, body, attachment, callback)
{
    var data = {
      from: config.mailgun_from_who,
      to: to,
      subject: subject,
      html: body
    };

    if(attachment){ data.attachment = attachment; }

    Mailgun.messages().send(data, function (err, body) {
        (err) ? callback(err) : callback(null);
    });
};

mail.sendVerificationMail = function(to, username, token, callback)
{
    var subject = "Welcome to Conchboards!";
    
    var body    = `<p>Hi ${username},</p>`;
    body        += '<p>Thanks for signing up with Conchboards! Please click on the following link to verify your account:</p> ';
    body        += `<p><a href="${config.webappURL}/verify?token=${token}">Verify</a></p>`;
    body        += '<p>Cheers,</p>';
    body        += '<p>Conchboards Support Team</p>';
    
    mail.sendMail(to, subject, body, null, callback);
};

mail.sendPasswordResetMail = function(to, token, callback)
{
    var subject = "Your Conchboards Password Reset Token";
    
    var body    = '<p>Hi,</p>';
    body        += '<p>Please click on the following link to reset your password:</p> ';
    body        += `<p><a href="${config.webappURL}/resetpass?token=${token}">Reset Password</a></p>`;
    body        += '<p>Cheers,</p>';
    body        += '<p>Conchboards Support Team</p>';
    
    mail.sendMail(to, subject, body, null, callback);
};

module.exports = mail;