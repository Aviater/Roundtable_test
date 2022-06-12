import mongoose from 'mongoose';
import appConfig from '../config/app';
import User from '../models/user.model';
import { IUser } from '../global/types';

if(!appConfig.mongoUri) {
    throw new Error('Mongo URI env variable is missing.');
}

// Database connection
const uri: string =  appConfig.mongoUri;

mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
	console.log('MongoDB connection successful...');
});

connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

async function up () {
    // Write migration here
    const userData: IUser[] = [
        {
            email: 'benedict.marien@gmail.com',
            password: '$2a$10$BQD9oDqDfR.vp4y8fLx6iOc1ONQgike467UxC//2pZNvxA199HTyG',
            wallet: 0
        },
        {
            email: 'simon@roundtable.eu',
            password: '$2a$12$lJZKCtmjPGVF96yCbsRjbuvNOUkaGV.UuPHPUL5N/hgBlepuP8qPq',
            wallet: 0
        }
    ];

    try {
        await User.insertMany(userData);
    } catch(e) {
        console.log('Add user migration failed:', e);
        connection.collection("users").drop;
    }
}

async function down () {
    // Write migration here
    connection.collection("users").drop;
}

module.exports = { up, down };
