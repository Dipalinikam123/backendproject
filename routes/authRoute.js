const express = require('express');
const routes = express.Router()
const userController = require('../controller/auth')

routes.post('/signUp', userController.createUser)
    .post('/signIn', userController.loginUser)
    .post('/forgetpassword', userController.forgetPassword)
    .get('/reset-password/:id/:token', userController.verifyResetToken)
    .post('/reset-password/:id/:token', userController.resetPassword)


exports.router = routes