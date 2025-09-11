import axios from "axios";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const response = await axios.post(`${process.env.DB_SERVICE_ROUTER}/user/find`, {
            email, password
        });

        if (!response.data.success) {
            return res.status(500).json(response.data);
        }

        const validUser = response.data.user;

        const token = jwt.sign({
            id: validUser._id,
        }, process.env.JWT_SECRET);
        
        res.cookie('access_token', token, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 10000 }).status(200).json({
            success: true,
            user: validUser,
            message: 'user logged in successfully',
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Error : " + error,
        });
    }
}

export const register = async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;

    if (!/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({
            success: false,
            message: "email must be a valid email address",
        });
    } else {
        try {
            const response = await axios.post(`${process.env.DB_SERVICE_ROUTER}/user`, {
                firstName, lastName, email, password
            });
            console.log(response.data);
            return res.status(200).json(response.data);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error : " + error,
            });
        }
    }
}
