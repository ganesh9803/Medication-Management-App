// File: /src/controllers/auth.controller.js
import prisma from '../config/prismaClient.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Prisma } from '@prisma/client';

import { generateToken } from '../utils/generateToken.js'; // Make sure this is imported

export const signup = async (req, res) => {
  const { name, email, password, role, caretakerId } = req.body;
  try {
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Validation failed",
        error: "All fields (name, email, password, role) are required",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hash,
        role,
        ...(role === 'PATIENT'
          ? {
              patient: {
                create: {
                  ...(caretakerId && { caretakerId }),
                },
              },
            }
          : {
              caretaker: {
                create: {},
              },
            }),
      },
    });

    const token = generateToken(user.id, user.role);
    res.status(201).json({ token, role: user.role });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2002'
    ) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    console.error('Signup error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
