import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { ArrowLeft, ArrowRight, Loader2, Calendar, User, Tag } from "lucide-react";
import { CONFIG } from "../config";
import { useTranslation } from "react-i18next";
import { SEO } from "../components/SEO";

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

interface NavItem {
  slug: string;
  title: string;
  url: string;
}

export function NewsDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const [item, setItem] = useState<NewsItem | null>(null);
  const [prevItem, setPrevItem] = useState<NavItem | null>(null);
  const [nextItem, setNextItem] = useState<NavItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const lang = i18n.language || "en";

  useEffect(() => {
    const fetchNewsDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/news/${slug}?locale=${lang}`, {
          headers: {
            "Accept": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("News item not found");
        }
        const result = await response.json();
        setItem(result.data);
        setPrevItem(result.prev);
        setNextItem(result.next);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchNewsDetail();
    }
  }, [slug, lang]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(i18n.language === 'ka' ? 'ka-GE' : 'en-US', options);
  };

  const getImageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith('http')) return url;
    return `${CONFIG.API_BASE_URL}${url}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center pt-20">
        <Loader2 className="w-12 h-12 text-black animate-spin mb-4" />
        <p className="text-gray-500 uppercase tracking-widest text-xs font-semibold">{t('newsPage.loading')}</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center pt-20 px-6">
        <h2 className="text-2xl font-[Cinzel] mb-4">{error || "News item not found"}</h2>
        <Link to="/news" className="flex items-center space-x-2 text-sm uppercase tracking-widest font-bold border-b border-black pb-1 hover:text-yellow-600 hover:border-yellow-600 transition-colors">
          <ArrowLeft size={16} />
          <span>{t('newsPage.home')}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <SEO title={item.title} description={item.excerpt || undefined} />
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[400px] flex items-end pb-16 bg-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src={getImageUrl(item.image_url)}
            alt={item.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 lg:px-12">
          <Link to="/news" className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-gray-300 mb-8 hover:text-white transition-colors">
            <ArrowLeft size={14} />
            <span>{t('newsPage.news')}</span>
          </Link>
          <div className="flex flex-wrap items-center gap-6 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-yellow-500 font-bold mb-4">
            <div className="flex items-center space-x-2">
              <Calendar size={14} />
              <span>{formatDate(item.published_at)}</span>
            </div>
            {item.category && (
              <div className="flex items-center space-x-2">
                <Tag size={14} />
                <span>{item.category.name}</span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <User size={14} />
              <span>{item.author.name}</span>
            </div>
          </div>
          <h1 className={`font-[Cinzel] text-white leading-tight drop-shadow-lg ${
            i18n.language === 'ka' 
              ? 'text-2xl md:text-3xl lg:text-4xl font-medium' 
              : 'text-3xl md:text-4xl lg:text-5xl font-semibold'
          }`}>
            {item.title}
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            {/* Excerpt/Intro */}
            <p className="text-xl lg:text-2xl font-['DejaVu_Sans'] text-gray-700 leading-relaxed mb-12 italic border-l-4 border-yellow-500 pl-8">
              {item.excerpt}
            </p>

            {/* Main Content */}
            <div 
              className="prose prose-lg lg:prose-xl max-w-none text-gray-800 font-light leading-relaxed font-['DejaVu_Sans']
                         prose-headings:font-[Cinzel] prose-headings:text-gray-900
                         prose-p:mb-6 prose-img:rounded-2xl prose-img:shadow-lg
                         prose-a:text-yellow-600 prose-a:no-underline hover:prose-a:underline
                         prose-strong:font-semibold prose-blockquote:border-yellow-500"
              dangerouslySetInnerHTML={{ __html: item.content || "" }}
            />

            {/* Article Navigation */}
            <div className="mt-20 pt-10 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 items-center gap-8">
              {/* Prev */}
              <div className="order-2 md:order-1">
                {prevItem && (
                  <Link to={`/news/${prevItem.slug}`} className="group flex flex-col items-start space-y-2 text-left">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 flex items-center space-x-2">
                      <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
                      <span>{t('newsPage.prev')}</span>
                    </span>
                    <span className="text-sm font-[Cinzel] font-semibold text-gray-900 group-hover:text-yellow-600 transition-colors line-clamp-1">
                      {prevItem.title}
                    </span>
                  </Link>
                )}
              </div>

              {/* All News / Home */}
              <div className="order-1 md:order-2 flex justify-center">
                <Link to="/news" className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white hover:border-black transition-all duration-300 group" title={t('newsPage.news')}>
                  <ArrowLeft size={20} className="transform group-hover:scale-110 transition-transform" />
                </Link>
              </div>

              {/* Next */}
              <div className="order-3 text-right">
                {nextItem && (
                  <Link to={`/news/${nextItem.slug}`} className="group flex flex-col items-end space-y-2 text-right">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 flex items-center space-x-2">
                      <span>{t('newsPage.next')}</span>
                      <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="text-sm font-[Cinzel] font-semibold text-gray-900 group-hover:text-yellow-600 transition-colors line-clamp-1">
                      {nextItem.title}
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
