import express from "express";
import { handleApiRequest } from "../controllers/api.controller.js";

const router = express.Router();

router.post("/send", handleApiRequest);

export default router;