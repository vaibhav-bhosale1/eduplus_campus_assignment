// backend/src/utils/generateToken.ts
import jwt from 'jsonwebtoken';

const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET!, {
    expiresIn: '1h',
  });
};

export default generateToken;