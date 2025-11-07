"use client";

const GrainOverlay = () => {
  return (
    <>
      {/* Premium Fine Grain - Visible on black */}
      <div
        className="pointer-events-none fixed inset-0 z-[100] opacity-[0.15]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' seed='2'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' fill='white' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
          mixBlendMode: "screen",
        }}
      />

      {/* Coarse Film Grain */}
      <div
        className="pointer-events-none fixed inset-0 z-[99] opacity-[0.12]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='250'%3E%3Cfilter id='grain2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='2' seed='10'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain2)' fill='white'/%3E%3C/svg%3E")`,
          backgroundSize: "250px 250px",
          mixBlendMode: "screen",
        }}
      />

      {/* Warm Orange Tint */}
      <div
        className="pointer-events-none fixed inset-0 z-[98] opacity-[0.08]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='350' height='350'%3E%3Cfilter id='texture3'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' seed='5'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23texture3)' fill='%23FF6B35'/%3E%3C/svg%3E")`,
          backgroundSize: "350px 350px",
          mixBlendMode: "overlay",
        }}
      />
    </>
  );
};

export default GrainOverlay;
