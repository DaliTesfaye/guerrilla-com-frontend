import { Megaphone, PanelsTopLeft, Users } from "lucide-react";

const services = [
  {
    icon: Megaphone,
    title: "Team Building",
    description:
      "Ce format d’actions est de plus en plus en vogue chez les entreprises tous secteurs et tailles confondus. Organiser des team building permet de tisser des liens d’appartenances forts à l’entreprise",
  },
  {
    icon: Users,
    title: "Animation GMS",
    description:
      "Le « modern trade » ou le canal des Grandes et Moyennes Surface ne cesse de gagner en importance en Tunisie en comparaison avec la trade traditionnel (grossistes, épiciers, superettes...).",
  },
  {
    icon: PanelsTopLeft,
    title: "Street Marketing",
    description:
      "Levier de visibilité incontournable pour les marques, le recours au Street Marketing est souvent une des meilleures approches pour toucher un grand nombre de personnes via des activations dans la rue et les lieux publique",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="bg-white px-6 py-24 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-brand-primary md:text-5xl">
            Nos <span className="text-brand-danger">services</span>
          </h2>
          <span className="mx-auto mt-4 block h-0.75 w-20 rounded-full bg-brand-danger/80" />
          <p className="mt-6 text-base leading-7 text-slate-600 md:text-lg">
            Trois expertises principales pour donner plus d'impact a vos campagnes et vos evenements.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3 md:gap-7 lg:gap-8">
          {services.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="group rounded-3xl border border-brand-primary/10 bg-brand-surface p-7 text-center shadow-[0_14px_40px_rgba(46,49,145,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(46,49,145,0.14)]"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary text-white transition-colors duration-300 group-hover:bg-brand-danger">
                <Icon size={24} />
              </div>

              <h3 className="mt-5 text-xl font-bold text-brand-primary">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">{description}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <a
            href="#"
            className="inline-flex items-center justify-center rounded-xl bg-brand-primary px-7 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-brand-primary-dark hover:shadow-lg hover:shadow-brand-primary/20"
          >
            Voir tous les services
          </a>
        </div>
      </div>
    </section>
  );
}