
// utils/generateToken.js
import jwt from 'jsonwebtoken';

export const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role }, // ✅ Include both `id` and `role`
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};
