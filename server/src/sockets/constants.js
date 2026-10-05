export const SOCKET_EVENTS = {
  LEAD_UPDATED: "lead:updated",
};

export const SOCKET_ROOMS = {
  brokerage: (brokerageId) => `brokerage:${brokerageId}`,
};
