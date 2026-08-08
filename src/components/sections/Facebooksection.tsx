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

interface FacebookApiResponse {
  data?: FBPost[];
  error?: string;
}

export default function FacebookFeed() {
  const [posts, setPosts] = useState<FBPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const API_URL = '/api/facebook'; 

    async function fetchFeed() {
      try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || 'Impossible de récupérer les actualités.');
        }
        
        const resData: FacebookApiResponse = await response.json();
        setPosts(resData.data || []);
      } catch (err: any) {
        setError(err.message || 'Une erreur réseau est survenue.');
      } finally {
        setLoading(false);
      }
    }

    fetchFeed();
  }, []);

  // 🔄 UI State: Loading Spinner
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-24 bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-danger mb-4"></div>
        <p className="text-sm text-slate-600 font-semibold tracking-wide">Chargement des événements et projets...</p>
      </div>
    );
  }

  // ⚠️ UI State: Error Fallback
  if (error) {
    return (
      <div className="max-w-xl mx-auto my-12 p-6 bg-red-50 rounded-2xl border border-red-200 text-center shadow-sm">
        <p className="text-red-600 font-semibold text-base">Une erreur est survenue</p>
        <p className="text-xs text-red-500 mt-1">{error}</p>
      </div>
    );
  }

  return (
    <section className="relative overflow-hidden px-6 py-24 md:py-28" id="actualite">
      {/* Couche 1 : Image de fond */}
      <Image
        src="/services-bg.jpg"
        alt="Actualités Background"
        fill
        priority
        className="object-cover object-center z-0"
      />

      {/* Couche 2 : Overlay sombré */}
      <div className="absolute inset-0 bg-slate-950/30 backdrop-blur-[2px] z-10" />

      {/* Couche 3 : Contenu principal */}
      <div className="relative z-20 max-w-7xl mx-auto">
        
        {/* Header de section */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest text-white uppercase bg-white/10 backdrop-blur-md border border-white/20 mb-4">
            Direct Facebook
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl drop-shadow-sm">
            Nos <span className="text-brand-danger">Actualités</span>
          </h2>
          <span className="mx-auto mt-4 block h-1 w-20 rounded-full bg-brand-danger" />
          <p className="mt-6 text-base leading-7 text-slate-100 md:text-lg font-medium drop-shadow-sm">
            Suivez en direct nos derniers événements, lancements de projets et réalisations sur le terrain.
          </p>
        </div>

        {/* Responsive Grid System */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => {
            const isReel = post.permalink_url?.includes('/reel/');
            const displayImg = post.full_picture || '/services-bg.jpg';

            return (
              <a
                key={post.id}
                href={post.permalink_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 flex flex-col hover:-translate-y-2 hover:border-blue-200"
              >
                {/* Visual Header / Image Box */}
                <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                  <img
                    src={displayImg}
                    alt="Visuel de l'événement"
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  
                  {/* Gradient Overlay for badge contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-80" />

                  {/* Reel / Post Type Badge */}
                  <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide bg-black/60 backdrop-blur-md text-white border border-white/20">
                    {isReel ? (
                      <>
                        <svg className="w-3.5 h-3.5 fill-current text-brand-danger" viewBox="0 0 24 24">
                          <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                        </svg>
                        Reel
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5 stroke-current text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                        Post
                      </>
                    )}
                  </span>

                  {/* Facebook Icon Badge */}
                  <div className="absolute top-4 right-4 p-2 rounded-full bg-white/90 backdrop-blur-md shadow-md text-blue-600 group-hover:scale-110 transition-transform">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>

                  {/* Date Badge */}
                  <div className="absolute bottom-4 left-4">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-white bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 shadow-sm">
                      <svg className="w-3 h-3 text-brand-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(post.created_time).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    {/* Message Content */}
                    <p className="text-slate-700 text-sm leading-relaxed line-clamp-3 font-medium group-hover:text-slate-900 transition-colors">
                      {post.message || "Découvrez les détails de cette réalisation directement sur notre publication Facebook..."}
                    </p>
                  </div>

                  {/* Standard Styled Blue Button Container */}
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <div className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs md:text-sm flex items-center justify-center gap-2 border border-blue-500 hover:border-blue-600 shadow-sm group-hover:shadow transition-all duration-300">
                      <span>Voir la publication</span>
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
        
      </div>
    </section>
  );
}