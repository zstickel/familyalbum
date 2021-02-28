const express = require('express');
const router = express.Router();
const passport = require('passport');
const user = require('../controllers/user');


router.route('/register')
    .get(user.renderRegForm)
    .post(user.registerUser);

router.route('/login')
    .get(user.renderLoginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), user.loginUser);


router.get('/logout', user.logOut);

module.exports = router;