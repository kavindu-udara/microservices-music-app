import axios from "axios";
import multer from "multer";
import FormData from "form-data";
import fs from "fs";

// Temp storage just to receive the file before forwarding
const upload = multer({ dest: "temp/" });
export const uploadArtistImage = upload.single("image");
