import { Request, Response } from 'express';
import { createUser, authenticateUser } from '../services/userService';
import { generateToken } from '../utils/jwt';
import { CreateUserRequest, LoginRequest, LoginResponse } from '../models/types';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: CreateUserRequest = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const user = await createUser({ email, password });
    const token = generateToken({ userId: user.id, email: user.email });

    const response: LoginResponse = {
      token,
      user
    };

    res.status(201).json(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Registration failed';
    res.status(400).json({ error: errorMessage });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: LoginRequest = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const user = await authenticateUser(email, password);
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = generateToken({ userId: user.id, email: user.email });

    const response: LoginResponse = {
      token,
      user
    };

    res.json(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Login failed';
    res.status(500).json({ error: errorMessage });
  }
};