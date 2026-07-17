import type { Metadata } from "next";
import { Suspense } from "react";
import SiteShell from "@/components/SiteShell";
import AuthView from "@/components/lms/AuthView";

export const metadata: Metadata = {
  title: "Create your account | start learning free",
  description:
    "Create your free Tarek account and start the AI Photoshoot course today — no card required.",
  alternates: { canonical: "/register/" },
  robots: { index: false },
};

export default function RegisterPage() {
  return (
    <SiteShell>
      <Suspense>
        <AuthView mode="register" />
      </Suspense>
    </SiteShell>
  );
}
