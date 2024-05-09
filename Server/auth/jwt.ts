import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

 export const secretKey = 'qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM.,1234567890!@#$%^&*()';

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  console.log('Token---->',token);
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Token missing' });
  }
  const [, actualToken] = token.split(' ');
  try {
    const decodedToken: any = jwt.verify(actualToken, secretKey);
    next();
  } catch (error) {
    console.error('Error decoding token:', error);
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

export default authenticateToken;
