import bcrypt from 'bcryptjs';
import { createUser, getUserByEmail } from '../models/userModel.js';
import { generateToken } from '../utils/jwtUtils.js';
import { OAuth2Client } from 'google-auth-library';
export const register = async (req, res) => {
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
            id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
export const login = async (req, res) => {
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
            id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export const googleAuth = async (req, res) => {
    const { tokenId } = req.body;
    if (!tokenId) {
        res.status(400).json({ message: 'Google Token is required' });
        return;
    }
    try {
        // For Firebase Auth tokens, the audience is the Firebase Project ID
        // If using pure Google login, it's the Google Client ID
        const audience = (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== 'mock_google_client_id')
            ? process.env.GOOGLE_CLIENT_ID
            : process.env.FIREBASE_PROJECT_ID;
        if (!audience) {
            console.error('Backend Configuration Error: GOOGLE_CLIENT_ID or FIREBASE_PROJECT_ID is missing.');
            res.status(500).json({ message: 'Server configuration error' });
            return;
        }
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: audience,
        });
        const payload = ticket.getPayload();
        if (!payload) {
            res.status(401).json({ message: 'Invalid Google Token payload' });
            return;
        }
        const { email, name, sub: google_id } = payload;
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
            id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    }
    catch (error) {
        console.error('Detailed Google Auth Error:', error.message || error);
        if (error.message?.includes('audience mismatch')) {
            res.status(401).json({ message: 'Authentication failed: Client ID mismatch' });
        }
        else if (error.message?.includes('expired')) {
            res.status(401).json({ message: 'Authentication failed: Token expired' });
        }
        else {
            res.status(500).json({ message: 'Google auth failed internally' });
        }
    }
};
