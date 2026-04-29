"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { APP_NAV_ITEMS, BRAND } from "@/lib/constants";
import { logoutAction } from "@/lib/actions/auth";
import type { Profile } from "@/lib/types";
import { cn } from "@/lib/cn";

export function AppShell({
  profile,
  children,
}: {
  profile: Profile;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const firstName = profile.full_name?.split(" ")[0] ?? "Ruta Cero";

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-line bg-white md:flex md:flex-col">
        <Link href="/app" className="border-b border-line px-6 py-5">
          <div className="text-xl font-black text-primary">{BRAND.name}</div>
          <div className="mt-1 text-xs font-medium text-muted">{BRAND.slogan}</div>
        </Link>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {APP_NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-muted hover:bg-[#eef4f8] hover:text-primary",
                  active && "bg-primary text-white hover:bg-primary hover:text-white",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <form action={logoutAction} className="border-t border-line p-3">
          <button className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-semibold text-muted hover:bg-[#eef4f8] hover:text-primary">
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </form>
      </aside>

      <div className="md:pl-72">
        <header className="sticky top-0 z-10 border-b border-line bg-background/95 px-4 py-4 backdrop-blur md:px-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Acceso vitalicio activo</p>
              <p className="text-lg font-bold text-primary">Hola, {firstName}</p>
            </div>
            <div className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-primary shadow-sm ring-1 ring-line">
              Pago único
            </div>
          </div>
        </header>
        <main className="px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-line bg-white md:hidden">
        {APP_NAV_ITEMS.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold text-muted",
                active && "text-primary",
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

