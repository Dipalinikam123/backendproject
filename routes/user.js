const express = require('express');
const userController = require('../controller/user')
const routes = express.Router()

routes
    .get('/', userController.getUsers)
    .get('/profile', userController.profile)
    .get('/:id', userController.getUser)
    .put('/:id', userController.updateUser)
    .delete('/:id', userController.deleteUser)
    .post('/update-password/:id', userController.updatePassword)

exports.router = routes    