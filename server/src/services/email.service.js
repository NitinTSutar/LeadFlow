import { Resend } from "resend";
import { config } from "../config/env.js";

let resend;

function getResend() {
  if (!resend) resend = new Resend(config.resendApiKey);
  return resend;
}

export function renderEmailTemplate(value, lead, advisorName = "") {
  const clientName = `${lead.firstName || ""} ${lead.lastName || ""}`.trim();
  return value.replace(/{{clientName}}/g, clientName).replace(/{{advisorName}}/g, advisorName || "");
}

export async function sendEmail({ recipient, subject, body }) {
  return getResend().emails.send({ from: config.emailFrom, to: recipient, subject, text: body });
}
