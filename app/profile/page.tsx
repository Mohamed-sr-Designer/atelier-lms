import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import ProfileView from "@/components/lms/ProfileView";

export const metadata: Metadata = {
  title: "Student Profile",
  description: "Manage your Atelier student profile.",
  alternates: { canonical: "/profile/" },
  robots: { index: false },
};

export default function ProfilePage() {
  return (
    <SiteShell>
      <ProfileView />
    </SiteShell>
  );
}
