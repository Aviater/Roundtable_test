const router = require('express').Router();
import { Request, Response } from 'express';
import authService from '../services/authService';

router.route('/login').post(async (req: Request, res: Response) => {
    const { email, password }: { email: string, password: string } = req.body;

    if(!email || !password) {
        return res.status(400).send('Email and password fields are required.');
    }

    try {
        const user = await authService.authenticate(email, password);
        const payload = {
            user,
            token: 'this-simulates-an-access-token'
        }
    
        return res.send(payload);
    } catch(e) {
        return res.status(401).send(e);
    }
});

export default router;