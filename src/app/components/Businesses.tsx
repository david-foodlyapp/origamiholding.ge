import React, { useState, useEffect } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { CONFIG } from "../config";
import { Skeleton } from "./ui/skeleton";

interface Service {
  id: number;
  slug: string;
  name: string;
  description: string;
  icon: string | null;
  rank: number;
  status: string;
}

export function Businesses() {
  const { i18n, t } = useTranslation();
  const [servicesCache, setServicesCache] = useState<Record<string, Service[]>>({});
  const [loading, setLoading] = useState(true);
  const lang = i18n.language || "en";

  useEffect(() => {
    const fetchServices = async () => {
      if (!servicesCache[lang]) {
        setLoading(true);
      }
      try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/services?locale=${lang}`);
        const result = await response.json();
        setServicesCache(prev => ({
          ...prev,
          [lang]: result.data?.filter((s: Service) => s.status === 'active') || []
        }));
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [lang]);

  const activeServices = [...(servicesCache[lang] || [])].sort((a, b) => a.rank - b.rank);

  const getImageUrl = (url: string | null) => {
    if (!url) return "";
    if (url.startsWith('http')) return url;
    return `${CONFIG.API_BASE_URL}${url}`;
  };

  return (
    <section id="businesses" className="pt-16 pb-24 bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-white transition-colors duration-500">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="mb-16 flex flex-col lg:flex-row justify-between items-center lg:items-end">
          <div className="w-full text-center lg:text-left">
            <h2 className="text-3xl lg:text-4xl font-[Cinzel] text-gray-800 dark:text-white leading-tight uppercase tracking-widest">
              {t('homePage.ourBusinesses')}
            </h2>         
          </div>
        </div>

        {loading && activeServices.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3].map((n) => (
              <Skeleton key={n} className="h-[450px] lg:h-[600px] w-full rounded-2xl bg-gray-200 dark:bg-gray-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {activeServices.map((service, index) => (
              <Link key={service.id || index} to={`/${service.slug}`} className="group relative h-[450px] lg:h-[600px] overflow-hidden cursor-pointer rounded-2xl block">
                <ImageWithFallback
                  src={getImageUrl(service.icon)}
                  alt={service.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="absolute bottom-0 left-0 p-8 flex flex-col justify-end h-full px-[32px] pt-[32px] pb-[34px] m-[0px] w-full">
                  <h3 className="text-lg lg:text-xl font-[Cinzel] text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {service.name}
                  </h3>
                  <div className="mt-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-200">
                    <span className="text-white text-xs uppercase tracking-widest flex items-center space-x-2">
                      <span>{t('homePage.more')}</span>
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
