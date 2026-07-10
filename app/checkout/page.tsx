import type { Metadata } from "next";
import { Suspense } from "react";
import SiteShell from "@/components/SiteShell";
import CheckoutView from "@/components/lms/CheckoutView";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Tarek enrollment.",
  alternates: { canonical: "/checkout/" },
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <SiteShell>
      <Suspense>
        <CheckoutView />
      </Suspense>
    </SiteShell>
  );
}
