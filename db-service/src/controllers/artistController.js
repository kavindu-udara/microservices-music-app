import Artist from "../models/ArtistModel.js";

export const createArtist = async (req, res) => {
    const { name, description, image } = req.body;

    try {
        const artist = {
            name, description, image
        }

        const validArtist = await Artist.findOne({ name });

        if (validArtist) {
            return res.status(200).json({
                success: false,
                message: "Artist with this name already exist"
            });
        }

        const newData = new Artist(artist);
        const savedData = await newData.save();

        return res.status(201).json({
            success: true,
            message: "Artist created",
            artist: savedData
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server Error : " + error
        });
    }

}

export const getAllArtists = async (req, res) => {
    
    try {
        const artists = await Artist.find();

        if (!artists) {
            return res.status(404).json({
                success: false,
                message: "Artist not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Artists found",
            artists
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server Error : " + error
        });
    }
}
