import express from 'express';
import  { Request , Response , NextFunction }  from 'express';
import { AuthPayload } from '../dto/Auth.dto';
import { validateUserToken } from '../utility/passwordUtiltiy';

declare global {
    namespace Express {
        interface Request { 
            user?: AuthPayload
        }
    }
}


const authenticateUser = async (req: Request, res: Response, next: NextFunction ) => {
    let isValidUser = await validateUserToken(req);

    if (isValidUser) { 
        next();
    } else { 
       return res.json({  "message" : "user not authenticatecd !!! "} );
    }
}


export { authenticateUser }

