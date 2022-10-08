const { google } = require("googleapis");
const multer = require("multer");

const storage = multer.memoryStorage();
const uploads = multer({ storage });
const fs = require("fs");
const stream = require("stream");

module.exports = {
  uploadFiles: async (req, res, next) => {
    try {
      const auth = new google.auth.GoogleAuth({
        keyFile: "./gderivekey.json",
        scopes: ["https://www.googleapis.com/auth/drive"],
      });

      const services = google.drive({
        version: "v3",
        auth,
      });

      const fileMetaData = {
        name: req.file.originalname,
        parents: [process.env.DRIVE_FOLDER_ID],
      };

      const buffer = new stream.PassThrough();
      buffer.end(req.file.buffer);

      const media = {
        // mimeType: req.file.mimetype,

        mimeType: req.file.mimetype,
        body: buffer,
      };

      const res = await services.files.create({
        resource: fileMetaData,
        media: media,
        fields: "id",
      });

      req.imgLink = `${process.env.GDRIVE_PREFIX}=${res.data.id}`;
      next();
    } catch (error) {
      console.log(`error de catch middlewere ${error}`);
    }
  },
};
