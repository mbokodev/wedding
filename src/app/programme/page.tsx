import { permanentRedirect } from "next/navigation";

/** Redirige vers la section Programme de la landing page. */
export default function ProgrammePage() {
  permanentRedirect("/#programme");
}
