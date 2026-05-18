"use client";

import { usePathname } from "next/navigation";

const titles: Record<string, string> = {
  "/dashboard/home": "Dashboard Home",
  "/dashboard/profile": "Mon profil",
  "/dashboard/users": "Gestion des Utilisateurs",
  "/dashboard/users/new": "Créer un Admin",
  "/dashboard/projects": "Gestion des Projets",
  "/dashboard/projects/create": "Creer un Projet",
  "/dashboard/events": "Gestion des Evenements",
  "/dashboard/events/create": "Creer un Evenement",
  "/dashboard/participants": "Gestion des Participants",
  "/dashboard/services": "Gestion des Services",
  "/dashboard/change-password": "Changer le mot de passe",
};

function resolveTitle(pathname: string): string {
  if (titles[pathname]) {
    return titles[pathname];
  }

  if (/^\/dashboard\/projects\/[^/]+\/edit$/.test(pathname)) {
    return "Modifier un Projet";
  }

  if (/^\/dashboard\/projects\/[^/]+\/events\/create$/.test(pathname)) {
    return "Creer un Evenement";
  }

  if (/^\/dashboard\/events\/[^/]+\/edit$/.test(pathname)) {
    return "Modifier un Evenement";
  }

  if (/^\/dashboard\/events\/[^/]+$/.test(pathname)) {
    return "Details de l'Evenement";
  }

  if (/^\/dashboard\/projects\/[^/]+$/.test(pathname)) {
    return "Details du Projet";
  }

  return "Dashboard";
}

export default function Header() {
  const pathname = usePathname();
  const title = resolveTitle(pathname);

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
