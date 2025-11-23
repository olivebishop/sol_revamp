
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full mx-auto bg-black/80 rounded-xl shadow-lg p-8 sm:p-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-orange-500">Privacy Policy</h1>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-white">Your Privacy</h2>
          <p className="text-gray-300 mb-4">We value your privacy and are committed to protecting your personal information. This policy explains how we collect, use, and safeguard your data.</p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-white">Information Collection</h2>
          <p className="text-gray-300 mb-4">We may collect information you provide when booking, subscribing, or contacting us. This includes your name, email, and travel preferences.</p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-white">Use of Information</h2>
          <p className="text-gray-300 mb-4">Your information is used to improve our services, process bookings, and send updates. We do not sell or share your data with third parties except as required by law.</p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-white">Cookies</h2>
          <p className="text-gray-300 mb-4">We use cookies to enhance your experience. You can disable cookies in your browser settings, but some features may not work as intended.</p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-white">Policy Updates</h2>
          <p className="text-gray-300 mb-4">We may update this policy periodically. Changes will be posted on this page.</p>
        </section>
        <div className="mt-8 flex justify-between items-center">
          <Link href="/" className="text-orange-500 hover:underline">← Back to Home</Link>
          <Link href="/terms" className="text-gray-300 hover:text-orange-500 hover:underline">Terms & Conditions</Link>
        </div>
      </div>
    </div>
  );
}
