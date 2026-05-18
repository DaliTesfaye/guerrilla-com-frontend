"use client";

import { useEffect, useState } from "react";
import { BriefcaseBusiness } from "lucide-react";
import { fetchServices, type ServiceItem } from "@/features/services/api/services";
import ServicesCardsGrid from "@/features/services/components/ServicesCardsGrid";

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadServices = async () => {
      setError("");
      try {
        const data = await fetchServices();
        setServices(data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Impossible de charger les services.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  if (loading) {
    return <div className="text-sm text-gray-500">Chargement des services...</div>;
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold text-gray-900">
          <BriefcaseBusiness size={22} className="text-[#2E3191]" />
          Services
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Les services disponibles depuis le backend.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-[#C7072C]">
          {error}
        </div>
      )}

      {services.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center text-sm text-gray-500">
          Aucun service trouve.
        </div>
      ) : (
        <ServicesCardsGrid services={services} />
      )}
    </section>
  );
}
