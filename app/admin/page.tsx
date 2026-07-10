import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import AdminView from "@/components/lms/AdminView";

export const metadata: Metadata = {
  title: "Studio — Admin Dashboard",
  description: "Revenue, signups and course performance for the instructor.",
  alternates: { canonical: "/admin/" },
  robots: { index: false },
};

export default function AdminPage() {
  return (
    <SiteShell>
      <AdminView />
    </SiteShell>
  );
}
