const jwt = require('jwt-simple');

const config = require('../config');
const User = require('../models/user');

function tokenForUser (user) {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp } , config.secret);
}

exports.signin = function (req, res, next) {
    res.send({ token: tokenForUser(req.user) });
}

exports.signup = function (req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(422).send({ error: 'No password or email is provided.' });
    }

    // See if a user with given email exists
    User.findOne({ email: email }, function (err, existingUser) {        

        // If a user exists return an error
        if (existingUser) {
            return res.status(422).send({ error: 'Email is in use.' });
        }

        // If not, create and save new user
        const user = new User ({
            email: email,
            password: password
        });

        user.save(function(err){
            if (err) { return next(err) }

            // Respond to request
            res.json({ token: tokenForUser(user) });
        });
        
    });
}