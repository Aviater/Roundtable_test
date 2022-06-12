const router = require('express').Router();
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import appConfig from '../config/app';
import { verifyAccessToken } from '../middleware/auth';
import mailer from '../utils/mailer';
import userService from '../services/userService';
import invitationService from '../services/invitationService';
import { IUser, IInvitation } from '../global/types';
import '../helpers/date.helper';


// Fetch by id.
router.route('/:id').get(verifyAccessToken, async (req: Request, res: Response) => {
    try {
        const user: IUser = await userService.findById(req.params.id);
        return res.send(user);
    } catch(e) {
        return res.status(404).send(e);
    }
});


// Send invitation link.
router.route('/invite').post(verifyAccessToken, async (req: Request, res: Response) => {
    const { inviteeEmail, inviterEmail }: {inviteeEmail: string, inviterEmail: string} = req.body;
    const inviteId = uuidv4();
    const invite: IInvitation = {
        invitee: inviteeEmail,
        inviter: inviterEmail,
        inviteId
    }

    // Add the invitation document to DB.
    invitationService.addInvitation(invite)
        .then(payload => {
            // Send the invite email.
            mailer.sendInviteEmail(inviteId, inviteeEmail)
                .then(msg => {
                    return res.send(`Email server ${msg.response} - Successfully sent to ${msg.envelope.to}.`);
                })
                .catch(e => {
                    return res.status(500).send(e);
                });
        })
        .catch(e => {
            return res.status(500).send(e);
        });
});


// Add new user.
router.route('/register/:id').post(async (req: Request, res: Response) => {
    const emailRegexp: RegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    const { email, password }: {email: string, password: string} = req.body;
    const inviteId: string = req.params.id;
    
    // Check for mising email or password.
    if(!email || !password) {
        return res.status(400).send('User registration requires email and password.');
    }

    // Check for valid email address.
    if(!emailRegexp.test(email)) {
        return res.status(400).send('Invalid email.');
    }

    // Check that an invite for entered email address exists.
    let invite: IInvitation;
    try {
        invite = await invitationService.findByInvitee(email);
    } catch(e) {
        return res.status(403).send(e);
    }

    // Otherwise TS complains.
    if(!invite.updatedAt) {
        return res.status(403).send('Update field missing.');
    }

    // Check that the invite IDs match.
    if(invite.inviteId !== inviteId) {
        return res.status(403).send('Incorrect invite link.');
    }

    // Check if the invitation has expired.
    const dtNow = new Date();
    const dtInvite = invite.updatedAt.addDays(appConfig.inviteExp);
    if(dtNow.getTime() > dtInvite.getTime()) {
        return res.status(403).send('The invitation link has expired.');
    }

    // Add the new user.
    userService.addUser(req.body)
        .then(async newUser => {
            // Add bonus to the referer wallet.
            const updatedUser = await userService.addCapital(invite.inviter);
            return res.send(`New user registration: ${newUser.email} - Bonus deposited for ${updatedUser.email}`);
        })
        .catch(e => {
            return res.status(500).send(e);
        });
});

export default router;