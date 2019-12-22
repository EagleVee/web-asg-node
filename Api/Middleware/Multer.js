import Multer, { diskStorage } from "multer";
import path from "path";
const storage = diskStorage({
  destination: function(req, file, cb) {
    cb(null, __dirname + "/UploadedFiles/");
  },
  // By default, multer removes file extensions so let's add them back
  filename: function(req, file, cb) {
    cb(
      null,
      file.originalname
    );
  }
});

const upload = Multer({
  storage: storage
});

export default upload;
