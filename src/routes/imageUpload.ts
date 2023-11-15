import { Router, Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import* as multer from 'multer';

const router = Router();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + file.originalname);
  }
});

const upload = multer({ storage });

router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      // The file has been uploaded to Cloudinary
      res.json({ url: result.secure_url }); // Return the URL of the uploaded file
    } else {
      res.status(400).send('No file uploaded');
    }
  } catch (error) {
    res.status(500).send('Error uploading file');
  }
});

export default router;
