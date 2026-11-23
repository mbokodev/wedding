/** Identifiant de connexion dérivé du nom, sans accents ni espaces. */
export function userEmailFromName(fullName: string): string {
  const local = fullName.trim().toLowerCase().normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/œ/g, "oe").replace(/æ/g, "ae")
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9-]+/g, ".")
    .replace(/^[.-]+|[.-]+$/g, "");
  return local && local.length <= 64 ? `${local}@angedecedric.com` : "";
}
