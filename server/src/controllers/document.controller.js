import { getClientDocument, listClientDocuments, uploadClientDocument } from "../services/document.service.js";

function handleError(error, res) {
  const messages = {
    FILE_REQUIRED: [400, "A document file is required."],
    UNSUPPORTED_FILE_TYPE: [400, "Only PDF, JPG, JPEG, and PNG files are supported."],
    FILE_TOO_LARGE: [413, "The document exceeds the 10 MB size limit."],
    INVALID_FILE_CONTENT: [400, "The file content does not match its MIME type."],
    CLIENT_CASE_NOT_FOUND: [404, "Client case not found."],
    INVALID_DOCUMENT_ID: [400, "Invalid document ID."],
  };
  if (messages[error.message]) return res.status(messages[error.message][0]).json({ message: messages[error.message][1] });
  throw error;
}

export async function upload(req, res) {
  try {
    const document = await uploadClientDocument(req.user, req.file);
    return res.status(201).json({ document });
  } catch (error) {
    return handleError(error, res);
  }
}

export async function listMine(req, res) {
  return res.json({ documents: await listClientDocuments(req.user) });
}

export async function detailMine(req, res) {
  try {
    const document = await getClientDocument(req.user, req.params.id);
    if (!document) return res.status(404).json({ message: "Document not found." });
    return res.json({ document });
  } catch (error) {
    return handleError(error, res);
  }
}
