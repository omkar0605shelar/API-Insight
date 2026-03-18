import mongoose, { Schema } from 'mongoose';
const ProjectSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    repository_url: { type: String, required: true },
    status: { type: String, default: 'pending' },
    created_at: { type: Date, default: Date.now }
});
const ProjectModel = mongoose.model('Project', ProjectSchema);
export const createProject = async (userId, repositoryUrl) => {
    const project = new ProjectModel({ user_id: userId, repository_url: repositoryUrl });
    return await project.save();
};
export const getProjectsByUser = async (userId) => {
    return await ProjectModel.find({ user_id: userId }).sort({ created_at: -1 });
};
export const getProjectById = async (id, userId) => {
    return await ProjectModel.findOne({ _id: id, user_id: userId });
};
export const updateProjectStatus = async (id, status) => {
    await ProjectModel.updateOne({ _id: id }, { status });
};
export default ProjectModel;
