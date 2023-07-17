
import multer from "multer";

const filter = (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file format'), false);
    }
  };

const upload = multer({ 
    dest: 'uploads/',
    fileFilter: filter 
}).single('image');

export default upload