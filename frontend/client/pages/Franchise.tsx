// src/pages/Franchise.tsx
import AppLayout from "@/components/layout/AppLayout";

export default function Franchise() {
  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        <h1 className="text-3xl font-bold">Franchise Opportunities</h1>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Introduction</h2>
          <p className="text-muted-foreground">
            Join our mission by becoming a certified franchise partner. We provide all the tools and support to get started.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Eligibility</h2>
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
            <li>Registered institution or individual with education background</li>
            <li>Minimum infrastructure and staffing requirements</li>
            <li>Agreement to abide by EduFlow quality standards</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">How to Apply</h2>
          <p className="text-muted-foreground">
            Submit your application via the contact form or reach out to our franchise coordinator.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Franchise Models</h2>
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
            <li><strong>Gold Member:</strong> Full license with regional exclusivity</li>
            <li><strong>Silver Member:</strong> Standard license with shared territories</li>
            <li><strong>Affiliate:</strong> Referral-based model</li>
          </ul>
        </section>
      </div>
    </AppLayout>
  );
}
