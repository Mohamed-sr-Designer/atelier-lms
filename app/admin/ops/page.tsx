import type { Metadata } from "next";
import { Suspense } from "react";
import SiteShell from "@/components/SiteShell";
import AdminGuard from "@/components/lms/AdminGuard";
import AdminOpsView from "@/components/lms/AdminOpsView";

export const metadata: Metadata = {
  title: "Studio | Operations",
  description: "Payments, students, project reviews, questions and lesson videos.",
  alternates: { canonical: "/admin/ops/" },
  robots: { index: false },
};

export default function AdminOpsPage() {
  return (
    <SiteShell>
      <AdminGuard>
        <Suspense>
          <AdminOpsView />
        </Suspense>
      </AdminGuard>
    </SiteShell>
  );
}
