import { User, CreateUserRequest } from '../models/types';
import { hashPassword, comparePassword } from '../utils/password';
import { v4 as uuidv4 } from 'uuid';

// Тимчасове сховище користувачів (в продакшені буде база даних)
const users: User[] = [];

export const createUser = async (userData: CreateUserRequest): Promise<Omit<User, 'password'>> => {
  const existingUser = users.find(user => user.email === userData.email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  const hashedPassword = await hashPassword(userData.password);
  const newUser: User = {
    id: uuidv4(),
    email: userData.email,
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  users.push(newUser);

  const { password, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

export const authenticateUser = async (
  email: string,
  password: string
): Promise<Omit<User, 'password'> | null> => {
  const user = users.find(u => u.email === email);
  if (!user) {
    return null;
  }

  const isValidPassword = await comparePassword(password, user.password);
  if (!isValidPassword) {
    return null;
  }

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const getUserById = (id: string): Omit<User, 'password'> | null => {
  const user = users.find(u => u.id === id);
  if (!user) {
    return null;
  }

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};