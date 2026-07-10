import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import DownloadsView from "@/components/lms/DownloadsView";

export const metadata: Metadata = {
  title: "Downloads — your resource vault",
  description:
    "Working files, cheat sheets and templates from your enrolled Tarek courses.",
  alternates: { canonical: "/downloads/" },
  robots: { index: false },
};

export default function DownloadsPage() {
  return (
    <SiteShell>
      <DownloadsView />
    </SiteShell>
  );
}
