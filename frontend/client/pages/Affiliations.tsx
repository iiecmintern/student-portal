// src/pages/Affiliations.tsx
import AppLayout from "@/components/layout/AppLayout";

export default function Affiliations() {
  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        <h1 className="text-3xl font-bold">Affiliations</h1>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Partner Logos & Names</h2>
          <p className="text-muted-foreground">Display logos, names, and documents here.</p>
          {/* Add dynamic card grid for affiliations */}
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Partnership Details</h2>
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
            <li>Roles & Responsibilities</li>
            <li>Certification / Seals / Documents</li>
            <li>Partnership Category (e.g. Educational, Government, NGO)</li>
          </ul>
        </section>
      </div>
    </AppLayout>
  );
}
