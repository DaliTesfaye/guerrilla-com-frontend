'use client';

import React, { useEffect, useState } from 'react';

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
    // 🎯 FIXED: Pointing directly to your absolute Express backend endpoint instead of relative Next route
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
  }, []); // 🔒 Empty dependency array ensures this runs exactly once on mount

  // 🔄 UI State: Loading Spinner
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-20 bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3"></div>
        <p className="text-sm text-gray-500 font-medium">Chargement des actualités Facebook...</p>
      </div>
    );
  }

  // ⚠️ UI State: Error Fallback Card
  if (error) {
    return (
      <div className="max-w-xl mx-auto my-12 p-6 bg-red-50 rounded-xl border border-red-200 text-center">
        <p className="text-red-600 font-semibold">Une erreur est survenue</p>
        <p className="text-xs text-red-500 mt-1">{error}</p>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50" id="actualite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-950 sm:text-4xl tracking-tight">
            Notre Actualité en Direct
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-600 sm:mt-4">
            Suivez nos dernières publications, projets et événements directement depuis notre page Facebook.
          </p>
        </div>

        {/* Responsive Grid System */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <a
              key={post.id}
              href={post.permalink_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-gray-200 transition-all duration-300 flex flex-col transform hover:-translate-y-1"
            >
              {/* Card Image using standard HTML img to bypass strict Next.js CDN domain blocklists */}
              {post.full_picture && (
                <div className="relative h-56 w-full overflow-hidden bg-gray-100 border-b border-gray-50">
                  <img
                    src={post.full_picture}
                    alt="Facebook Visual"
                    className="object-cover w-full h-full group-hover:scale-102 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Card Content Wrapper */}
              <div className="p-6 flex flex-col flex-grow justify-between">
                <div>
                  {/* Date Badge */}
                  <span className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                    {new Date(post.created_time).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                  
                  {/* Message Content with line truncation */}
                  <p className="text-gray-700 mt-4 text-sm leading-relaxed line-clamp-4 whitespace-pre-line">
                    {post.message || "Voir la publication originale directement sur Facebook..."}
                  </p>
                </div>

                {/* Link Indicator */}
                <div className="mt-6 pt-4 border-t border-gray-100 text-sm font-bold text-gray-900 flex items-center gap-1 group-hover:text-blue-600 transition-colors">
                  Voir sur Facebook 
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