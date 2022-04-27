import { VandorPayload } from "../dto/vandor.dto";
import jwt from "jsonwebtoken";
import { APP_SECRET } from "../config";
import { Request } from 'express';
import { AuthPayload } from '../dto/Auth.dto';
const bcrypt = require('bcrypt');

const generateSalt = async () => {
    return await bcrypt.genSalt()
}

const generatePassword = async  (password: string , salt: string) => {
    return await bcrypt.hash(password, salt)
}


const validateUserPassword = async (enteredPassword: string, salt: string, savedPasswordHash: string) => {
 return await generatePassword(enteredPassword, salt) === savedPasswordHash;
}

const generateToken = (payload: VandorPayload) => {
    return jwt.sign(payload, APP_SECRET, { expiresIn: "1d"} );
}

const validateUserToken = async (req: Request) => {
     let token = req.get("Authorization");

     if (token) { 
        let payload = jwt.verify(token.split(" ")[1], APP_SECRET) as AuthPayload;
        req.user = payload;
        return true 
     }

     return false 
}
 
export  {  validateUserToken , generateToken  , generateSalt , generatePassword , validateUserPassword }