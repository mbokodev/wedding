import { redirect } from "next/navigation";

/** Redirige vers la section Informations pratiques de la landing page. */
export default function InfosPage() {
  redirect("/#infos");
}
