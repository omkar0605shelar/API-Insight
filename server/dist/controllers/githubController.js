import { GithubService } from '../services/githubService.js';
const githubService = new GithubService();
export const getRepos = async (req, res, next) => {
    const { accessToken } = req.body;
    if (!accessToken) {
        res.status(400).json({ message: 'GitHub Access Token is required' });
        return;
    }
    try {
        const repos = await githubService.getUserRepos(accessToken);
        res.json(repos);
    }
    catch (error) {
        next(error);
    }
};
export const getRepoDetail = async (req, res, next) => {
    const { accessToken, fullName } = req.body;
    if (!accessToken || !fullName) {
        res.status(400).json({ message: 'GitHub Access Token and Full Name are required' });
        return;
    }
    try {
        const repo = await githubService.getRepoDetails(accessToken, fullName);
        res.json(repo);
    }
    catch (error) {
        next(error);
    }
};
