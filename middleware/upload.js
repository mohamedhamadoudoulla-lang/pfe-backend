const multer = require("multer");
const path = require("path");

const cvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/cvs"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `cv_${Date.now()}_${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const planStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/plans"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `plan_${Date.now()}_${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const pdfFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Seuls les fichiers PDF sont acceptés"), false);
  }
};

const imageFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Format non accepté (JPEG/PNG/WebP/PDF)"), false);
  }
};

const uploadCv = multer({ storage: cvStorage, fileFilter: pdfFilter, limits: { fileSize: 5 * 1024 * 1024 } });
const uploadPlan = multer({ storage: planStorage, fileFilter: imageFilter, limits: { fileSize: 10 * 1024 * 1024 } });

module.exports = { uploadCv, uploadPlan };
