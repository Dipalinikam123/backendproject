// auth controller  
const USER_NOT_FOUND = "User Not Found";
const LOGIN_SUCCESS = "Login SuccessFully";
const PASSWORD_INCORRECT = "password incorrect.";
const SERVER_ERROR = "Internal Server Error";
const RESET_LINK_SEND = "Password reset link sent to your email.";
const VERIFIED = "Verified";
const NOT_VERIFIED = "Not Verified";
const EXPIRE_LINK = "Invalid or expired reset link";
const PASSWORD_NOT_MATCH = "Passwords do not match";
const RESET_PASSWORD_SUCCESS = "Password successfully reset";
const TOKEN_VERIFICATION_FAIL = "Token verification failed or an error occurred";

// user controller

const GET_USER_FAIL = 'Failed to retrieve users.';
const GET_USER_ID_FAIL = 'Failed to retrieve user by ID.';
const FAIL_UPDATE_USER = 'Failed to update user.'
const DELETE_USER_SUCCESS = "User Delete SUccesfully"
const FAIL_DELETE_USER = 'Failed to Delete user.'
const CURRENT_PWD_INCORRECT = 'Current password is incorrect.'
const UPDATE_PWD_SUCCESS = 'Password updated successfully.'
module.exports = {
    USER_NOT_FOUND,
    LOGIN_SUCCESS,
    PASSWORD_INCORRECT,
    RESET_LINK_SEND,
    SERVER_ERROR,
    VERIFIED,
    NOT_VERIFIED,
    EXPIRE_LINK,
    PASSWORD_NOT_MATCH,
    RESET_PASSWORD_SUCCESS,
    TOKEN_VERIFICATION_FAIL,
    GET_USER_FAIL,
    GET_USER_ID_FAIL,
    FAIL_UPDATE_USER,
    FAIL_DELETE_USER,
    DELETE_USER_SUCCESS,
    CURRENT_PWD_INCORRECT,
    UPDATE_PWD_SUCCESS
}