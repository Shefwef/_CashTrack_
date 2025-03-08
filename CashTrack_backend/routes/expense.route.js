import express from "express";
import { uploadSingle, uploadSingleFile } from "../config/multer.config.js";
import authenticate from "../middleware/auth.middleware.js";
import { validateExpense } from "../middleware/validation.middleware.js";
import {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  viewMedia,
  deleteMedia,
  generateReport,
} from "../controllers/expense.controller.js";

const router = express.Router();

// creating an expensse
router.post("/", authenticate, uploadSingle, validateExpense, createExpense);

// getting all expenses
router.get("/", authenticate, getExpenses);

// ensuring multer handles the file upload for mediaFile
router.put(
  "/:id",
  authenticate,
  (req, res, next) => {
    if (!req.headers["content-type"]?.includes("multipart/form-data")) {
      return next();
    }
    // using the middleware that handles file uploads
    uploadSingleFile(req, res, next);
  },
  validateExpense,
  updateExpense
);

// deleting an expense
router.delete("/:id", authenticate, deleteExpense);

// viewing media file
router.get("/media/:filePath", viewMedia);

// deleting only the media file
router.delete("/media/:id", authenticate, deleteMedia);

// generating report PDF/CSV
router.get("/report", authenticate, generateReport);

export default router;
