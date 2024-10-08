const mongoose = require('mongoose');
const { Schema } = mongoose;

//User schema
const userSchema = new Schema({
    firstName: { type: String, required: true, maxLength: 15 }, //user firstName
    lastName: { type: String, maxLength: 15 }, //user lastName 
    email: {             //user email
        type: String,   
        unique: true,
        validate: {
            validator: function (v) {
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        },
        required: true
    },
    password: { type: String, minLength: 6, required: true }, //password
    dob: { type: Date, required: true }, // Date of birth
    gender: { type: String, required: true }, // Gender
    hobby: { type: [String] }, // Hobbies as an array of strings
    token: { type: String, default: null }, //  token field
    resetToken:{ type: String, default: null }//password reset token field
});

exports.User = mongoose.model('User', userSchema);
