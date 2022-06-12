import { RequestHandler } from 'express';

const verifyAccessToken: RequestHandler = (req, res, next) => {
    const token: string | undefined = req.headers.authorization;

    if(!token) {
        return res.status(501).send('Missing authorization header.');
    };

    if(token !== 'Bearer this-simulates-an-access-token') {
        return res.status(501).send('Unauthorised');
    }

    next();
}

export { verifyAccessToken };