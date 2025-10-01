import  Contact  from "../Models/ContactModel";
import { Request, Response } from "express";
import mailerSender from "../utils/sendEmails";
import dotenv from "dotenv";
dotenv.config();

export const createContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({ message: "Name, email and message are required." });
      return;
    }

    const newContact = new Contact({ name, email, phone, message });
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

      await mailerSender(adminEmail, "New Contact Message Received", htmlContentAdmin);
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

    await mailerSender(email, "Thank you for contacting us", htmlContentUser);

    res.status(201).json({
      message: "Contact message created successfully, confirmation email sent.",
      contact: newContact,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error creating contact:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
