import axios from "axios";
import multer from "multer";
import FormData from "form-data";
import fs from "fs";
import { uploadFile } from "./fileController.js";

export const createArtist = async (req, res) => {
    const { name, description } = req.body;

    if (!name || !description || !req.file) {
        return res.status(400).json({
            success: false,
            message: "Name, description and image are required"
        });
    }

    try {
        
        const formData = new FormData();
        formData.append("file", fs.createReadStream(req.file.path), {
            filename: req.file.originalname,
            contentType: req.file.mimetype
        });


        const fileResponse = uploadFile(req.file);

        if (!fileResponse.data.filename) {
            return res.status(500).json({
                success: false,
                message: "File service did not return a filename"
            });
        }

        const image = fileResponse.data.filename;

        // 2. Save artist in DB Service
        const dbResponse = await axios.post(
            `${process.env.DB_SERVICE_ROUTER}/artist`,
            { name, description, image }
        );

        if (!dbResponse.data.success) {
            return res.status(500).json(dbResponse.data);
        }

        // 3. Cleanup temp file
        fs.unlink(req.file.path, () => { });

        return res.status(201).json(dbResponse.data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server Error : " + error
        });
    }

}

export const getArtists = async (req, res) => {

    try {

        const response = await axios.get(`${process.env.DB_SERVICE_ROUTER}/artist`);

        if (!response.data.success) {
            return res.status(500).json(response.data);
        }

        return res.status(200).json(response.data);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server Error : " + error
        });
    }

}