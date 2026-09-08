import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact Us | Plugo",
  description: "Get in touch with Plugo for orders, product questions, and support.",
};

export default function ContactPage() {
  return (
    <div className="container-app py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-ink-900">Contact Us</h1>
        <p className="text-slate-500 mt-1">Questions about an order or a product? We&apos;re here.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <ContactForm />
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 flex items-start gap-4">
            <span className="text-2xl">📍</span>
            <div>
              <h3 className="font-semibold text-ink-900">Our Address</h3>
              <p className="text-sm text-slate-500 mt-1">Lahore, Pakistan</p>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 flex items-start gap-4">
            <span className="text-2xl">📞</span>
            <div>
              <h3 className="font-semibold text-ink-900">Phone</h3>
              <p className="text-sm text-slate-500 mt-1">+92 300 1234567</p>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 flex items-start gap-4">
            <span className="text-2xl">✉️</span>
            <div>
              <h3 className="font-semibold text-ink-900">Email</h3>
              <p className="text-sm text-slate-500 mt-1">support@plugo.com</p>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 flex items-start gap-4">
            <span className="text-2xl">🕒</span>
            <div>
              <h3 className="font-semibold text-ink-900">Working Hours</h3>
              <p className="text-sm text-slate-500 mt-1">Mon - Sat: 9:00 AM - 8:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
