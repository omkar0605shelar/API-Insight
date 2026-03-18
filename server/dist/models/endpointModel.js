import mongoose, { Schema } from 'mongoose';
const EndpointSchema = new Schema({
    project_id: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    method: { type: String, required: true },
    path: { type: String, required: true },
    request_schema: { type: Schema.Types.Mixed },
    response_schema: { type: Schema.Types.Mixed }
});
const EndpointModel = mongoose.model('Endpoint', EndpointSchema);
export const createEndpoint = async (projectId, method, path, requestSchema, responseSchema) => {
    const endpoint = new EndpointModel({
        project_id: projectId,
        method,
        path,
        request_schema: requestSchema,
        response_schema: responseSchema
    });
    return await endpoint.save();
};
export const getEndpointsByProject = async (projectId) => {
    return await EndpointModel.find({ project_id: projectId });
};
export default EndpointModel;
