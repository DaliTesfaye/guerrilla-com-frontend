"use client";

import { usePathname } from "next/navigation";

const titles: Record<string, string> = {
  "/dashboard/home": "Dashboard Home",
  "/dashboard/users": "Gestion des Utilisateurs",
  "/dashboard/users/new": "Créer un Admin",
  "/dashboard/projects": "Gestion des Projets",
  "/dashboard/projects/create": "Creer un Projet",
  "/dashboard/events": "Gestion des Evenements",
  "/dashboard/events/create": "Creer un Evenement",
  "/dashboard/change-password": "Changer le mot de passe",
};

export default function Header() {
  const pathname = usePathname();
  const title = titles[pathname] || "Dashboard";

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="text-xs text-gray-500">
        Plateforme de gestion Guerrilla Com
      </div>
    </header>
  );
}
