import nodemailer from "nodemailer";
import { config } from "../config/env.js";

let transporter;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.password,
      },
    });
  }
  return transporter;
}

export function renderEmailTemplate(value, lead, advisorName = "") {
  const clientName = `${lead.firstName || ""} ${lead.lastName || ""}`.trim();
  return value.replace(/{{clientName}}/g, clientName).replace(/{{advisorName}}/g, advisorName || "");
}

export async function sendEmail({ recipient, subject, body }) {
  return getTransporter().sendMail({
    from: config.emailFrom,
    to: recipient,
    subject,
    text: body,
  });
}
