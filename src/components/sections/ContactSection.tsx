"use client"
import { Building2 } from "lucide-react";

export default function ContactSection() {
  return (
    <section id="contact" className="bg-brand-surface px-6 py-20 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="pt-2">
          <h2 className="text-4xl font-extrabold leading-tight text-brand-primary md:text-5xl">
            Contactez-<span className="text-brand-danger">nous</span>
          </h2>
          <span className="mt-4 block h-0.75 w-20 rounded-full bg-brand-danger/80" />

          <p className="mt-6 max-w-md text-base leading-8 text-slate-600 md:text-lg">
            Besoin d'une activation terrain ou d'une campagne sur mesure? Remplissez le formulaire et notre equipe vous recontacte rapidement.
          </p>

          <div className="mt-6 space-y-1 text-sm text-slate-600 md:text-base">
            <p><span className="font-semibold text-brand-primary">Email:</span> guerrillacom.tunisie@gmail.com</p>
            <p><span className="font-semibold text-brand-primary">Telephone:</span> +216 50 699 800</p>
            <p><span className="font-semibold text-brand-primary">Adresse:</span> 81 Avenue Habib Bourguiba, Ariana</p>
          </div>
        </div>

        <div className="rounded-2xl border border-brand-primary/10 bg-white p-6 shadow-[0_14px_40px_rgba(46,49,145,0.10)] md:p-7">
          <h3 className="text-2xl font-extrabold text-brand-primary md:text-3xl">Formulaire de contact</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600 md:text-base">
            Remplissez les informations ci-dessous. Nous revenons vers vous avec une proposition adaptee.
          </p>

          <form className="mt-6 grid gap-4.5" onSubmit={(e) => e.preventDefault()}>
            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-brand-primary">Nom</span>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Votre nom"
                  className="h-12 rounded-xl border border-brand-primary/15 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-brand-primary">Societe</span>
                <div className="relative">
                  <Building2 size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brand-primary/50" />
                  <input
                    type="text"
                    name="company"
                    required
                    placeholder="Nom de votre societe"
                    className="h-12 w-full rounded-xl border border-brand-primary/15 bg-white pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                  />
                </div>
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-brand-primary">Email</span>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="votre@email.com"
                  className="h-12 rounded-xl border border-brand-primary/15 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-brand-primary">Numero</span>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="+216"
                  className="h-12 rounded-xl border border-brand-primary/15 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                />
              </label>
            </div>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-brand-primary">Sujet</span>
              <input
                type="text"
                name="subject"
                required
                placeholder="Ex: Activation de marque pour lancement produit"
                className="h-12 rounded-xl border border-brand-primary/15 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-brand-primary">Message</span>
              <textarea
                name="message"
                rows={5}
                placeholder="Parlez-nous de votre besoin, votre delai et vos objectifs..."
                className="resize-none rounded-xl border border-brand-primary/15 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
              />
            </label>

            <button
              type="submit"
              className="mt-1 inline-flex h-11 items-center justify-center rounded-xl bg-brand-danger px-6 text-sm font-bold text-white transition-all duration-300 hover:bg-[#a50524] hover:shadow-lg hover:shadow-brand-danger/25"
            >
              Envoyer la demande
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}