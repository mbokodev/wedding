import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/server/auth/guards";
import { createUser } from "@/features/users/actions";
import { UserForm } from "@/features/users/user-form";

export const metadata: Metadata = {
  title: "Nouvel utilisateur",
};

export default async function NewUserPage() {
  await requireUser(["SUPER_ADMIN"]);

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/users"
          className="text-xs uppercase tracking-[0.2em] text-cocoa-light underline-offset-4 hover:underline"
        >
          ← Utilisateurs
        </Link>
        <h1 className="mt-3 font-serif text-3xl font-light text-cocoa">
          Nouvel utilisateur
        </h1>
      </div>

      <UserForm
        mode="create"
        action={createUser}
        defaults={{
          fullName: "",
          email: "",
          phone: "",
          role: "ADMIN",
          quota: "",
        }}
      />
    </div>
  );
}
