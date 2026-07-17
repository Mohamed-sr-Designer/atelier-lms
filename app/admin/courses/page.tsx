import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import AdminCoursesView from "@/components/lms/AdminCoursesView";

export const metadata: Metadata = {
  title: "Studio | Course Editor",
  description: "Edit prices, covers and lessons across every course.",
  alternates: { canonical: "/admin/courses/" },
  robots: { index: false },
};

export default function AdminCoursesPage() {
  return (
    <SiteShell>
      <AdminCoursesView />
    </SiteShell>
  );
}
