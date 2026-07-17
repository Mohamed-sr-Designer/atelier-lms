import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import LegalView from "@/components/lms/LegalView";

export const metadata: Metadata = {
  title: "Refund Policy | 7-day money-back guarantee",
  description:
    "Every paid Tarek course carries a 7-day money-back guarantee — one WhatsApp message, refunded within 3 business days.",
  alternates: { canonical: "/legal/refunds/" },
};

export default function RefundsPage() {
  return (
    <SiteShell>
      <LegalView kind="refunds" />
    </SiteShell>
  );
}
