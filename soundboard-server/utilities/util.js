var util = {};

util.validatePassword = function(password){
    return password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!$%@#£€*?&]{8,40}$/);
};

util.validateUsername = function(username){
    return username.match(/^[A-Za-z0-9_]{1,15}$/);
};

module.exports = util;