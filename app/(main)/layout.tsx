import type React from "react";
import { Suspense } from "react";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import NavbarClient from "@/components/shared/navbarClient";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={<NavbarClient destinations={[]} featured={null} />}>
        <Navbar />
      </Suspense>
      {children}
      <Footer />
    </>
  );
}
