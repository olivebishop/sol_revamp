"use client";

import CTASection from "./cta-section";

export default function CTASectionWrapper() {
  return (
    <CTASection
      title="Your African Adventure Awaits"
      description="From wild safaris to pristine beaches, let's turn your dream vacation into reality"
      image="/images/sol_car.jpg"
      buttonText="Chat with Michael Kisangi"
      buttonAction={() => {
        window.open("https://wa.me/+254768453819", "_blank");
      }}
    />
  );
}
