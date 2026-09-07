import { redirect } from "next/navigation";

/** Redirige vers la section Notre histoire de la landing page. */
export default function NotreHistoirePage() {
  redirect("/#histoire");
}
