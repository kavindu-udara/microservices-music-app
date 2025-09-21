import Artist from "../models/ArtistModel.js";
import Music from "../models/MusicModel.js";

export const createMusic = async (req, res) => {
  const { name, artistId , image, song} = req.body;

  if (!name || !artistId || !image || !song) {
    return res.status(400).json({
      success: false,
      message: "Name, cover image, song file and artist id are required",
    });
  }

  try {
    const validArtist = Artist.findById(artistId);

    if (!validArtist) {
      res.status(404).json({
        success: true,
        message: "Artist not found",
      });
    }

    const music = {
      name,
      image,
      song,
      artist: artistId,
    };

    const newData = new Music(music);
    const savedData = await newData.save();

    res.status(200).json({
      success: true,
      message: "music created",
      music: savedData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error : " + error,
    });
  }
};

export const getMusic = async (req, res) => {
  try {
    const songs = await Music.find();

    if (!songs) {
      return res.status(404).json({
        success: false,
        message: "Songs not available",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Songs available",
      songs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error : " + error,
    });
  }
};
