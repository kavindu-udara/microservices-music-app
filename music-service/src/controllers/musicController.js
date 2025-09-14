import axios from "axios";

export const createMusic = async (req, res) => {
    const { name, image, song, artistId } = req.body;

    // TODO : validations

    try {
        const response = await axios.post(`${process.env.DB_SERVICE_ROUTER}/music`, {
            name, image, song, artistId
        });
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error : " + error,
        });
    }

}

export const getMusic = async (req, res) => {

    // TODO : validations

    try {
        const response = await axios.get(`${process.env.DB_SERVICE_ROUTER}/music`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error : " + error,
        });
    }
}

export const findMusicById = async (req, res) => {

}

export const updateMusicById = async (req, res) => {

}

export const deleteMusicById = async (req, res) => {

}
