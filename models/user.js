const validator = require("validator");
const mongoose = require("mongoose");
const jwt       = require("jsonwebtoken");
const _         = require("lodash");

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: (value) =>{
                return validator.isEmail(value);
            },
            message:"{VALUE} is not a valid email",
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }, 
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});


userSchema.methods.toJSON = function(){
    var user = this;
    var userObj = user.toObject();
    return _.pick(userObj, ["_id","email"]);
}


userSchema.methods.generateAuthToken = function(){
    var user = this;
    var access = "auth";
    var token  = jwt.sign({_id: user._id.toHexString(), access},"abc123").toString();

    user.tokens = user.tokens.concat([{access,token}]);

    return user.save().then(() =>{
        return token;
    });
};

const User = mongoose.model("User", userSchema);

module.exports = {User};