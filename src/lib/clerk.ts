export function getAllowedPartnerRole(email: string) {
  const normalizedEmail = email.toLowerCase();

  if (normalizedEmail === process.env.ALLOWED_EMAIL_A?.toLowerCase()) {
    return "PARTNER_A" as const;
  }

  if (normalizedEmail === process.env.ALLOWED_EMAIL_B?.toLowerCase()) {
    return "PARTNER_B" as const;
  }

  return null;
}
