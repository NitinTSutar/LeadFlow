import EmailTemplate from "../models/email-template.model.js";
import EmailDelivery from "../models/email-delivery.model.js";
import User from "../models/user.model.js";
import { renderEmailTemplate, sendEmail } from "./email.service.js";

export async function sendStageEmail(lead) {
  if (!lead.email) return;
  const template = await EmailTemplate.findOne({ brokerageId: lead.brokerageId, stage: lead.status, isActive: true });
  if (!template) return;

  let delivery;
  try {
    delivery = await EmailDelivery.create({
      brokerageId: lead.brokerageId,
      leadId: lead._id,
      templateId: template._id,
      stage: lead.status,
      leadVersion: lead.version,
      recipient: lead.email,
    });
  } catch (error) {
    if (error.code === 11000) return;
    throw error;
  }

  try {
    const advisor = lead.assignedAdvisorId ? await User.findById(lead.assignedAdvisorId).select("name") : null;
    await sendEmail({
      recipient: lead.email,
      subject: renderEmailTemplate(template.subject, lead, advisor?.name),
      body: renderEmailTemplate(template.body, lead, advisor?.name),
    });
    await EmailDelivery.updateOne({ _id: delivery._id }, { $set: { status: "SENT", sentAt: new Date() } });
  } catch (error) {
    console.error("Pipeline email delivery failed:", error.message);
    await EmailDelivery.updateOne({ _id: delivery._id }, { $set: { status: "FAILED", failureReason: "Email delivery failed." } });
  }
}
