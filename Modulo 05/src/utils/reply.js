/**
 * 📌 Helpers para respostas padronizadas.
 */
export const ok = (data) => ({ ok: true, data });
export const created = (data) => ({ ok: true, data });
export const noContent = () => ({ ok: true });
export const fail = (message, details) => ({ ok: false, message, details });
