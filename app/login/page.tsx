import type { Metadata } from "next";
import { Suspense } from "react";
import SiteShell from "@/components/SiteShell";
import AuthView from "@/components/lms/AuthView";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to Method — your courses, progress and projects.",
  alternates: { canonical: "/login/" },
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <SiteShell>
      <Suspense>
        <AuthView mode="login" />
      </Suspense>
    </SiteShell>
  );
}
