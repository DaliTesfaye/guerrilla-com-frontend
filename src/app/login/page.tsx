"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuthStore } from "../../store/authStore";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.token, res.data.user);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* Left panel — brand */}
      <div className="hidden lg:flex w-1/2 bg-brand flex-col items-center justify-center relative overflow-hidden px-12">
        {/* Background decoration */}
        <div className="absolute -top-20 -right-20 w-[320px] h-80 rounded-full bg-brand-primary opacity-50" />
        <div className="absolute -bottom-15 -left-15 w-60 h-60 rounded-full bg-[#C7072C] opacity-20" />

        {/* Logo */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <Image
            src="/logo.png"
            alt="Guerrilla Com"
            width={220}
            height={90}
            priority
          />
          <p className="text-white/70 mt-6 text-sm leading-relaxed max-w-xs">
            Gérez vos événements, services et projets depuis un tableau de bord centralisé.
          </p>
        </div>

        {/* Bottom tag */}
        <p className="absolute bottom-6 text-white/30 text-xs">
          © {new Date().getFullYear()} Guerrilla Com. Tous droits réservés.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center bg-[#f4f5fb] px-6">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="flex lg:hidden justify-center mb-8">
            <div className="bg-[#2E3191] rounded-2xl px-6 py-4">
              <Image src="/logo.png" alt="Guerrilla Com" width={150} height={60} priority />
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Bon retour</h1>
            <p className="text-gray-500 text-sm mt-1">Connectez-vous à votre compte pour continuer</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Adresse e-mail
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@guerrillacom.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 bg-white border-gray-200 focus-visible:ring-[#2E3191]"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Mot de passe
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 bg-white border-gray-200 focus-visible:ring-[#2E3191]"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-[#C7072C] bg-red-50 border border-red-100 px-4 py-3 rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C7072C] shrink-0" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#2E3191] hover:bg-[#1e2266] text-white font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connexion en cours...
                </span>
              ) : "Se connecter"}
            </Button>

          </form>
        </div>
      </div>

    </div>
  );
}



