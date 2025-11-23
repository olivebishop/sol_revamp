
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full mx-auto bg-black/80 rounded-xl shadow-lg p-8 sm:p-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-orange-500">Terms & Conditions</h1>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-white">Acceptance of Terms</h2>
          <p className="text-gray-300 mb-4">By accessing and using our website, you agree to comply with and be bound by these Terms & Conditions. If you do not agree, please do not use our services.</p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-white">Use of Service</h2>
          <p className="text-gray-300 mb-4">You agree to use the site for lawful purposes only. Any misuse or unauthorized access may result in termination of your access.</p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-white">Intellectual Property</h2>
          <p className="text-gray-300 mb-4">All content, images, and branding are property of The Sol of African. Reproduction or distribution without permission is prohibited.</p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-white">Changes to Terms</h2>
          <p className="text-gray-300 mb-4">We reserve the right to update these terms at any time. Changes will be posted on this page.</p>
        </section>
        <div className="mt-8 flex justify-between items-center">
          <Link href="/" className="text-orange-500 hover:underline">← Back to Home</Link>
          <Link href="/privacy" className="text-gray-300 hover:text-orange-500 hover:underline">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}
