import axios from "axios";

export const createArtist = async (req, res) => {
    const { name, description, image } = req.body;

    if(!name || !description || !image){
        return res.status(500).json({
            success: false,
            message: "All fields are required" 
        });
    }

    try {

        const response = await axios.post(`${process.env.DB_SERVICE_ROUTER}/artist`, {
            name, description, image
        });

        if (!response.data.success) {
            return res.status(500).json(response.data);
        }

        return res.status(201).json(response.data);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server Error : " + error
        });
    }

}
