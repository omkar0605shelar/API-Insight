import prisma from '../config/client.js';
export const authorize = (roles) => {
    return async (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        // Identify target team or project from request
        const teamId = req.params.teamId || req.body.teamId;
        const projectId = req.params.projectId || req.body.projectId || req.params.id;
        try {
            if (teamId) {
                const membership = await prisma.teamMember.findUnique({
                    where: {
                        team_id_user_id: {
                            team_id: teamId,
                            user_id: req.user.id
                        }
                    }
                });
                if (!membership || !roles.includes(membership.role)) {
                    res.status(403).json({ message: 'Forbidden: Insufficient team permissions' });
                    return;
                }
            }
            else if (projectId) {
                const project = await prisma.project.findUnique({
                    where: { id: projectId },
                    include: { team: { include: { members: true } } }
                });
                if (!project) {
                    // If project doesn't exist, we can't authorize based on it. 
                    // Usually handled by the controller, but let's allow it to pass or fail.
                    next();
                    return;
                }
                // If it's a personal project, check if owner
                if (!project.team_id) {
                    if (project.user_id !== req.user.id) {
                        res.status(403).json({ message: 'Forbidden: You do not own this project' });
                        return;
                    }
                }
                else {
                    // If it's a team project, check membership and role
                    const membership = project.team?.members.find((m) => m.user_id === req.user?.id);
                    if (!membership || !roles.includes(membership.role)) {
                        res.status(403).json({ message: 'Forbidden: Insufficient project permissions' });
                        return;
                    }
                }
            }
            next();
        }
        catch (error) {
            console.error('RBAC Middleware Error:', error);
            res.status(500).json({ message: 'Internal server error during authorization' });
        }
    };
};
