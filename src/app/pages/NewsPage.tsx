import React, { useState, useEffect } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { ArrowRight, Search } from "lucide-react";
import { Link } from "react-router";
import { CONFIG } from "../config";
import { useTranslation } from "react-i18next";
import { Skeleton } from "../components/ui/skeleton";
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

interface Category {
  id: number;
  slug: string;
  name: string;
  news_count: number;
}

export function NewsPage() {
  const { t, i18n } = useTranslation();
  const [newsCache, setNewsCache] = useState<Record<string, NewsItem[]>>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [visibleCount, setVisibleCount] = useState(6);
  const [searchQuery, setSearchQuery] = useState("");

  const lang = i18n.language || "en";
  const news = newsCache[`${lang}-${activeCategory}`] || [];

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/news/categories?locale=${lang}`);
        const result = await response.json();
        setCategories(result.data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, [lang]);

  // Fetch News based on category
  useEffect(() => {
    const fetchNews = async () => {
      const cacheKey = `${lang}-${activeCategory}`;
      if (!newsCache[cacheKey]) {
        setLoading(true);
      }

      try {
        let url = `${CONFIG.API_BASE_URL}/api/news?locale=${lang}`;
        if (activeCategory !== "All") {
          url = `${CONFIG.API_BASE_URL}/api/news/categories/${activeCategory}?locale=${lang}`;
        }

        const response = await fetch(url, {
          headers: { "Accept": "application/json" },
        });
        
        if (!response.ok) throw new Error("Failed to fetch news");
        
        const result = await response.json();
        const data = activeCategory === "All" ? (result.data || []) : (result.data?.news || []);

        setNewsCache(prev => ({
          ...prev,
          [cacheKey]: data
        }));
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [lang, activeCategory]);

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

  const filteredNews = news.filter(item => {
    const normalizedQuery = searchQuery.toLowerCase();
    const title = item.title?.toLowerCase() || "";
    const excerpt = item.excerpt?.toLowerCase() || "";
    const matchesSearch = title.includes(normalizedQuery) || excerpt.includes(normalizedQuery);
    return matchesSearch;
  });

  const displayedNews = filteredNews.slice(0, visibleCount);

  return (
    <div className="bg-white min-h-screen">
      <SEO title={t('nav.news')} />
      {/* Header Banner */}
      <section className="relative h-[300px] lg:h-[400px] flex items-end pb-16 justify-center bg-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1603520781806-dbedf904bf32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkdWJhaSUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NzQ4ODEwODB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="News Media Centre"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 text-center text-white">
          <h1 className={`${i18n.language === 'ka' ? 'text-2xl lg:text-4xl' : 'text-4xl lg:text-5xl'} font-[Cinzel] text-white font-bold tracking-wide drop-shadow-md`}>
            {t('newsPage.news')}
          </h1>
          <div className="flex justify-center items-center space-x-2 text-xs uppercase tracking-widest text-gray-400 mb-4">
            <span>{t('newsPage.home')}</span>
            <span>/</span>
            <span className="text-white">{t('newsPage.mediaCentre')}</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-12">

          {/* Filters & Search */}
          <div className="flex flex-col lg:flex-row justify-between items-end mb-16 border-b border-gray-200 dark:border-gray-800 gap-6 lg:gap-0">
            {/* Categories - No Scrollbar */}
            <div className="flex overflow-x-auto w-full lg:w-auto gap-8 lg:gap-12 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {loadingCategories ? (
                <div className="flex gap-8 lg:gap-12">
                   {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-4 w-20 bg-gray-100 dark:bg-gray-800" />)}
                </div>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setActiveCategory("All");
                      setVisibleCount(6);
                    }}
                    className={`pb-4 text-xs lg:text-sm uppercase tracking-widest whitespace-nowrap font-medium transition-all duration-300 relative ${activeCategory === "All"
                      ? "text-black dark:text-white"
                      : "text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white"
                      }`}
                  >
                    {t('newsPage.categories.all')}
                    {activeCategory === "All" && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black dark:bg-white"></span>
                    )}
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setActiveCategory(cat.slug);
                        setVisibleCount(6);
                      }}
                      className={`pb-4 text-xs lg:text-sm uppercase tracking-widest whitespace-nowrap font-medium transition-all duration-300 relative ${activeCategory === cat.slug
                        ? "text-black dark:text-white"
                        : "text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white"
                        }`}
                    >
                      {cat.name}
                      {activeCategory === cat.slug && (
                        <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black dark:bg-white"></span>
                      )}
                    </button>
                  ))}
                </>
              )}
            </div>

            {/* Search */}
            <div className="relative w-full lg:w-72 pb-4">
              <input
                type="text"
                placeholder={t('newsPage.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 py-2 pl-2 pr-10 focus:outline-none focus:border-black dark:focus:border-white transition-colors text-sm font-light text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-600"
              />
              <Search size={18} className="absolute right-2 top-2 text-gray-400 dark:text-gray-500 transition-colors" />
            </div>
          </div>

          {loading ? (
            <div className="space-y-16">
              {/* Featured Skeleton */}
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 animate-pulse">
                <Skeleton className="w-full lg:w-2/3 h-[300px] lg:h-[500px] rounded-2xl bg-gray-100 dark:bg-gray-800" />
                <div className="w-full lg:w-1/3 space-y-4 py-4">
                  <Skeleton className="h-4 w-32 bg-gray-100 dark:bg-gray-800" />
                  <Skeleton className="h-12 w-full bg-gray-100 dark:bg-gray-800" />
                  <Skeleton className="h-24 w-full bg-gray-100 dark:bg-gray-800" />
                  <Skeleton className="h-8 w-40 bg-gray-100 dark:bg-gray-800" />
                </div>
              </div>
              {/* Grid Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
                {[1, 2, 3].map(i => (
                  <div key={i} className="space-y-6">
                    <Skeleton className="aspect-[4/3] w-full rounded-2xl bg-gray-100 dark:bg-gray-800" />
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-32 bg-gray-100 dark:bg-gray-800" />
                      <Skeleton className="h-8 w-full bg-gray-100 dark:bg-gray-800" />
                      <Skeleton className="h-12 w-full bg-gray-100 dark:bg-gray-800" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-40">
              <p className="text-red-500 uppercase tracking-widest text-xs font-semibold">Error: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 border border-black hover:bg-black hover:text-white transition-colors uppercase tracking-widest text-xs font-bold"
              >
                Retry
              </button>
            </div>
          ) : filteredNews.length > 0 ? (
            <div className="mb-12">
              {/* Featured First News Item */}
              <Link to={`/news/${displayedNews[0].slug}`} className="group cursor-pointer flex flex-col lg:flex-row gap-8 lg:gap-12 mb-16 items-center">
                <div className="w-full lg:w-2/3 overflow-hidden relative bg-gray-100 h-[300px] lg:h-[500px] rounded-2xl">
                  <ImageWithFallback
                    src={getImageUrl(displayedNews[0].image_url)}
                    alt={displayedNews[0].title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  {displayedNews[0].category && (
                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-black shadow-sm">
                      {displayedNews[0].category.name}
                    </div>
                  )}
                </div>
                <div className="w-full lg:w-1/3 flex flex-col py-4">
                  <div className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-4">
                    {formatDate(displayedNews[0].published_at)}
                  </div>
                  <h3 className={`${i18n.language === 'ka' ? 'text-xl lg:text-2xl' : 'text-3xl lg:text-4xl'} font-[Cinzel] font-semibold text-gray-800 leading-snug group-hover:text-yellow-600 transition-colors mb-6`}>
                    {displayedNews[0].title}
                  </h3>
                  <p className={`text-gray-500 font-light mb-8 ${i18n.language === 'ka' ? 'line-clamp-5 lg:line-clamp-6' : 'line-clamp-4'} font-['DejaVu_Sans']`}>
                    {displayedNews[0].excerpt || "Discover the latest updates and announcements from Origami. Our commitment to luxury, innovation, and sustainable development continues to set new benchmarks."}
                  </p>
                  <div className="mt-auto flex items-center space-x-2 text-sm uppercase tracking-widest font-bold text-black border-b border-black pb-1 self-start hover:text-yellow-600 hover:border-yellow-600 transition-colors">
                    <span>{t('newsPage.readFullStory')}</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>

              {/* Remaining Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
                {displayedNews.slice(1).map((newsItem) => (
                  <Link key={newsItem.id} to={`/news/${newsItem.slug}`} className="group cursor-pointer flex flex-col h-full">
                    <div className="overflow-hidden aspect-[4/3] mb-6 relative bg-gray-100 rounded-2xl">
                      <ImageWithFallback
                        src={getImageUrl(newsItem.image_url)}
                        alt={newsItem.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                      {newsItem.category && (
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-black shadow-sm">
                          {newsItem.category.name}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col flex-grow">
                      <div className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-3">
                        {formatDate(newsItem.published_at)}
                      </div>
                      <h3 className={`${i18n.language === 'ka' ? 'text-base lg:text-lg' : 'text-xl lg:text-2xl'} font-[Cinzel] font-semibold text-gray-800 leading-snug group-hover:text-yellow-600 transition-colors mb-3 line-clamp-2`}>
                        {newsItem.title}
                      </h3>
                      <p className={`text-gray-500 dark:text-gray-400 text-sm ${i18n.language === 'ka' ? 'line-clamp-3' : 'line-clamp-2'} mb-6 font-['DejaVu_Sans'] leading-relaxed`}>
                        {newsItem.excerpt}
                      </p>
                      <div className="mt-auto pt-4 flex items-center space-x-2 text-xs uppercase tracking-widest font-bold text-black border-t border-gray-100">
                        <span>{t('newsPage.readMore')}</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-40">
              <p className="text-gray-500 uppercase tracking-widest text-sm font-light">{t('newsPage.noNews')}</p>
            </div>
          )}

          {/* Load More Button */}
          {visibleCount < filteredNews.length && (
            <div className="mt-20 flex justify-center">
              <button
                onClick={() => setVisibleCount(prev => prev + 3)}
                className="px-10 py-4 border border-black hover:bg-black hover:text-white transition-colors uppercase tracking-widest font-semibold text-sm"
              >
                {t('newsPage.loadMore')}
              </button>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
