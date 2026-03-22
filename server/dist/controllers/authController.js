import { AuthService } from '../services/authService.js';
const authService = new AuthService();
export const register = async (req, res, next) => {
    const { name, email, password } = req.body;
    try {
        const result = await authService.register(name, email, password);
        res.status(201).json(result);
    }
    catch (error) {
        next(error);
    }
};
export const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const result = await authService.login(email, password);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};
export const googleAuth = async (req, res, next) => {
    const { tokenId } = req.body;
    if (!tokenId) {
        res.status(400).json({ message: 'Google Token is required' });
        return;
    }
    try {
        const result = await authService.googleAuth(tokenId);
        res.status(200).json(result);
    }
    catch (error) {
        console.error('Detailed Google Auth Error:', error.message || error);
        if (error.code === 'auth/id-token-expired') {
            res.status(401).json({ message: 'Authentication failed: Token expired' });
        }
        else if (error.code === 'auth/argument-error') {
            res.status(401).json({ message: 'Authentication failed: Invalid token argument' });
        }
        else {
            next(error);
        }
    }
};
