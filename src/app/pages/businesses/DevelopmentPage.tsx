import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { ArrowRight, Building2, Loader2, Crown } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { CONFIG } from "../../config";
import { SEO } from "../../components/SEO";

interface Project {
  id: number;
  slug: string;
  name: string;
  description: string;
  image: string;
  custom_link: string;
  rank: number;
  status: string;
}

interface ServiceData {
  slug: string;
  name: string;
  description: string;
  icon: string;
  projects: Project[];
}

export function PropertyDevelopmentPage() {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState<ServiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const lang = i18n.language || "en";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/services/development?locale=${lang}`);
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.error("Error fetching development data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [lang]);

  const getImageUrl = (url: string | null) => {
    if (!url || url === "") return "";
    if (url.startsWith('http')) return url;
    return `${CONFIG.API_BASE_URL}${url}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white font-[Cinzel]">
        <Loader2 className="w-12 h-12 text-black animate-spin mb-4" />
        <p className="text-gray-500 uppercase tracking-widest text-xs font-semibold">Loading Development...</p>
      </div>
    );
  }

  if (!data) return null;

  const sortedProjects = [...(data.projects || [])]
    .filter(p => p.status === 'active')
    .sort((a, b) => a.rank - b.rank);

  return (
    <div className="bg-white min-h-screen text-gray-900 overflow-x-hidden">
      <SEO title={t('seo.development')} description={data.description} />
      {/* Hero Section */}
      <section className="relative h-[40vh] lg:h-[60vh] flex items-center justify-center bg-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src={getImageUrl(data.icon)}
            alt={data.name}
            className="w-full h-full object-cover opacity-60 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/90"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 text-center text-white pt-20">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-yellow-500 uppercase tracking-widest text-sm font-semibold mb-6"
          >
            {t('homePage.ourBusinesses')}
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className={`${i18n.language === 'ka' ? 'text-2xl lg:text-4xl' : 'text-4xl lg:text-5xl'} font-[Cinzel] font-bold tracking-widest drop-shadow-lg mb-8 uppercase leading-tight`}
          >
            {data.name.trim().split(' ').map((word, i) => (
              <React.Fragment key={i}>
                {word} {i === 0 && data.name.trim().split(' ').length > 1 && <br />}
              </React.Fragment>
            ))}
          </motion.h1>
        </div>
      </section>

      {/* Portfolio Types / Categories */}
      <section id="our-communities" className="py-24 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-6 lg:px-12">
         
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {sortedProjects.map((project, i) => (
              <motion.div 
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg group flex flex-col h-full border border-gray-100 hover:shadow-2xl transition-all duration-500"
              >
                <div className="relative h-64 overflow-hidden">
                  <ImageWithFallback 
                    src={getImageUrl(project.image)} 
                    alt={project.name} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>

                </div>
                <div className="p-8 flex-grow flex flex-col">
                  <h3 className={`${i18n.language === 'ka' ? 'text-lg lg:text-2xl' : 'text-2xl'} font-[Cinzel] font-semibold text-black mb-4 group-hover:text-yellow-600 transition-colors`}>{project.name.trim()}</h3>
                  <p className="text-gray-600 font-light leading-relaxed flex-grow text-sm line-clamp-4">
                    {project.description}
                  </p>
                  
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    {project.custom_link ? (
                      <a 
                        href={project.custom_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 text-xs font-bold tracking-widest uppercase text-black hover:text-yellow-600 transition-colors group/link"
                      >
                        <span>{t('homePage.more')}</span>
                        <ArrowRight size={14} className="transform group-hover/link:translate-x-1 transition-transform" />
                      </a>
                    ) : (
                      <Link 
                        to="/contact"
                        className="inline-flex items-center space-x-2 text-xs font-bold tracking-widest uppercase text-black hover:text-yellow-600 transition-colors group/link"
                      >
                        <span>{t('homePage.more')}</span>
                        <ArrowRight size={14} className="transform group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}