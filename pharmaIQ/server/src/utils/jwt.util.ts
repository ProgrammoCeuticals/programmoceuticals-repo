import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'pharmacare_secret';
const EXPIRES = process.env.JWT_EXPIRES_IN || '7d';

export const signToken = (payload: object) => jwt.sign(payload, SECRET, { expiresIn: EXPIRES } as any);
export const verifyToken = (token: string) => jwt.verify(token, SECRET);
