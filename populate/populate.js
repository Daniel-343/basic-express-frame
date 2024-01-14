require('dotenv').config({ path: '../.env' });
const fs = require('fs');
const mongoose = require('mongoose');

const UserModel = require('../model/user');


const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
    console.error('Missing MONGO_URL environment variable');
    process.exit(1);
}

const main = async () => {
    console.log('Connecting to DB');
    await mongoose.connect(mongoUrl);
    console.log('Successfully connected to DB');

    await populateUsers();

    await mongoose.disconnect();
    console.log('Disconnected from DB');
};

main().catch((error) => {
    console.error(error);
    process.exit(1);
});

async function populateUsers() {
    await UserModel.deleteMany({});

    const users = [
        {
            userName: 'Daniel',
            password: '1324',
            email: 'danthe34@gmail.com'
        },
    ];


    await UserModel.create(users);
    console.log('Roles created');
}
