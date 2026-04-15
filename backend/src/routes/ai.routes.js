import express from "express";
import { handleAiAnalysis } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/analyze", handleAiAnalysis);

export default router;