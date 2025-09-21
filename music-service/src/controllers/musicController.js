import axios from "axios";
import fs from "fs";
import { uploadFile } from "./fileController.js";

export const createMusic = async (req, res) => {
  console.log(req.body);
  const { name, artistId } = req.body;

  if (!name || !artistId || !req.files.image || !req.files.songFile) {
    return res.status(400).json({
      success: false,
      message: "Name, cover image, song file and artist id are required",
    });
  }

  try {
    // handle files upload
    const imageFileResponse = await uploadFile(req.files.image[0]);
    const songFileResponse = await uploadFile(req.files.songFile[0]);

    if (!imageFileResponse.data.filename) {
      return res.status(500).json({
        success: false,
        message:
          "Cover image upload failed : File service did not return a filename",
      });
    }

    if (!songFileResponse.data.filename) {
      return res.status(500).json({
        success: false,
        message:
          "Song file upload failed : File service did not return a filename",
      });
    }

    const response = await axios.post(
      `${process.env.DB_SERVICE_ROUTER}/music`,
      {
        name,
        artistId,
        image: imageFileResponse.data.filename,
        song: songFileResponse.data.filename,
      }
    );
    return res.status(200).json(response.data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error : " + error,
    });
  }
};

export const getMusic = async (req, res) => {
  try {
    const response = await axios.get(`${process.env.DB_SERVICE_ROUTER}/music`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error : " + error,
    });
  }
};

export const findMusicById = async (req, res) => {};

export const updateMusicById = async (req, res) => {};

export const deleteMusicById = async (req, res) => {};
