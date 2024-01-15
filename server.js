require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const apiRouter = require('./routes/api');
const cookieParser = require('cookie-parser');

const {MONGO_URL, PORT = 8081} = process.env;

if (!MONGO_URL) {
    console.error('Missing MONGO_URL environment variable');
    process.exit(1);
}

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(cookieParser());
app.use('/api', apiRouter);

const main = async () => {
    await mongoose.connect(MONGO_URL);

    const server = app.listen(PORT, () => {
        console.log(`App is listening on ${PORT}`);
    });

};

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
