"use client";

import { usePathname } from "next/navigation";

const titles: Record<string, string> = {
  "/dashboard/users": "Gestion des Utilisateurs",
  "/dashboard/users/new": "Créer un Admin",
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