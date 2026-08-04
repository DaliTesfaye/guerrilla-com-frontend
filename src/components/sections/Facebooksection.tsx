'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface FBPost {
  id: string;
  message?: string;
  created_time: string;
  full_picture?: string;
  permalink_url: string;
}

interface ApiResponse {
  message: string;
  posts: FBPost[];
}

export default function FacebookFeed() {
  const [posts, setPosts] = useState<FBPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const API_URL = 'http://localhost:5000/api/facebook/feed'; 

    async function fetchFeed() {
      try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
          throw new Error('Impossible de récupérer les actualités.');
        }
        
        const data: ApiResponse = await response.json();
        setPosts(data.posts);
      } catch (err: any) {
        setError(err.message || 'Une erreur réseau est survenue.');
      } finally {
        setLoading(false);
      }
    }

    fetchFeed();
  }, []);

  // 🔄 UI State: Loading Spinner adapté au fond clair
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-20 bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-danger mb-3"></div>
        <p className="text-sm text-slate-600 font-medium">Chargement des événements et projets...</p>
      </div>
    );
  }

  // ⚠️ UI State: Error Fallback Card adapté au fond clair
  if (error) {
    return (
      <div className="max-w-xl mx-auto my-12 p-6 bg-red-50 rounded-xl border border-red-200 text-center">
        <p className="text-red-600 font-semibold">Une erreur est survenue</p>
        <p className="text-xs text-red-500 mt-1">{error}</p>
      </div>
    );
  }

  return (
    <section className="relative overflow-hidden px-6 py-24 md:py-28" id="actualite">
      {/* Couche 1 : Nouvelle image de fond services-bg */}
      <Image
        src="/services-bg.jpg"
        alt="Actualités Background"
        fill
        priority
        className="object-cover object-center z-0"
      />

      {/* Couche 2 : Overlay blanc léger (bg-white/10) */}
      <div className="absolute inset-0 bg-white/10 z-10" />

      {/* Couche 3 : Contenu principal */}
      <div className="relative z-20 max-w-7xl mx-auto">
        
        {/* Section Header - Adapté pour ressortir sur le fond clair */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            Nos <span className="text-brand-danger">Actualités</span>
          </h2>
          <span className="mx-auto mt-4 block h-0.75 w-20 rounded-full bg-brand-danger/80" />
          <p className="mt-6 text-base leading-7 text-white md:text-lg font-medium">
            Suivez en direct nos derniers événements, lancements de projets et réalisations sur le terrain depuis notre page Facebook.
          </p>
        </div>

        {/* Responsive Grid System (Cartes blanches avec ombres prononcées) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <a
              key={post.id}
              href={post.permalink_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-2xl shadow-md border border-brand-primary/5 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col transform hover:-translate-y-1"
            >
              {/* Card Image */}
              {post.full_picture && (
                <div className="relative h-56 w-full overflow-hidden bg-slate-50 border-b border-gray-100">
                  <img
                    src={post.full_picture}
                    alt="Visuel de l'événement"
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Card Content Wrapper */}
              <div className="p-6 flex flex-col flex-grow justify-between">
                <div>
                  {/* Date Badge */}
                  <span className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-brand-danger bg-brand-danger/10 px-3 py-1 rounded-full">
                    {new Date(post.created_time).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                  
                  {/* Message Content */}
                  <p className="text-slate-700 mt-4 text-sm leading-relaxed line-clamp-4 whitespace-pre-line font-medium">
                    {post.message || "Découvrez les détails de ce projet directement sur notre publication Facebook..."}
                  </p>
                </div>

                {/* Link Indicator */}
                <div className="mt-6 pt-4 border-t border-gray-100 text-sm font-bold text-slate-900 flex items-center gap-1 group-hover:text-brand-danger transition-colors">
                  Voir sur page Facebook
                  <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
                </div>
              </div>
            </a>
          ))}
        </div>
        
      </div>
    </section>
  );
}