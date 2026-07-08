import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import LegalView from "@/components/lms/LegalView";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Atelier handles your data: browser-local learning records, payment privacy and your rights.",
  alternates: { canonical: "/legal/privacy/" },
};

export default function PrivacyPage() {
  return (
    <SiteShell>
      <LegalView kind="privacy" />
    </SiteShell>
  );
}
