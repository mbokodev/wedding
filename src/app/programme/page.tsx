import { redirect } from "next/navigation";

/** Redirige vers la section Programme de la landing page. */
export default function ProgrammePage() {
  redirect("/#programme");
}
