"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";
import { BRAND_ASSETS } from "@/lib/brand-assets";
import { cn } from "@/lib/cn";
import { APP_NAV_ITEMS, MOBILE_NAV_ITEMS } from "@/lib/constants";
import type { Profile } from "@/lib/types";

export function AppShell({
  profile,
  children,
}: {
  profile: Profile;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const firstName = profile.full_name?.split(" ")[0] ?? "Ruta Cero";
  const isActive = (href: string) => (href === "/app" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`));

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-line bg-white md:flex md:flex-col">
        <Link
          href="/app"
          aria-label="Ruta Cero by INTRA, ir al resumen"
          className="border-b border-line px-6 py-5 outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
        >
          <Image
            src={BRAND_ASSETS.rutaCero.logoPrimary}
            alt="Ruta Cero by INTRA"
            width={200}
            height={68}
            priority
            className="h-12 w-auto object-contain"
          />
        </Link>

        <NavList
          ariaLabel="Navegación principal"
          className="flex-1 space-y-1 overflow-y-auto px-3 py-4"
          isActive={isActive}
        />

        <form action={logoutAction} className="border-t border-line p-3">
          <button className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-semibold text-muted outline-none hover:bg-surface hover:text-primary focus-visible:ring-4 focus-visible:ring-primary/20">
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Cerrar sesión
          </button>
        </form>
      </aside>

      <div className="md:pl-72">
        <header className="sticky top-0 z-10 border-b border-line bg-background/95 px-4 py-3 backdrop-blur md:px-8 md:py-4">
          <div className="hidden items-center justify-between gap-3 md:flex">
            <div>
              <p className="text-2xl font-bold tracking-normal text-primary sm:text-3xl">Hola, {firstName}</p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 md:hidden">
            <Link
              href="/app"
              aria-label="Ruta Cero by INTRA, ir al resumen"
              className="outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Image
                src={BRAND_ASSETS.rutaCero.logoCompact}
                alt="Ruta Cero by INTRA"
                width={156}
                height={52}
                priority
                className="h-10 w-auto object-contain"
              />
            </Link>
            <button
              type="button"
              aria-label={mobileMenuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-line bg-white text-primary shadow-sm outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>

          {mobileMenuOpen ? (
            <div className="mt-3 max-h-[70vh] overflow-y-auto rounded-lg border border-line bg-white p-2 shadow-sm md:hidden">
              <NavList
                ariaLabel="Navegación principal móvil"
                className="grid gap-1"
                isActive={isActive}
                onNavigate={() => setMobileMenuOpen(false)}
              />
            </div>
          ) : null}
        </header>

        <main className="px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-line bg-white shadow-sm md:hidden" aria-label="Accesos rápidos">
        {MOBILE_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-16 flex-col items-center justify-center gap-1 border-t-2 border-transparent px-1 text-center text-[11px] font-semibold text-muted outline-none focus-visible:ring-4 focus-visible:ring-primary/20",
                active && "border-primary bg-surface text-primary",
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span className="leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function NavList({
  ariaLabel,
  className,
  isActive,
  onNavigate,
}: {
  ariaLabel: string;
  className?: string;
  isActive: (href: string) => boolean;
  onNavigate?: () => void;
}) {
  return (
    <nav aria-label={ariaLabel} className={className}>
      {APP_NAV_ITEMS.map((item) => {
        const active = isActive(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            onClick={onNavigate}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-lg border border-transparent px-3 text-sm font-semibold text-muted outline-none hover:bg-surface hover:text-primary focus-visible:ring-4 focus-visible:ring-primary/20",
              active && "border-line bg-surface text-primary shadow-sm",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{item.label}</span>
            {active ? <span className="ml-auto h-2 w-2 rounded-full bg-success" aria-hidden="true" /> : null}
          </Link>
        );
      })}
    </nav>
  );
}
