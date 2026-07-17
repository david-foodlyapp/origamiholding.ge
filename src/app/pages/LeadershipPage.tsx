import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Linkedin, Mail, ArrowRight, Facebook, Instagram, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { CONFIG } from "../config";
import { Skeleton } from "../components/ui/skeleton";
import { SEO } from "../components/SEO";

interface TeamMember {
  id: number;
  slug: string;
  name: string;
  position: string;
  biography: string;
  image_url: string | null;
  facebook: string | null;
  instagram: string | null;
  linkedin: string | null;
  email: string | null;
  rank: number;
  status: string;
}

export function LeadershipPage() {
  const { t, i18n } = useTranslation();
  const [teamCache, setTeamCache] = useState<Record<string, TeamMember[]>>({});
  const [loading, setLoading] = useState(true);
  const lang = i18n.language || "en";

  useEffect(() => {
    const fetchTeam = async () => {
      if (!teamCache[lang]) {
        setLoading(true);
      }
      try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/teams?locale=${lang}`);
        const result = await response.json();
        setTeamCache(prev => ({
          ...prev,
          [lang]: result.data?.filter((m: TeamMember) => m.status === 'active') || []
        }));
      } catch (error) {
        console.error("Error fetching team:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, [lang]);

  const sortedExecutives = [...(teamCache[lang] || [])].sort((a, b) => a.rank - b.rank);

  const getImageUrl = (url: string | null) => {
    if (!url) return "";
    if (url.startsWith('http')) return url;
    return `${CONFIG.API_BASE_URL}${url}`;
  };

  return (
    <div className="bg-white min-h-screen text-gray-900 overflow-x-hidden">
      <SEO title={t('nav.team')} description={t('leadership.description')} />
      {/* Hero Section */}
      <section className="relative h-[35vh] lg:h-[40vh] flex items-center justify-center bg-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1920"
            alt="Corporate Leadership Office"
            className="w-full h-full object-cover opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 text-center text-white pt-10">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className={`${i18n.language === 'ka' ? 'text-2xl lg:text-4xl' : 'text-4xl lg:text-5xl'} font-[Cinzel] font-bold tracking-widest drop-shadow-lg mb-6 uppercase`}
          >
          {t('leadership.title')}
          </motion.h1>
        </div>
      </section>

  

      {/* Board of Directors / Executives */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16"> 
            <motion.div 
              initial={{ opacity: 0, width: 0 }}
              whileInView={{ opacity: 1, width: "60px" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-px bg-yellow-600 mx-auto"
            ></motion.div>
          </div>

          {loading && sortedExecutives.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="space-y-6">
                  <Skeleton className="aspect-[3/4] w-full rounded-2xl bg-gray-200 dark:bg-gray-800" />
                  <div className="space-y-2 flex flex-col items-center">
                    <Skeleton className="h-6 w-32 bg-gray-200 dark:bg-gray-800" />
                    <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-gray-800" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {sortedExecutives.map((exec, index) => (
                <motion.div 
                  key={exec.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="group text-center"
                >
                  <div className="overflow-hidden aspect-[3/4] mb-6 relative rounded-2xl bg-gray-200">
                    <ImageWithFallback
                      src={getImageUrl(exec.image_url)}
                      alt={exec.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                      <div className="flex justify-center space-x-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        {exec.linkedin && (
                          <a href={exec.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-yellow-600 hover:text-white transition-colors">
                            <Linkedin size={18} />
                          </a>
                        )}
                        {exec.facebook && (
                            <a href={exec.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-yellow-600 hover:text-white transition-colors">
                            <Facebook size={18} />
                            </a>
                        )}
                        {exec.email && (
                          <a href={`mailto:${exec.email}`} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-yellow-600 hover:text-white transition-colors">
                            <Mail size={18} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <h3 className={`font-[Cinzel] font-semibold text-gray-900 mb-1 group-hover:text-yellow-600 transition-colors ${lang === 'ka' ? 'text-lg' : 'text-xl'}`}>
                    {exec.name}
                  </h3>
                  <p className={`tracking-widest uppercase text-gray-500 font-medium ${lang === 'ka' ? 'text-[10px]' : 'text-sm'}`}>
                    {exec.position}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
      </div>
  );
}
