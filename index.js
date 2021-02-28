if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const sessionSecret = process.env.SESSION;
const cookieSecret = process.env.COOKIE;
const ejsMate = require('ejs-mate');
const path = require('path');
const familyMemberRoutes = require('./routes/familymembers');
const userRoutes = require('./routes/user')
const mongoose = require('mongoose');
const dbUrl = process.env.DB_URL;
const dbSessionSecret = process.env.DB_SESSION;

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user')
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret: dbSessionSecret,
    touchAfter: 24 * 60 * 60
});
store.on('error', function (e) {
    console.log('Session store error', e);
});
const sessionOptions = {
    store,
    name: 'session',
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};



db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () => {
    console.log('Database connected');
})

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use('/javascripts', express.static(path.join(__dirname, 'public/javascripts')));
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    // res.locals.success = req.flash('success');
    // res.locals.error = req.flash('error');
    next();
});
app.use('/bootstrapcss', express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")));
app.use('/bootstrapjs', express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")));
app.use('/familymember', familyMemberRoutes);
app.use('/', userRoutes);

app.use(methodOverride('_method'));
app.use(cookieParser(cookieSecret));



app.get('/', (req, res) => {
    const user = req.user;
    res.render('home', { user });
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong!';
    res.status(statusCode).render('error', { err });
    console.log('Error handler')

});

app.listen(port, () => {
    console.log(`Serving on port ${port}`);
});

