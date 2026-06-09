import { headers } from "next/headers";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const h = await headers();
  const email =
    h.get("cf-access-authenticated-user-email") ?? "developer (local)";
  return <DashboardClient email={email} />;
}
