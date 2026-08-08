"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send } from "lucide-react";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
}

const FAQ_RESPONSES = {
  presentation:
    "💥 Guerrilla Com est une agence de communication et de publicité basée en Tunisie. Nous créons des campagnes percutantes et des événements sur-mesure pour propulser votre marque et marquer les esprits !",
  points_forts:
    "⚡ Notre valeur ajoutée ? L'organisation d'événements uniques, d'animations de terrain captivantes et de stratégies publicitaires spécialement conçues pour faire briller votre marque !",
  services:
    "💼 Nos expertises clés :\n• Street Marketing (opérations de terrain percutantes)\n• Animations GMS (Grandes & Moyennes Surfaces)\n• Événementiel sur-mesure\n• Publicité & Communication globale.",
  street_marketing:
    "📣 Le Street Marketing est l'une de nos plus grandes spécialités ! En Tunisie, nous avons à notre actif de nombreuses opérations de terrain réussies pour rapprocher votre marque de son public.",
  gms:
    "🛒 Nous organisons des animations GMS (Grandes et Moyennes Surfaces) dynamiques pour mettre en valeur vos produits directement sur le lieu de vente et booster vos conversions.",
  horaires:
    "🕒 Nous sommes ouverts du Lundi au Samedi, de 09:00 à 18:00 (Fermé le dimanche).",
  location:
    "📍 Nos bureaux se trouvent à l'adresse suivante :\n81, Avenue Habib Bourguiba, Ariana, 2080, Tunisie.",
  contact:
    "📞 Vous pouvez nous contacter directement via :\n• Téléphone / WhatsApp : +216 50 699 800\n• Email : guerrillacom.tunisie@gmail.com",
  devis:
    "💰 Chaque projet est unique ! Pour obtenir une proposition personnalisée adaptée à vos besoins et votre budget, contactez-nous au +216 50 699 800 ou par email à guerrillacom.tunisie@gmail.com."
};

