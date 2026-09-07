import { redirect } from "next/navigation";

/** Redirige vers la section Galerie de la landing page. */
export default function GaleriePage() {
  redirect("/#galerie");
}
