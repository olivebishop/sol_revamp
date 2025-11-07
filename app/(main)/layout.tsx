import type React from "react";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
