import { multerUpload } from "../../util/multerConfig.js";

export const uploadMusicFile= multerUpload.single("songFile");
