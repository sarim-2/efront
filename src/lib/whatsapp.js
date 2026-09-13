// Builds a normal WhatsApp click-to-chat URL (wa.me) — no WhatsApp Business
// API, no payment gateway. Just a pre-filled message that opens a chat.

function sanitizeNumber(number) {
  return (number || '').replace(/[^\d]/g, '');
}

export function buildWhatsAppOrderLink(whatsappNumber, items, total) {
  const number = sanitizeNumber(whatsappNumber);
  const lines = [
    "Hi! I'd like to order:",
    '',
    ...items.map((item) => {
      const price = item.salePrice || item.price;
      return `- ${item.name} x${item.quantity} — $${(price * item.quantity).toFixed(2)}`;
    }),
    '',
    `Total: $${total.toFixed(2)}`,
  ];
  const message = encodeURIComponent(lines.join('\n'));
  return number ? `https://wa.me/${number}?text=${message}` : null;
}

export function buildWhatsAppSingleProductLink(whatsappNumber, product, quantity) {
  const number = sanitizeNumber(whatsappNumber);
  const price = product.salePrice || product.price;
  const message = encodeURIComponent(
    `Hi! I'd like to order:\n\n- ${product.name} x${quantity} — $${(price * quantity).toFixed(2)}`
  );
  return number ? `https://wa.me/${number}?text=${message}` : null;
}