const QUICK_SUGGESTIONS = [
  { label: "C'est quoi Guerrilla Com ?", key: "presentation" },
  { label: "Quels sont vos services ?", key: "services" },
  { label: "Street Marketing & GMS", key: "street_marketing" },
  { label: "Horaires de travail", key: "horaires" },
  { label: "Où êtes-vous situés ?", key: "location" },
  { label: "Téléphone & Email", key: "contact" },
  { label: "Demander un devis", key: "devis" }
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Bonjour ! 👋 Bienvenue chez Guerrilla Com. Posez-moi votre question ou choisissez une option ci-dessous !",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const isOpenRef = useRef(isOpen);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  // 🕒 Bulle d'accroche visuelle après 6 secondes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpenRef.current) {
        setShowNotification(true);
      }
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Function helper pour jouer le son de notification
  const playNotificationSound = () => {
    try {
      const audio = new Audio("/notification.mp3");
      audio.volume = 0.3;
      audio.play().catch((err) => {
        console.log("Lecture audio en attente d'interaction utilisateur :", err);
      });
    } catch (error) {
      console.error("Erreur de chargement du fichier audio :", error);
    }
  };

  const getBotResponse = (userInput: string): string => {
    const cleanInput = userInput
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    // Détection Street Marketing
    if (cleanInput.includes("street") || cleanInput.includes("rue") || cleanInput.includes("terrain")) {
      return FAQ_RESPONSES.street_marketing;
    }

    // Détection GMS / Supermarchés
    if (cleanInput.includes("gms") || cleanInput.includes("supermarche") || cleanInput.includes("magasin") || cleanInput.includes("surface")) {
      return FAQ_RESPONSES.gms;
    }

    // Détection Événementiel & Points forts
    if (cleanInput.includes("evenement") || cleanInput.includes("event") || cleanInput.includes("fort") || cleanInput.includes("avantage") || cleanInput.includes("pourquoi")) {
      return FAQ_RESPONSES.points_forts;
    }

    // Détection Présentation Générale
    if (
      cleanInput.includes("guerilla") ||
      cleanInput.includes("c quoi") ||
      cleanInput.includes("c'est quoi") ||
      cleanInput.includes("qui etes") ||
      cleanInput.includes("agence") ||
      cleanInput.includes("presentation")
    ) {
      return FAQ_RESPONSES.presentation;
    }

    // Détection Services
    if (
      cleanInput.includes("service") ||
      cleanInput.includes("propose") ||
      cleanInput.includes("offre") ||
      cleanInput.includes("faites") ||
      cleanInput.includes("publicite") ||
      cleanInput.includes("com")
    ) {
      return FAQ_RESPONSES.services;
    }

    // Détection Horaires
    if (
      cleanInput.includes("horaire") ||
      cleanInput.includes("temps") ||
      cleanInput.includes("ouvert") ||
      cleanInput.includes("ferme") ||
      cleanInput.includes("quand") ||
      cleanInput.includes("dispo") ||
      cleanInput.includes("samedi") ||
      cleanInput.includes("heure")
    ) {
      return FAQ_RESPONSES.horaires;
    }

    // Détection Adresse & Localisation
    if (
      cleanInput.includes("ou") ||
      cleanInput.includes("adresse") ||
      cleanInput.includes("lieu") ||
      cleanInput.includes("situe") ||
      cleanInput.includes("ariana") ||
      cleanInput.includes("bourguiba") ||
      cleanInput.includes("bureau") ||
      cleanInput.includes("emplacement")
    ) {
      return FAQ_RESPONSES.location;
    }

    // Détection Contact / Téléphone / Email
    if (
      cleanInput.includes("contact") ||
      cleanInput.includes("telephone") ||
      cleanInput.includes("tel") ||
      cleanInput.includes("whatsapp") ||
      cleanInput.includes("num") ||
      cleanInput.includes("mail") ||
      cleanInput.includes("appeler") ||
      cleanInput.includes("joindre") ||
      cleanInput.includes("email")
    ) {
      return FAQ_RESPONSES.contact;
    }

    // Détection Prix & Devis
    if (
      cleanInput.includes("prix") ||
      cleanInput.includes("cout") ||
      cleanInput.includes("devis") ||
      cleanInput.includes("combien") ||
      cleanInput.includes("tarif") ||
      cleanInput.includes("argent") ||
      cleanInput.includes("budget")
    ) {
      return FAQ_RESPONSES.devis;
    }

    // Salutations
    if (
      cleanInput.includes("salut") ||
      cleanInput.includes("bonjour") ||
      cleanInput.includes("slt") ||
      cleanInput.includes("hi") ||
      cleanInput.includes("hello") ||
      cleanInput.includes("coucou")
    ) {
      return "Bonjour ! Comment puis-je vous aider aujourd'hui ? 😊";
    }

    return "Je n'ai pas bien compris votre demande. N'hésitez pas à choisir l'une des options ci-dessous ou à nous contacter directement au +216 50 699 800 !";
  };

  const processMessage = (text: string, customResponse?: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: Message = { id: String(Date.now()), sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const botText = customResponse || getBotResponse(text);
      const botMsg: Message = { id: String(Date.now() + 1), sender: "bot", text: botText };
      
      setMessages((prev) => [...prev, botMsg]);
      playNotificationSound();
    }, 700);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processMessage(inputValue);
  };

  const handleOpenChat = () => {
    setIsOpen(true);
    setShowNotification(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans flex flex-col items-end">
      
      {/* 🔔 Bulle d'Accroche Visuelle */}
      {!isOpen && showNotification && (
        <div 
          onClick={handleOpenChat}
          className="mb-3 w-64 bg-white border border-gray-100 rounded-2xl shadow-2xl p-3.5 text-gray-800 cursor-pointer relative hover:scale-[1.02] transition-all duration-200 animate-in fade-in slide-in-from-bottom-3"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowNotification(false);
            }}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-0.5 rounded-md hover:bg-gray-50 transition"
          >
            <X size={14} />
          </button>
          
          <p className="font-bold text-xs text-brand-primary mb-0.5 tracking-wide">Guerrilla Bot</p>
          <p className="text-xs text-gray-600 leading-relaxed pr-2">
            Besoin d'une opération de Street Marketing ou d'un événement sur-mesure ? Discutons-en ! 😊
          </p>

          <div className="absolute -bottom-1.25 right-6 w-2.5 h-2.5 bg-white border-r border-b border-gray-100 rotate-45" />
        </div>
      )}

      {/* 💬 Bouton flottant quand fermé */}
      {!isOpen && (
        <button
          onClick={handleOpenChat}
          className="flex items-center justify-center w-14 h-14 bg-brand-danger text-white rounded-full shadow-xl hover:scale-105 transition-all duration-200 relative"
        >
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
          <MessageSquare size={26} />
        </button>
      )}

      {/* 📦 Boîte de discussion active */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-125 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Header */}
          <div className="bg-brand-primary p-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
              <div>
                <h3 className="font-bold text-sm tracking-wide">Assistant Guerrilla Com</h3>
                <p className="text-xs text-white/70">En ligne | Ariana, Tunis</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white p-1 rounded-lg transition">
              <X size={18} />
            </button>
          </div>

          {/* Zone des messages */}
          <div className="grow p-4 overflow-y-auto space-y-3 bg-gray-50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line shadow-sm ${
                    msg.sender === "user"
                      ? "bg-brand-danger text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Indicateur de saisie (...) */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-1 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Suggestions de questions rapides */}
          <div className="px-3 py-2 bg-white border-t border-gray-100 max-h-24 overflow-y-auto flex flex-wrap gap-1">
            {QUICK_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion.key}
                onClick={() => processMessage(suggestion.label, FAQ_RESPONSES[suggestion.key as keyof typeof FAQ_RESPONSES])}
                disabled={isTyping}
                className="text-[11px] bg-gray-100 text-gray-600 hover:bg-brand-primary/10 hover:text-brand-primary px-2.5 py-1 rounded-lg transition disabled:opacity-50 text-left"
              >
                {suggestion.label}
              </button>
            ))}
          </div>

          {/* Formulaire d'envoi de message */}
          <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Posez votre question..."
              disabled={isTyping}
              className="grow bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-2 focus:outline-none focus:border-brand-primary focus:bg-white transition disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="p-2 bg-brand-primary text-white rounded-xl hover:bg-brand-primary-dark transition disabled:opacity-40"
            >
              <Send size={16} />
            </button>
          </form>

        </div>
      )}
    </div>
  );
}