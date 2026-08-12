// app/services/page.tsx
import { getServices } from "@/lib/services";

export default async function ServicesPage() {
  // Directly call the server utility—no HTTP latency!
  const services = getServices();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Our Services</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow bg-card"
          >
            <h2 className="text-xl font-semibold mb-2">{service.name}</h2>
            <p className="text-muted-foreground">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}