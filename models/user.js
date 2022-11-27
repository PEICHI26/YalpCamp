const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserScheme = new Schema({
    email:{
        type: String,
        required: true,
        unique:true
    }
});

UserScheme.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',UserScheme);