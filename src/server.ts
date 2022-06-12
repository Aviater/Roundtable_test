import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
require('dotenv').config();
import appConfig from './config/app';
const app = express();

// Middleware and Cors.
app.use(cors());
app.use(express.json());

// Database connection.
if(!appConfig.mongoUri) {
    throw new Error('Mongo URI env variable is missing.');
};

mongoose.connect(appConfig.mongoUri);
const connection = mongoose.connection;
connection.once('open', () => {
	console.log('MongoDB connection successful...');
});

// Use routes.
import usersRouter from './routes/users';
import authRouter from './routes/auth';
app.use('/user', usersRouter);
app.use('/auth', authRouter);


const { port } = appConfig;
app.listen(port, () => console.log(`Server started on port ${port}...`));
