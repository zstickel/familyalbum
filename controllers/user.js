const User = require('../models/user');
const isFamilyMember = require('../utilities/userIsFamilyMember');

module.exports.renderRegForm = (req, res) => {
    const user = req.user;
    res.render('users/register', { user });
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
            res.redirect('/familymember/joinfamily');
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
    const user = req.user;
    res.render('users/login', { user });
}


module.exports.loginUser = (req, res) => {
    const authedUser = req.user.first;
    const user = req.user;
    console.log(user);
    res.redirect('/');
}

module.exports.logOut = (req, res) => {
    const authedUser = req.user.first;
    req.logout();
    //    req.flash('success', `Good Bye ${authedUser}!`);
    res.redirect('/')
}