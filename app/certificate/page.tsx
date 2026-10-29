import type { Metadata } from "next";
import { Suspense } from "react";
import SiteShell from "@/components/SiteShell";
import CertificateView from "@/components/lms/CertificateView";

export const metadata: Metadata = {
  title: "Certificate | verify",
  description:
    "Verify a Mohamed Tarek Academy certificate of completion by its ID. Every certificate is earned with a personally reviewed final project.",
  alternates: { canonical: "/certificate/" },
};

export default function CertificatePage() {
  return (
    <SiteShell>
      <Suspense>
        <CertificateView />
      </Suspense>
    </SiteShell>
  );
}
