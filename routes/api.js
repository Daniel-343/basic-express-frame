const express = require('express');
const router = express.Router();

const { login, checkToken, logout } = require('../controllers/loginController');

const returnTestResponse = async (req, res) => {
    try {
        res
            .status(200)
            .json({
                info: "server up and running",
                time: `${new Date(Date.now())}`
            });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const {
    getAllUsers,
    getOneUser,
    addOneUser,
    deleteOneUser,
    updateOneUser,
    getOneUserbyEmail,
    resetSecurityCode,
    changePassword,
    deleteSecurityNumber,
    getOneUserByToken,
} = require('../controllers/usersController');

const {
    idValidation,
    userValidation,
    userDataValidation,
    userIdValidation,
} = require('../controllers/validation');


router.route('/login')
    .get(userValidation, checkToken)
    .post(login)
    .delete(userValidation, logout);

    router.route('/users')
  .get(userValidation, getAllUsers)
  .post(userDataValidation, addOneUser);

router.route('/users/token')
    .get(getOneUserByToken);

router.route('/users/:id')
    .get(idValidation, userValidation, userIdValidation, getOneUser)
    .delete(idValidation, userValidation, userIdValidation, deleteOneUser)
    .patch(idValidation, userValidation, userDataValidation, userIdValidation, updateOneUser);

    router.route('/test')
    .get(returnTestResponse);

module.exports = router;
