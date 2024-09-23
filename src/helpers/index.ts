import crypto from 'crypto';
const SECRET = 'ANTONIO-REST-API';

export const generateRandomString = (length: number): string => {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}
export const authentication = (salt: string, password: string) => {  
    return crypto.createHmac('sha256', [salt, password].join('/')).update(SECRET).digest('hex');
};


