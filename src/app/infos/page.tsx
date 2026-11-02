import { permanentRedirect } from "next/navigation";

/** Les informations de la journée sont regroupées dans Le grand jour. */
export default function InfosPage() {
  permanentRedirect("/#grand-jour");
}
