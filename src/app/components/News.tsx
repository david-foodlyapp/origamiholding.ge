import React, { useState, useEffect } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { CONFIG } from "../config";

interface NewsItem {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string | null;
  image_url: string;
  published_at: string;
  category: { id: number; name: string } | null;
  author: { id: number; name: string };
}

export function News() {
  const { t, i18n } = useTranslation();
  const [newsCache, setNewsCache] = useState<Record<string, NewsItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const lang = i18n.language || "en";
  const news = newsCache[lang] || [];

  useEffect(() => {
    const fetchNews = async () => {
      // Only show loader if we don't have data for this language yet
      if (!newsCache[lang]) {
        setLoading(true);
      }
      
      try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/news?locale=${lang}`, {
          headers: {
            "Accept": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch news");
        }
        const result = await response.json();
        const data = result.data?.slice(0, 3) || [];
        
        setNewsCache(prev => ({
          ...prev,
          [lang]: data
        }));
      } catch (err) {
        if (!newsCache[lang]) {
          setError(err instanceof Error ? err.message : "An error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [lang]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(i18n.language === 'ka' ? 'ka-GE' : 'en-US', options).toUpperCase();
  };

  const getImageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith('http')) return url;
    return `${CONFIG.API_BASE_URL}${url}`;
  };

  return (
    <section id="news" className="py-24 bg-white dark:bg-[#050505] text-gray-900 dark:text-white transition-colors duration-500">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="mb-16 flex flex-row justify-between items-center">
          <h2 className="text-3xl lg:text-4xl font-[Cinzel] text-gray-800 dark:text-white leading-tight uppercase tracking-widest">
            {t('newsSection.title')}
          </h2>
          <Link to="/news" className="flex items-center space-x-2 text-sm uppercase tracking-widest font-semibold border-b border-black dark:border-white pb-1 hover:text-yellow-600 hover:border-yellow-600 transition-colors">
            <span className="hidden md:inline">{t('homePage.more')}</span>
            <ArrowRight size={18} />
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-black animate-spin mb-4" />
            <p className="text-gray-500 uppercase tracking-widest text-xs font-semibold">{t('newsPage.loading')}</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 uppercase tracking-widest text-xs font-semibold">Error: {error}</p>
          </div>
        ) : news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {news.map((item) => (
              <Link key={item.id} to={`/news/${item.slug}`} className="group cursor-pointer block">
                <div className="overflow-hidden aspect-[4/3] mb-6 relative rounded-2xl bg-black flex items-center justify-center p-4">
                  <ImageWithFallback
                    src={getImageUrl(item.image_url)}
                    alt={item.title}
                    className="max-w-full max-h-full w-auto h-auto rounded-2xl transition-transform duration-1000 group-hover:scale-105"
                  />
                  {item.category && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-black shadow-sm">
                      {item.category.name}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-4 mb-3 text-xs uppercase tracking-widest text-gray-500 font-semibold">
                  <span className="text-yellow-600">{item.category?.name || t('newsPage.categories.corporate')}</span>
                  <span>|</span>
                  <span>{formatDate(item.published_at)}</span>
                </div>
                <h3 className="text-lg lg:text-xl font-[Cinzel] font-semibold text-gray-800 leading-snug group-hover:text-yellow-600 transition-colors line-clamp-2 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-6 font-['DejaVu_Sans'] leading-relaxed">
                  {item.excerpt}
                </p>
                <div className="mt-auto flex items-center space-x-2 text-xs uppercase tracking-widest font-bold text-black border-b border-black pb-1 self-start hover:text-yellow-600 hover:border-yellow-600 transition-colors">
                  <span>{t('newsPage.readMore')}</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 uppercase tracking-widest text-sm font-light">{t('newsPage.noNews')}</p>
          </div>
        )}
      </div>
    </section>
  );
}

