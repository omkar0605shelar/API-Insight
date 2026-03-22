import { AIService } from '../services/aiService.js';
const aiService = new AIService();
export const explainEndpoint = async (req, res, next) => {
    const { endpointId } = req.params;
    if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    try {
        const explanation = await aiService.explainEndpoint(endpointId);
        res.json(explanation);
    }
    catch (error) {
        next(error);
    }
};
