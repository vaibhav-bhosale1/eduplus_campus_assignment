// backend/src/utils/generateToken.ts
import jwt from 'jsonwebtoken';

const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET!, {
    expiresIn: '1h', // Token expires in 1 hour
  });
};

export default generateToken;