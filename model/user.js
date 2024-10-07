const mongoose = require('mongoose');
const { Schema } = mongoose;

//  schema
const userSchema = new Schema({
    firstName: { type: String, required: true, maxLength: 15 },
    lastName: { type: String, maxLength: 15 },
    email: {
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
    password: { type: String, minLength: 6, required: true },
    dob: { type: Date, required: true }, // Date of birth
    gender: { type: String, required: true }, // Gender
    hobby: { type: [String] }, // Hobbies as an array of strings
    token: { type: String, default: null }, // Corrected token field
    resetToken:{ type: String, default: null }
});

exports.User = mongoose.model('User', userSchema);
