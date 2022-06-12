import bcrypt from 'bcrypt';
import appConfig from '../config/app';
import User from '../models/user.model';
import { IUser } from '../global/types';

const findById = async (id: string): Promise<IUser> => {
    const user = await User.findById(id).select('-__v -password').exec();

    if(!user) {
        return Promise.reject(`Couldn't fund user with id ${id}.`);
    }

    return user;
}

const addCapital = async (email: string): Promise<IUser> => {
    const user = await User.findOne({email: email}).exec();
    if(!user) {
        return Promise.reject(`Couldn't add bonus, ${email} not found.`);
    }
    user.wallet += 1000;

    try {
        const result = await user.save();
        return result;
    } catch(e) {
        return Promise.reject(`Unable to add capital to user wallet ${e}`);
    }
}

const addUser = async (payload: {email: string, password: string}): Promise<IUser> => {
    const user: IUser = {...payload, wallet: 0};

    // First check if the user exists.
    const existingUser = await User.findOne({email: user.email}).exec();
    if(existingUser) {
        return Promise.reject(`User with email ${user.email} already exists.`);
    }

    // Hash the password.
    user.password = await bcrypt.hash(user.password, appConfig.bcryptSaltRounds);

    // Save the new user.
    const newUser = new User(user);
    try {
        const result: IUser = await newUser.save();
        return result;
    } catch(e) {
        return Promise.reject(`Unable to add new user: ${e}`);
    }
}

export = { addUser, addCapital, findById };