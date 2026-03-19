import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { createUser, getUserByEmail } from '../models/userModel.js';
import { generateToken } from '../utils/jwtUtils.js';


export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;
  try {
    const userExists = await getUserByEmail(email);
    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await createUser(name, email, hashedPassword);
    res.status(201).json({
      id: (user as any)._id,
      name: user.name,
      email: user.email,
      token: generateToken((user as any)._id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user = await getUserByEmail(email);
    if (!user || !user.password) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    res.json({
      id: (user as any)._id,
      name: user.name,
      email: user.email,
      token: generateToken((user as any)._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

import admin from '../config/firebaseAdmin.js';

export const googleAuth = async (req: Request, res: Response): Promise<void> => {
  const { tokenId } = req.body;
  
  if (!tokenId) {
    res.status(400).json({ message: 'Google Token is required' });
    return;
  }

  try {
    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(tokenId);
    
    if (!decodedToken) {
      res.status(401).json({ message: 'Invalid Google Token payload' });
      return;
    }

    const { email, name, uid: google_id } = decodedToken;
    
    if (!email) {
      res.status(400).json({ message: 'Google account must have an email' });
      return;
    }

    let user = await getUserByEmail(email);

    if (!user) {
      // Create new user for Google login (password is optional)
      user = await createUser(name || email.split('@')[0], email, undefined, google_id);
      console.log(`New user created via Google: ${email}`);
    }

    res.status(200).json({
      id: (user as any)._id,
      name: user.name,
      email: user.email,
      token: generateToken((user as any)._id),
    });
  } catch (error: any) {
    console.error('Detailed Google Auth Error:', error.message || error);
    
    if (error.code === 'auth/id-token-expired') {
       res.status(401).json({ message: 'Authentication failed: Token expired' });
    } else if (error.code === 'auth/argument-error') {
       res.status(401).json({ message: 'Authentication failed: Invalid token argument' });
    } else {
       res.status(500).json({ message: 'Google auth failed internally' });
    }
  }
};
