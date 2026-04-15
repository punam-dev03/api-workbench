import express from "express";
import {
  createNewCollection,
  fetchCollections,
  addRequest,
} from "../controllers/collection.controller.js";

const router = express.Router();

router.post("/", createNewCollection);
router.get("/", fetchCollections);
router.post("/:id/request", addRequest);

export default router;