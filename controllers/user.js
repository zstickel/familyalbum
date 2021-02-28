const User = require('../models/user');
const isFamilyMember = require('../utilities/userIsFamilyMember');

module.exports.renderRegForm = (req, res) => {
    res.render('users/register', { user: "Bethany" });
}

module.exports.registerUser = async (req, res) => {
    try {
        const { username, password, first, last, email } = req.body.user;

        const user = new User({ username, first, last, email });
        let member = await isFamilyMember(user);
        const regUser = await User.register(user, password);
        req.login(regUser, err => {
            if (err) return next(err);
            // req.flash('success', 'Successfully made a new user!');
            res.redirect('/familymember/joinfamily', regUser);

        });
    }
    catch (e) {

        // req.flash('error', e.message);
        //console.log('fail with error', e.message);
        console.log(e);
        res.redirect('/register');
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login', { user: "Bethany" });
}


module.exports.loginUser = (req, res) => {
    const authedUser = req.user.first;
    // req.flash('success', `Welcome back ${authedUser}!`);
    const redirectUrl = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logOut = (req, res) => {
    const authedUser = req.user.first;
    req.logout();
    //    req.flash('success', `Good Bye ${authedUser}!`);
    res.redirect('/')
}