const mongoose = require('mongoose');
const User = require('../model/user.js');

// Mongoose validation

const idValidation = (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'ID is not valid'});
    }
    next();
};

const userValidation = async (req, res, next) => {
    const sessionId = req.cookies.session;
    const user = await User.findOne({sessionId: sessionId});
    if (!user) {
        return res.status(404).json({success: false, error: 'No such user'});
    }
    req.user = user;
    next();
};

const userDataValidation = async (req, res, next) => {
    const userName = await User.findOne({userName: req.body.username});
    if (userName) {
        return res.status(403).json({error: 'There is already a User with this Username'});
    }
    const userEmail = await User.findOne({email: req.body.email});
    if (userEmail) {
        return res.status(403).json({error: 'This email address is already used'});
    }
    next();
};



const userIdValidation = async (req, res, next) => {
    const { id } = req.params;
    const token = req.headers.token;
    const isAdmin = req.isAdmin;
    const user = await User.findById(id);
    if (!user || (!isAdmin && !user.token.includes(token))) {
        return res.status(400).json({error: 'Wrong ID'});
    }
    req.userData = user;
    next();
};

module.exports = {
    idValidation,
    userValidation,
    userDataValidation,
    userIdValidation,
};
