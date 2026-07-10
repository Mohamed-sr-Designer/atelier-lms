import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import OfferBar from "@/components/lms/OfferBar";

export default function SiteShell({
  children,
  pad = false,
}: {
  children: React.ReactNode;
  pad?: boolean;
}) {
  return (
    <>
      <OfferBar />
      <Nav />
      <main className={pad ? "pt-20 md:pt-24" : ""}>{children}</main>
      <Footer />
    </>
  );
}
