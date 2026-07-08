import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import CertificatesView from "@/components/lms/CertificatesView";

export const metadata: Metadata = {
  title: "Certificates — verified, numbered, earned",
  description:
    "Your Atelier certificates: uniquely numbered credentials backed by completed projects, passed quizzes and submitted final projects.",
  alternates: { canonical: "/certificates/" },
  robots: { index: false },
};

export default function CertificatesPage() {
  return (
    <SiteShell>
      <CertificatesView />
    </SiteShell>
  );
}
