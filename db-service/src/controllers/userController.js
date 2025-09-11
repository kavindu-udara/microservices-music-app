import User from "../models/UserModel.js";

const createUser = async (data) => {
    try {
        const newData = new User(data);
        const savedData = await newData.save();
        return { success: true, data: savedData };
    } catch (error) {
        console.error('Error creating data: ', error);
        throw error;
    }
}

const getUserById = async (id) => {
    try {
        const data = await User.findById(id);
        return { success: true, data };
    } catch (error) {
        console.error('Error getting data: ', error);
        throw error;
    }
}

const updateUser = async (id, updates) => {
    try {
        const updatedData = await User.findByIdAndUpdate(
            id,
            updates,
            { new: true }
        );
        return { success: true, data: updatedData };
    } catch (error) {
        console.error('Error updating data: ', error);
        throw error;
    }
}

const deleteUser = async (id) => {
    try {
        await User.findByIdAndDelete(id);
        return { success: true };
    } catch (error) {
        console.error('Error deleting data: ', error);
        throw error;
    }
}

export {createUser, getUserById, updateUser, deleteUser}