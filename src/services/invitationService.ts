import { UpdateQuery } from 'mongoose';
import { IInvitation } from '../global/types';
import Invitation from '../models/invitation.model';

const findByInviter = async (email: string): Promise<IInvitation> => {
    const invitation = await Invitation.findOne({inviter: email}).exec();

    if(!invitation) {
        return Promise.reject(`Couldn't find invitation with inviter ID ${email}.`);
    }

    return invitation;
}

const findByInvitee = async (email: string): Promise<IInvitation> => {
    const invitation = await Invitation.findOne({invitee: email}).exec();

    if(!invitation) {
        return Promise.reject(`Couldn't find invitation for ${email}.`);
    }

    return invitation;
}

const addInvitation = async (invite: UpdateQuery<IInvitation>): Promise<IInvitation> => {
    const options = {
        new: true,
        upsert: true,
        rawResult: true
    };

    const result: IInvitation | null = await Invitation.findOneAndUpdate({invitee: invite.invitee}, invite, options).exec();

    if(!result) {
        return Promise.reject(`Unable to add new invitation: ${result}`);
    }
    
    return result;
}

export = { findByInviter, findByInvitee, addInvitation };