"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";

const links = [
  { href: "/dashboard/home", label: "Home" },
  { href: "/dashboard/users", label: "Utilisateurs" },
  { href: "/dashboard/users/new", label: "Creer Admin" },
  { href: "/dashboard/projects", label: "Projets" },
  { href: "/dashboard/events", label: "Evenements" },
  { href: "/dashboard/change-password", label: "Changer mot de passe" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside className="w-72 min-h-screen bg-[#2E3191] text-white flex flex-col">
      <div className="px-6 py-6 border-b border-white/10">
        <h1 className="text-xl font-bold tracking-tight">Guerrilla Com</h1>
        <p className="text-xs text-white/70 mt-1">Admin Dashboard</p>
      </div>
      <nav className="px-3 py-4 space-y-1">
        {links.map((link) => {
          const active =
            pathname === link.href ||
            (link.href === "/dashboard/projects" && pathname.startsWith("/dashboard/projects")) ||
            (link.href === "/dashboard/events" && pathname.startsWith("/dashboard/events"));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                active
                  ? "bg-white text-[#2E3191]"
                  : "text-white/90 hover:bg-[#1e2266] hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto px-4 py-4 border-t border-white/10">
        <p className="text-xs text-white/70">Connecté en tant que</p>
        <p className="text-sm font-semibold truncate">{user?.email || "—"}</p>
        <button
          onClick={handleLogout}
          className="mt-3 w-full rounded-lg bg-[#C7072C] px-3 py-2 text-sm font-medium hover:bg-[#a30624] transition"
        >
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}
