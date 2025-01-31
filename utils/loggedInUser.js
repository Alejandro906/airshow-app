const User = require('../models/User');

const addLoggedInUser = async (req, res, next) => {
    if (req.isAuthenticated()) {
        try {
            const user = await User.findById(req.user.id);
            res.locals.loggedIn = user;
        } catch (err) {
            console.error('Error fetching logged-in user:', err);
            next(err);
        }
    } else {
        res.locals.loggedIn = null;
    }
    next();
};

module.exports = { addLoggedInUser };
