import { multerUpload } from "../../util/multerConfig.js";

export const uploadArtistImage = multerUpload.single("image");
