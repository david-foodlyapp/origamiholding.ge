import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { CONFIG } from "../config";
import { SEO } from "../components/SEO";
import { Skeleton } from "../components/ui/skeleton";

interface LegalPageData {
  slug: string;
  title: string;
  intro_text: string;
  body: string;
  effective_date: string;
  hero_image: string | null;
  meta_title: string;
  meta_description: string;
}

export function TermsOfService() {
  const { i18n } = useTranslation();
  const [data, setData] = useState<LegalPageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${CONFIG.API_BASE_URL}/api/legal-pages/terms_of_service?locale=${i18n.language}`
        );
        const result = await response.json();
        if (result.data) {
          setData(result.data);
        }
      } catch (error) {
        console.error("Error fetching Terms of Service:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [i18n.language]);

  return (
    <div className="bg-white dark:bg-black min-h-screen text-gray-900 dark:text-gray-200">
      <SEO 
        title={data?.meta_title || "Terms of Service"} 
        description={data?.meta_description} 
      />

      {/* Header Banner */}
      <section className="relative h-[300px] lg:h-[400px] flex items-end pb-12 justify-center bg-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src={data?.hero_image || "https://images.unsplash.com/photo-1507679799987-c73779587ccf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGRvY3VtZW50fGVufDB8fHx8MTc3NDg4MTA4MHww&ixlib=rb-4.1.0&q=80&w=1920"}
            alt={data?.title || "Terms of Service"}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 text-center text-white">
          <h1 className={`${i18n.language === 'ka' ? 'text-2xl lg:text-4xl' : 'text-4xl lg:text-5xl'} font-[Cinzel] font-bold tracking-widest drop-shadow-lg mb-6 uppercase`}>
            {loading ? <Skeleton className="h-12 w-64 mx-auto bg-white/20" /> : (data?.title || "Terms of Service")}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <div className="space-y-12 font-light text-gray-700 dark:text-gray-300 leading-relaxed">
            
            {loading ? (
              <div className="space-y-6">
                <Skeleton className="h-4 w-32 bg-gray-200 dark:bg-gray-800" />
                <Skeleton className="h-20 w-full bg-gray-200 dark:bg-gray-800" />
                <Skeleton className="h-64 w-full bg-gray-200 dark:bg-gray-800" />
              </div>
            ) : data ? (
              <>
                <div>
                  <p className="text-xl font-medium text-gray-900 dark:text-white mb-6">
                    {data.intro_text}
                  </p>
                  <div 
                    className="prose prose-lg dark:prose-invert max-w-none 
                      prose-headings:font-[Cinzel] prose-headings:font-semibold prose-headings:text-black dark:prose-headings:text-white
                      prose-p:text-gray-700 dark:prose-p:text-gray-300"
                    dangerouslySetInnerHTML={{ __html: data.body }} 
                  />
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <p>Failed to load content. Please try again later.</p>
              </div>
            )}

          </div>
        </div>
      </section>
    </div>
  );
}

