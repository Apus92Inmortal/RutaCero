import { AppShell } from "@/components/app-shell";
import { requireActiveUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ProtectedAppLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireActiveUser();
  return <AppShell profile={profile}>{children}</AppShell>;
}
