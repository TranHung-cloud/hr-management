export const formatPhone = (phone: string): string => {
  // Chỉ giữ lại số
  const cleaned = phone.replace(/\D/g, "");

  // Format: 0912.345.678
  return cleaned.replace(/(\d{4})(\d{3})(\d{0,3})/, (_, a, b, c) =>
    [a, b, c].filter(Boolean).join(".")
  );
};
