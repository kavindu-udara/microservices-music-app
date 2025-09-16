import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";

// Configure multer storage dynamically
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let baseDir = "data";

        // Default folder based on file type
        let folder = "others";

        // Check query parameter
        const filetype = req.query.filetype;

        if (file.mimetype.startsWith("image/")) {
            folder = "images";
            if (filetype === "userImage") {
                folder = "images/users";
            } else if (filetype === "artistImage") {
                folder = "images/artists";
            }
        } else if (file.mimetype.startsWith("audio/")) {
            folder = "songs";
        }

        const uploadPath = path.join(baseDir, folder);
        // Ensure the directory exists
        fs.mkdirSync(uploadPath, { recursive: true });

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const newName = uuidv4() + ext;
        cb(null, newName);
    }
});

const upload = multer({ storage });

// Controller function
export const uploadFile = (req, res) => {
    upload.single("file")(req, res, (err) => {
        if (err) {
            return res.status(500).json({ error: "File upload failed", details: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        res.json({
            filename: req.file.filename
        });
    });
};