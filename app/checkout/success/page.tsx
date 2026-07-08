import type { Metadata } from "next";
import { Suspense } from "react";
import SiteShell from "@/components/SiteShell";
import SuccessView from "@/components/lms/SuccessView";

export const metadata: Metadata = {
  title: "You're in — enrollment confirmed",
  description: "Your Atelier enrollment is confirmed. Start your first lesson now.",
  alternates: { canonical: "/checkout/success/" },
  robots: { index: false },
};

export default function SuccessPage() {
  return (
    <SiteShell>
      <Suspense>
        <SuccessView />
      </Suspense>
    </SiteShell>
  );
}
