import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function SiteShell({
  children,
  pad = false,
}: {
  children: React.ReactNode;
  pad?: boolean;
}) {
  return (
    <>
      <Nav />
      <main className={pad ? "pt-20 md:pt-24" : ""}>{children}</main>
      <Footer />
    </>
  );
}
