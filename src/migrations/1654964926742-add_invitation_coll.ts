import mongoose from 'mongoose';
import appConfig from '../config/app';
import Invitation from '../models/invitation.model';
import { IInvitation } from '../global/types';

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
    const inviteData: IInvitation[] = [{
        invitee: 'simon@roundtable.eu',
        inviter: 'benedict.marien@gmail.com',
        inviteId: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
    }];

    try {
        await Invitation.insertMany(inviteData);
    } catch(e) {
        connection.collection("invitations").drop;
    }
}

async function down () {
    // Write migration here
    connection.collection("invitations").drop;
}

module.exports = { up, down };
