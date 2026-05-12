import type { ServiceItem } from "@/features/services/api/services";
import {
  Megaphone,
  UsersRound,
  BriefcaseBusiness,
  PartyPopper,
  ShoppingBag,
  Monitor,
  Gift,
  type LucideIcon,
} from "lucide-react";

type ServicesCardsGridProps = {
  services: ServiceItem[];
};

const iconMap: Record<string, LucideIcon> = {
  megaphone: Megaphone,
  partypopper: PartyPopper,
  "party-popper": PartyPopper,
  shoppingbag: ShoppingBag,
  "shopping-bag": ShoppingBag,
  usersround: UsersRound,
  "users-round": UsersRound,
  monitor: Monitor,
  gift: Gift,
  users: UsersRound,
  "team-building": UsersRound,
};

function getServiceIcon(iconKey?: string): LucideIcon {
  if (!iconKey) {
    return BriefcaseBusiness;
  }

  const normalized = iconKey.trim().toLowerCase();
  return iconMap[normalized] || BriefcaseBusiness;
}

export default function ServicesCardsGrid({ services }: ServicesCardsGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-7 lg:gap-8">
      {services.slice(0, 6).map((service) => {
        const Icon = getServiceIcon(service.iconKey || service.icon);
        return (
          <article
            key={service.id}
            className="group rounded-3xl border border-brand-primary/10 bg-brand-surface p-7 text-center shadow-[0_14px_40px_rgba(46,49,145,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(46,49,145,0.14)]"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary text-white transition-colors duration-300 group-hover:bg-brand-danger">
              <Icon size={24} />
            </div>
            <h3 className="mt-5 text-xl font-bold text-brand-primary">{service.name}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">
              {service.description?.trim() ? service.description : "—"}
            </p>
          </article>
        );
      })}
    </div>
  );
}
