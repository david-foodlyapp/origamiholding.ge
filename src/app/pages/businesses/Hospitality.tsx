import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { ArrowRight, Loader2 } from "lucide-react";
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

export function Hospitality() {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState<ServiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const lang = i18n.language || "en";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/services/hospitality?locale=${lang}`);
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.error("Error fetching hospitality data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [lang]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 text-black animate-spin mb-4" />
        <p className="text-gray-500 uppercase tracking-widest text-xs font-semibold">Loading Hospitality...</p>
      </div>
    );
  }

  if (!data) return null;

  const sortedProjects = [...(data.projects || [])]
    .filter(p => p.status === 'active')
    .sort((a, b) => a.rank - b.rank);

  const getImageUrl = (url: string | null) => {
    if (!url || url === "") return "";
    if (url.startsWith('http')) return url;
    return `${CONFIG.API_BASE_URL}${url}`;
  };

  return (
    <div className="bg-white min-h-screen text-gray-900 overflow-x-hidden">
      <SEO title={t('seo.hospitality')} description={data.description} />
      {/* Hero Section */}
      <section className="relative h-[40vh] lg:h-[60vh] flex items-center justify-center bg-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src={getImageUrl(data.icon)}
            alt={data.name}
            className="w-full h-full object-cover opacity-60 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/90"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 text-center text-white pt-20">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-yellow-500 uppercase tracking-widest text-sm font-semibold mb-4"
          >
            {t('homePage.ourBusinesses')}
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className={`${i18n.language === 'ka' ? 'text-2xl lg:text-4xl' : 'text-4xl lg:text-5xl'} font-[Cinzel] font-bold tracking-widest drop-shadow-lg mb-6 uppercase`}
          >
            {data.name.trim()}
          </motion.h1>

        </div>
      </section>

      {/* Portfolio Types */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-12">
          {sortedProjects.map((project, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={project.id}
                className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-24 py-16 lg:py-24`}
              >
                {/* Image Side */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="w-full lg:w-1/2"
                >
                  <div className="relative group overflow-hidden bg-gray-200 aspect-[4/3] lg:aspect-[3/4] max-h-[600px] rounded-2xl">
                    <ImageWithFallback
                      src={getImageUrl(project.image)}
                      alt={project.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  </div>
                </motion.div>

                {/* Text Side */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                  className="w-full lg:w-1/2 flex flex-col justify-center"
                >
                  <div className="flex items-center space-x-4 mb-6 opacity-60">
                    <span className="w-12 h-px bg-black"></span>
                    <span className="text-sm font-semibold tracking-widest uppercase">{data.name.trim()}</span>
                  </div>

                  <h3 className={`${i18n.language === 'ka' ? 'text-lg lg:text-3xl' : 'text-3xl lg:text-5xl'} font-[Cinzel] font-semibold text-black mb-6 leading-tight`}>
                    {project.name.trim()}
                  </h3>

                  <p className="text-gray-600 font-light text-lg leading-relaxed mb-10 whitespace-pre-wrap">
                    {project.description}
                  </p>

                  <div>
                    {project.custom_link ? (
                      <a 
                        href={project.custom_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-3 text-sm font-semibold tracking-widest uppercase text-black hover:text-yellow-600 transition-colors group"
                      >
                        <span>{t('homePage.more')}</span>
                        <ArrowRight size={18} className="transform group-hover:translate-x-2 transition-transform duration-300" />
                      </a>
                    ) : (
                      <Link
                        to="/contact"
                        className="inline-flex items-center space-x-3 text-sm font-semibold tracking-widest uppercase text-black hover:text-yellow-600 transition-colors group"
                      >
                        <span>{t('homePage.more')}</span>
                        <ArrowRight size={18} className="transform group-hover:translate-x-2 transition-transform duration-300" />
                      </Link>
                    )}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}