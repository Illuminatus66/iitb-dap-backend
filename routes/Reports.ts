import express from "express";
import {
  fetchAllReports,
  uploadAudio,
  uploadDetailsWithoutAudio,
  triggerReportGeneration,
} from "../controllers/Reports";

const router = express.Router();

router.get("/fetch-all-reports", fetchAllReports);
router.post("/upload-audio", uploadAudio);
router.post("/upload-details", uploadDetailsWithoutAudio);
router.post("/generate-report", triggerReportGeneration);

export default router;
