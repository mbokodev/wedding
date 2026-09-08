import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/server/auth/guards";
import { db } from "@/server/db";
import { getQuotaUsedBy } from "@/server/queries/stats";
import { updateUser } from "@/features/users/actions";
import { UserForm } from "@/features/users/user-form";

export const metadata: Metadata = {
  title: "Modifier un utilisateur",
};

export default async function EditUserPage({
  params,
}: PageProps<"/admin/users/[id]">) {
  await requireUser(["SUPER_ADMIN"]);

  const { id } = await params;
  const user = await db.user.findUnique({
    where: { id },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      quota: true,
      isActive: true,
    },
  });
  if (!user) notFound();

  const quotaUsed = user.role === "ADMIN" ? await getQuotaUsedBy(user.id) : 0;

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
          {user.fullName}
          {!user.isActive && (
            <span className="ml-3 align-middle text-xs font-sans uppercase tracking-wide text-red-700">
              désactivé
            </span>
          )}
        </h1>
      </div>

      <UserForm
        mode="edit"
        action={updateUser.bind(null, user.id)}
        quotaUsed={quotaUsed}
        defaults={{
          fullName: user.fullName,
          email: user.email ?? "",
          phone: user.phone ?? "",
          role: user.role,
          quota: user.quota !== null ? String(user.quota) : "",
        }}
      />
    </div>
  );
}
