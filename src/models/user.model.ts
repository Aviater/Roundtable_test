import mongoose from 'mongoose';
import { IUser } from '../global/types';
const Schema = mongoose.Schema;

const userSchema = new Schema<IUser>({
	email: {
		type: String,
        required: true,
        unique: true
	},
    password: {
        type: String,
        required: true
    },
    wallet: {
        type: Number,
        required: true
    }
}, {
	timestamps: true
});

const User = mongoose.model<IUser>('user', userSchema);

export default User;