"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send } from "lucide-react";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
}

const FAQ_RESPONSES = {
  presentation: "💥 Guerrilla Com est une agence de communication digitale et de développement web de premier plan. Nous aidons les entreprises à construire une image de marque forte, à concevoir des solutions web modernes et à exploser leur visibilité en ligne !",
  services: "💼 Nos services incluent : La création de sites web (Vitrines, E-commerce, SaaS), le Community Management (Facebook, Instagram, LinkedIn), la publicité payante (Ads), la création d'identité visuelle (Logos, Branding) et la production vidéo.",
  horaires: "🕒 Nous sommes ouverts du lundi au vendredi, de 08:30 à 17:30. Nous sommes fermés le week-end (samedi et dimanche).",
  location: "📍 Notre agence est située à Tunis. Vous pouvez consulter notre emplacement exact dans la section 'À PROPOS' de la page principale.",
  contact: "📞 Pour nous contacter, c'est très simple ! Cliquez sur le bouton 'Nous contacter' en haut à droite pour nous envoyer un message, ou appelez-nous directement sur notre numéro disponible dans le pied de page.",
  devis: "💰 Chaque projet est unique ! Pour obtenir un devis gratuit et personnalisé adapté à votre budget, nous vous invitons à remplir notre formulaire de contact en bas de page ou à planifier un appel avec notre équipe."
};

const QUICK_SUGGESTIONS = [
  { label: "C'est quoi Guerrilla Com ?", key: "presentation" },
  { label: "Quels sont vos services ?", key: "services" },
  { label: "Horaires de travail", key: "horaires" },
  { label: "Où êtes-vous situés ?", key: "location" },
  { label: "Comment vous contacter ?", key: "contact" },
  { label: "Demander un devis / Prix", key: "devis" }
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

  // 🕒 Bulle d'accroche visuelle après 6 secondes (Le son a été retiré d'ici)
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

  // Function helper pour centraliser et jouer le son de notification proprement
  const playNotificationSound = () => {
    try {
      const audio = new Audio("/notification.mp3");
      audio.volume = 0.3; // Volume doux à 30%
      audio.play().catch((err) => {
        console.log("Le son n'a pas pu se lancer (attente d'un clic utilisateur sur la page) :", err);
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

    if (cleanInput.includes("guerilla") || cleanInput.includes("c quoi") || cleanInput.includes("c'est quoi") || cleanInput.includes("qui etes") || cleanInput.includes("agence") || cleanInput.includes("presentation")) {
      if (cleanInput.includes("service")) return FAQ_RESPONSES.services;
      return FAQ_RESPONSES.presentation;
    }
    if (cleanInput.includes("service") || cleanInput.includes("propose") || cleanInput.includes("site") || cleanInput.includes("facebook") || cleanInput.includes("offre") || cleanInput.includes("faites") || cleanInput.includes("dev") || cleanInput.includes("web")) {
      return FAQ_RESPONSES.services;
    }
    if (cleanInput.includes("horaire") || cleanInput.includes("temps") || cleanInput.includes("ouvert") || cleanInput.includes("ferme") || cleanInput.includes("quand") || cleanInput.includes("dispo") || cleanInput.includes("heure")) {
      return FAQ_RESPONSES.horaires;
    }
    if (cleanInput.includes("ou") || cleanInput.includes("adresse") || cleanInput.includes("lieu") || cleanInput.includes("situe") || cleanInput.includes("tunis") || cleanInput.includes("bureau") || cleanInput.includes("emplacement")) {
      return FAQ_RESPONSES.location;
    }
    if (cleanInput.includes("contact") || cleanInput.includes("telephone") || cleanInput.includes("num") || cleanInput.includes("mail") || cleanInput.includes("appeler") || cleanInput.includes("joindre") || cleanInput.includes("email")) {
      return FAQ_RESPONSES.contact;
    }
    if (cleanInput.includes("prix") || cleanInput.includes("cout") || cleanInput.includes("devis") || cleanInput.includes("combien") || cleanInput.includes("tarif") || cleanInput.includes("argent")) {
      return FAQ_RESPONSES.devis;
    }
    if (cleanInput.includes("salut") || cleanInput.includes("bonjour") || cleanInput.includes("slt") || cleanInput.includes("hi") || cleanInput.includes("hello")) {
      return "Bonjour ! Comment puis-je vous aider aujourd'hui ? 😊";
    }

    return "Désolé, je suis nouveau dans le travail, je n'arrive pas à vous comprendre. Voici ce que vous pouvez me demander :";
  };

  const processMessage = (text: string, customResponse?: string) => {
    if (!text.trim() || isTyping) return;

    // 1. Ajouter le message envoyé par l'utilisateur
    const userMsg: Message = { id: String(Date.now()), sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // 2. Simuler le délai de réflexion/écriture du bot
    setTimeout(() => {
      setIsTyping(false);
      const botText = customResponse || getBotResponse(text);
      const botMsg: Message = { id: String(Date.now() + 1), sender: "bot", text: botText };
      
      // Mettre à jour les messages avec la réponse du bot
      setMessages((prev) => [...prev, botMsg]);

      // 🎵 NEW LOGIC: Déclencher le son de notification pile à la réception du message
      playNotificationSound();
    }, 800);
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
            Hey ! Comment ça va ? Comment puis-je vous aider aujourd'hui ? 😊
          </p>

          <div className="absolute bottom-[-5px] right-6 w-2.5 h-2.5 bg-white border-r border-b border-gray-100 rotate-45" />
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
        <div className="w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Header */}
          <div className="bg-brand-primary p-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
              <div>
                <h3 className="font-bold text-sm tracking-wide">Assistant Virtuel</h3>
                <p className="text-xs text-white/70">En ligne</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white p-1 rounded-lg transition">
              <X size={18} />
            </button>
          </div>

          {/* Zone des messages */}
          <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-gray-50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
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
              placeholder="Écrivez votre message..."
              disabled={isTyping}
              className="flex-grow bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-2 focus:outline-none focus:border-brand-primary focus:bg-white transition disabled:opacity-60"
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