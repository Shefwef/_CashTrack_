import multer from "multer";
import fs from "fs";
import path from "path";

// ensuring the upload directory exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// configuring storage settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

// allowing image and pdf files
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/pdf",
  ];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
  }
  cb(null, true);
};

// Multer upload instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1, // Allow only 1 file
  },
});

// Upload Middleware ✅
export const uploadSingle = multer({ storage }).single("mediaFile");

// 🔥 Delete File Function
export const deleteFile = async (filename) => {
  try {
    const filePath = path.join("uploads", filename);
    if (fs.existsSync(filePath)) {
      console.log(`Deleting File: ${filename}`);
      await fs.promises.unlink(filePath);
      console.log("File Deleted Successfully");
    } else {
      console.log(`File Not Found: ${filename}`);
    }
  } catch (error) {
    console.error("Error Deleting File:", error.message);
  }
};

// Middleware for single file upload
export const uploadSingleFile = (req, res, next) => {
  const uploadHandler = upload.single("mediaFile");

  console.log("Starting file upload...");

  uploadHandler(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error("Multer Error:", err.message);
      return res.status(400).json({ error: `Multer Error: ${err.message}` });
    }

    if (err) {
      console.error("Unknown Error:", err.message);
      return res.status(500).json({ error: `Unknown Error: ${err.message}` });
    }

    console.log("File upload successful!");
    next();
  });
};

export default upload;
