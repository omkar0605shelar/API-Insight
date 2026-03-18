import mongoose, { Schema } from 'mongoose';
const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    google_id: { type: String },
    created_at: { type: Date, default: Date.now }
});
const UserModel = mongoose.model('User', UserSchema);
export const createUser = async (name, email, password, google_id) => {
    const user = new UserModel({ name, email, password, google_id });
    return await user.save();
};
export const getUserByEmail = async (email) => {
    return await UserModel.findOne({ email });
};
export const getUserById = async (id) => {
    return await UserModel.findById(id);
};
export default UserModel;
