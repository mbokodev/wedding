"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export type AdminNavItem = {
  href: string;
  label: string;
};

/** Navigation de l'espace admin avec état actif. */
export function AdminNav({ items }: { items: AdminNavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="-mb-px flex gap-1 overflow-x-auto">
      {items.map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "whitespace-nowrap border-b-2 px-4 py-3 text-xs uppercase tracking-[0.2em] transition-colors",
              active
                ? "border-gold text-cocoa"
                : "border-transparent text-cocoa-light hover:border-cocoa/20 hover:text-cocoa"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
