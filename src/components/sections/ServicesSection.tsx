"use client";

import { useEffect, useState } from "react";
import { fetchServices, type ServiceItem } from "@/features/services/api/services";
import ServicesCardsGrid from "@/features/services/components/ServicesCardsGrid";

export default function ServicesSection() {
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

  return (
    <section id="services" className="bg-white px-6 py-24 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-brand-primary md:text-5xl">
            Nos <span className="text-brand-danger">services</span>
          </h2>
          <span className="mx-auto mt-4 block h-0.75 w-20 rounded-full bg-brand-danger/80" />
          <p className="mt-6 text-base leading-7 text-slate-600 md:text-lg">
            Nos expertises pour donner plus d&apos;impact a vos campagnes et vos evenements.
          </p>
        </div>

        <div className="mt-12">
          {loading ? (
            <p className="text-center text-sm text-slate-500">Chargement des services...</p>
          ) : error ? (
            <div className="mx-auto max-w-xl rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-center text-sm text-[#C7072C]">
              {error}
            </div>
          ) : services.length === 0 ? (
            <p className="text-center text-sm text-slate-500">Aucun service trouve.</p>
          ) : (
            <ServicesCardsGrid services={services} />
          )}
        </div>
      </div>
    </section>
  );
}
