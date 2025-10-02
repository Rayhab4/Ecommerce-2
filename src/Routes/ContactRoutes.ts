import express from "express";
import { createContact } from "../controllers/Contactcontroller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Contact
 *   description: Contact and support messages
 */

/**
 * @swagger
 * /api/contact/:
 *   post:
 *     summary: Create a contact message
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               phone:
 *                 type: string
 *                 example: "1234567890"
 *               message:
 *                 type: string
 *                 example: "I need help with my order."
 *     responses:
 *       201:
 *         description: Contact message created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
router.post("/contact/", createContact);

export default router;
