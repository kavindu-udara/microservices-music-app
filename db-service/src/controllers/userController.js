import User from "../models/UserModel.js";
import bcryptjs from "bcryptjs";

const createUser = async (req, res) => {

    const { firstName, lastName, email, password } = req.body;

    try {

        const validUser = await User.findOne({ email });

        if (validUser) {
            return res.status(200).json({
                success: false,
                message: "User with email address already exist",
            });
        }

        const hashedPassword = bcryptjs.hashSync(password, 10);
        const user = {
            firstName, lastName, email, password: hashedPassword
        }

        const newData = new User(user);
        const savedData = await newData.save();
        const { password, ...others } = savedData._doc;

        return res.status(201).json({
            success: true,
            message: "User created",
            user: others
        });

    } catch (error) {
        console.error('Error creating data: ', error);
        throw error;
    }
}

const findUserByEmailAndPassword = async (req, res) => {

    const { email, password } = req.body;

    try {

        const validUser = await User.findOne({ email });
        if (!validUser) {
            return res.json({
                success: false,
                message: "user not found",
            });
        }

        const validPassword = bcryptjs.compareSync(req.body.password, validUser.password);
        if (!validPassword) {
            return res.status(200).json({
                success: false,
                message: "invalid password",
            });
        }

        const { password, ...others } = validUser._doc;

        res.json({
            success: true,
            message: "user found",
            user: others
        });

    } catch (error) {
        console.error(error);
        res.json({
            success: false,
            message: "Error : " + error
        })
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

export { createUser, getUserById, updateUser, deleteUser, findUserByEmailAndPassword }