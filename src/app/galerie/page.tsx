import { permanentRedirect } from "next/navigation";

/** Les photos sont désormais intégrées aux chapitres de notre histoire. */
export default function GaleriePage() {
  permanentRedirect("/#histoire");
}
