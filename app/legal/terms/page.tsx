import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import LegalView from "@/components/lms/LegalView";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Atelier's terms of service: enrollment, lifetime access, acceptable use, certificates and refunds.",
  alternates: { canonical: "/legal/terms/" },
};

export default function TermsPage() {
  return (
    <SiteShell>
      <LegalView kind="terms" />
    </SiteShell>
  );
}
