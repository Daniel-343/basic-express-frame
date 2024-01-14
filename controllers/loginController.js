/* eslint-disable consistent-return */
const User = require('../model/user.js');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const daysToMilliSeconds = (days) => {
    return days * 24 * 60 * 60 * 1000;
};

const daysToDate = (days) => {
    const date = new Date();
    date.setTime(new Date().getTime() + (daysToMilliSeconds(days)));
    return date;
};


//Login user if the password is correct
const login = async (req, res) => {
    try {
        const tokenExpireDays = 1;
        const { username, password } = req.body;
        console.log(username + " " + password)
        const account = await User.findOne({ userName: username });
        if (!account) {
            return res.status(404).json({error: 'There is no account with this username'});
        }
        if (bcrypt.compare(password, account.password)) {
            const numberOfBytes = 32;
            const randomBytes = crypto.randomBytes(numberOfBytes);
            const randomHex = randomBytes.toString('hex');
            const newSessionId = randomHex;
            account.sessionId = newSessionId;
            const isSaved = await account.save();
            if (!isSaved) {
                return res.status(500).json({ error: 'Can\'t create token' });
            }
            res
                .status(200)
                .cookie(
                    'session',
                    newSessionId,
                    {
                        expires: daysToDate(tokenExpireDays),
                        sameSite: true,
                    },
                )
                .json({success: true});
        } else {
            res.status(401).json({ error: 'Wrong password' });
        }
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

const checkToken = (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            res.status(404).json({success: false, error: 'No such user'});
        }
        res.status(200).json({
            success: true,
            userName: user.userName
        });
    } catch (error) {
        res.status(400).json({success: false, error: error.message});
    }
};

const logout = async (req, res) => {
    try {
        const token = req.headers.token;
        const user = req.user;
        user.token = user.token.filter((item) => item !== token);
        const savedUser = await user.save();
        if (!savedUser) {
            res.status(404).json({success: false, error: 'No such user'});
        }
        res.status(200).clearCookie('token').json({success: true, message: 'User session is over'});
    } catch (error) {
        res.status(400).json({success: false, error: error.message});
    }
};

module.exports = {
    login,
    checkToken,
    logout,
};
