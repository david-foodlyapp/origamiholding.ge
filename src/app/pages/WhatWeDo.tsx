import React, { useState, useEffect } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { CONFIG } from "../config";
import { SEO } from "../components/SEO";

interface AboutUsData {
  id: number;
  type: string;
  title: string;
  body: string;
  image: string;
  rank: number;
  status: boolean;
}

export function WhatWeDo() {
  const { t, i18n } = useTranslation();
  const [aboutData, setAboutData] = useState<AboutUsData | null>(null);
  const [loading, setLoading] = useState(true);
  const lang = i18n.language || "en";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/about-us?locale=${lang}`);
        const result = await response.json();
        // Assuming we want the first active record
        if (result.data && result.data.length > 0) {
          setAboutData(result.data[0]);
        }
      } catch (error) {
        console.error("Error fetching about-us data:", error);
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
        <p className="text-gray-500 uppercase tracking-widest text-xs font-semibold">Loading...</p>
      </div>
    );
  }

  if (!aboutData) return null;

  return (
    <div className="bg-white min-h-screen text-gray-900 overflow-x-hidden">
      <SEO title={t('nav.ourStory')} description={aboutData.body.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()} />
      {/* Hero Section */}
      <section className="relative h-[40vh] lg:h-[60vh] flex items-center justify-center bg-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* Desktop Video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="hidden md:block w-full h-full object-cover opacity-60 scale-105"
          >
            <source src="https://origam.ge/Origami-Holding.mp4" type="video/mp4" />
          </video>
          {/* Mobile Video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="block md:hidden w-full h-full object-cover opacity-60 scale-105"
          >
            <source src="https://origam.ge/Origami-m.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 text-center text-white pt-20">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-4xl lg:text-5xl font-[Cinzel] font-bold tracking-widest drop-shadow-lg mb-6 uppercase"
          >
            {aboutData.title}
          </motion.h1>
         
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-gray-700 font-light leading-relaxed space-y-8
                       [&>h3]:font-[Cinzel] [&>h3]:text-black [&>h3]:font-semibold [&>h3]:uppercase [&>h3]:tracking-widest [&>h3]:text-2xl [&>h3]:mt-12 [&>h3]:mb-6 [&>h3]:border-b [&>h3]:border-gray-100 [&>h3]:pb-4
                       [&>p]:mb-6 [&>p]:text-lg
                       [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-8 [&>ul>li]:mb-2
                       [&>strong]:text-black [&>strong]:font-semibold"
            dangerouslySetInnerHTML={{ __html: aboutData.body }}
          />
        </div>
      </section>
    </div>
  );
}
