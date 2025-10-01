import express from "express";
import { createContact } from "../controllers/Contactcontroller";

const router = express.Router();
router.post("/", createContact);

export default router;
