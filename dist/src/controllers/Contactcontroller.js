"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContact = void 0;
const ContactModel_1 = __importDefault(require("../Models/ContactModel"));
const sendEmails_1 = __importDefault(require("../utils/sendEmails"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const createContact = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        if (!name || !email || !message) {
            res.status(400).json({ message: "Name, email and message are required." });
            return;
        }
        const newContact = new ContactModel_1.default({ name, email, phone, message });
        await newContact.save();
        const adminEmail = process.env.ADMIN_EMAIL;
        if (adminEmail) {
            const htmlContentAdmin = `
        <h3>New Contact Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Message:</strong> ${message}</p>
      `;
            await (0, sendEmails_1.default)(adminEmail, "New Contact Message Received", htmlContentAdmin);
        }
        const htmlContentUser = `
      <h3>Hello ${name},</h3>
      <p>Thank you for reaching out! We've received your message:</p>
      <p>"${message}"</p>
      <p>Our team will get back to you shortly.</p>
      <br/>
      <p>Best regards,</p>
      <p><strong>KLab Team</strong></p>
    `;
        await (0, sendEmails_1.default)(email, "Thank you for contacting us", htmlContentUser);
        res.status(201).json({
            message: "Contact message created successfully, confirmation email sent.",
            contact: newContact,
        });
    }
    catch (error) {
        const err = error;
        console.error("Error creating contact:", err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};
exports.createContact = createContact;
