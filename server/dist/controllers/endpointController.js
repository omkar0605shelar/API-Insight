import { EndpointService } from '../services/endpointService.js';
const endpointService = new EndpointService();
export const getProjectEndpoints = async (req, res, next) => {
    const { projectId } = req.params;
    if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    try {
        const endpoints = await endpointService.getProjectEndpoints(projectId, req.user.id);
        res.json(endpoints);
    }
    catch (error) {
        next(error);
    }
};
