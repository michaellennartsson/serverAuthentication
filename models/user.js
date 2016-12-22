const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Define model
const userSchema = new Schema ({
    email: { type: String, uniqe: true, lowercase: true },
    password: String
});

// On save hook, encrypt password
userSchema.pre('save', function (next) {
    const user = this;

    bcrypt.genSalt(10, function (err, salt) {
        if (err) { return next(err); }

        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err)  { return next(err); }

            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePasswords = function (candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) { return callback(err) }

        callback(null, isMatch);
    });
}

// Creat model class
const ModelClass = mongoose.model('user', userSchema);

// Export model
module.exports = ModelClass;