const express = require('express');
const routes = express.Router()
const userController = require('../controller/auth')

routes.post('/sign-up', userController.createUser)
    .post('/sign-in', userController.loginUser)
    .post('/forget-password', userController.forgetPassword)
    .get('/reset-password/:id/:token', userController.verifyResetToken)
    .post('/reset-password/:id/:token', userController.resetPassword)


exports.router = routes