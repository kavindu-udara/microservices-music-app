import { multerUpload } from "../../util/multerConfig.js";

export const uploadMusicImage = multerUpload.single("image");
