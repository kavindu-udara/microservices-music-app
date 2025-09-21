import fs from "fs";
import FormData from "form-data";
import axios from "axios";

export const uploadFile = async (file) => {

  const formData = new FormData();

  formData.append("file", fs.createReadStream(file.path), {
    filename: file.originalname,
    contentType: file.mimetype,
  });

  const fileResponse = await axios.post(
    `${process.env.FILES_SERVICE_ROUTER}/upload`,
    formData,
    {
      headers: {
        ...formData.getHeaders(),
      },
    }
  );

  return fileResponse;
};
