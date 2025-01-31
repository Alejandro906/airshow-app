const express = require('express');
const router = express.Router();
const LocalStrategy = require('passport-local');
const passport = require('passport');
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Passport Local Strategy
passport.use(new LocalStrategy(async function verify(username, password, done) {
    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            return done(null, false, { message: 'Incorrect Username or Password' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return done(null, false, { message: 'Incorrect Username or Password' });
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

// Serialize and Deserialize User
passport.serializeUser((user, done) => { 
    done(null, user.id); 
});

passport.deserializeUser((id, done) => { 
    User.findById(id).then((user) => { 
        done(null, user);
    }).catch(err => done(err));
});

// Login Route
router.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        res.render('login', {failed : req.query.failed,  msg: req.flash('msg') });
    }
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login?failed=1',
    failureFlash: true
}));

// Signup Route
router.get('/signup', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        res.render('signup', {msg : req.flash('msg')});
    }
});

// Signup POST Handler with Username Check
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Convert username to lowercase
        const lowercaseUsername = username.toLowerCase();

        const existingUser = await User.findOne({ username: lowercaseUsername });
        if (existingUser) {
            // If username already exists, send error
            req.flash('msg', 'Username already exists');
            return res.redirect('/auth/signup?failed=1');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username: lowercaseUsername,
            password: hashedPassword
        });

        if (user) {
            req.flash('msg', 'User has been created correctly');
            res.redirect('/auth/login');
        }
    } catch (err) {
        req.flash('msg', 'An error occurred. Please try again.');
        res.redirect('/auth/signup?failed=1');
    }
});

// Logout Route
router.post('/logout', (req, res, next) => {
    req.logOut(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

module.exports = router;
