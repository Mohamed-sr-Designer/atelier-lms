import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import DashboardView from "@/components/lms/DashboardView";

export const metadata: Metadata = {
  title: "My Learning — Student Dashboard",
  description: "Your Atelier courses, progress and certificates.",
  alternates: { canonical: "/dashboard/" },
  robots: { index: false },
};

export default function DashboardPage() {
  return (
    <SiteShell>
      <DashboardView />
    </SiteShell>
  );
}
