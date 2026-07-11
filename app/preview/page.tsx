import type { Metadata } from "next";
import { Suspense } from "react";
import SiteShell from "@/components/SiteShell";
import DraftPreviewView from "@/components/lms/DraftPreviewView";

export const metadata: Metadata = {
  title: "Course preview",
  description: "Preview a studio-created course.",
  alternates: { canonical: "/preview/" },
  robots: { index: false },
};

export default function PreviewPage() {
  return (
    <SiteShell>
      <Suspense>
        <DraftPreviewView />
      </Suspense>
    </SiteShell>
  );
}
