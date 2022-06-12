import mongoose from 'mongoose';
import { IInvitation } from '../global/types';
const Schema = mongoose.Schema;

const invitationSchema = new Schema<IInvitation>({
	invitee: {
		type: String,
        require: true
	},
    inviter: {
        type: String,
        require: true
    },
    inviteId: {
        type: String,
        required: true,
        unique: true
    }
}, {
	timestamps: true
});

const Invitation = mongoose.model<IInvitation>('invitation', invitationSchema);

export default Invitation;