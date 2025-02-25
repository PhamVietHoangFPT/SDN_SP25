const Auth = require('../Controller/authController')
const express = require('express')
const authRouter = express.Router()

authRouter.route('/register')
  .post(Auth.register)

authRouter.route('/login')
  .post(Auth.login)
module.exports = authRouter;