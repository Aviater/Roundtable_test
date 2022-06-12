import bcrypt from 'bcrypt';
import User from '../models/user.model';
import { IUserObject } from '../global/types';

const authenticate = async (email: string, password: string): Promise<IUserObject> => {
    const user = await User.findOne({email: email}).select('-__v').exec();
    if(!user) {
        return Promise.reject(`Couldn't find user ${email}.`);
    }

    const match = await bcrypt.compare(password, user.password);
    if(!match) {
        return Promise.reject(`Password authentication failed for ${email}.`);
    }

    const userObj: IUserObject = {
        email: user.email,
        wallet: user.wallet
    };

    return userObj;
};

export = { authenticate };