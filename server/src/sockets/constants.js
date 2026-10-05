export const SOCKET_EVENTS = {
  LEAD_UPDATED: "lead:updated",
  DOCUMENT_UPDATED: "document:updated",
};

export const SOCKET_ROOMS = {
  brokerage: (brokerageId) => `brokerage:${brokerageId}`,
};
