import React, { useEffect, useState } from "react";
import { ChevronDown, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { CONFIG } from "../config";

export function Hero() {
  const { t, i18n } = useTranslation();
  const [sectionData, setSectionData] = useState<any>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/sections/carousell?locale=${i18n.language}`);
        const result = await response.json();
        if (result.data) {
          setSectionData(result.data);
        }
      } catch (error) {
        console.error("Error fetching carousell items:", error);
      }
    };

    fetchItems();
  }, [i18n.language]);
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black text-white">
      {/* Background Video */}
      <div className="absolute inset-0 z-0 bg-black">
        {/* Desktop Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="hidden md:block w-full h-full object-cover opacity-80"
        >
          <source src="https://origam.ge/Origami-Holding.mp4" type="video/mp4" />
        </video>
        {/* Mobile Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="block md:hidden w-full h-full object-cover opacity-80"
        >
          <source src="https://origam.ge/Origami-m.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* <h1 className={`${i18n.language === 'ka' ? 'text-4xl md:text-5xl lg:text-6xl' : 'text-5xl md:text-7xl lg:text-8xl'} font-[Cinzel] mb-6 tracking-wide drop-shadow-lg`}>
          {sectionData?.items?.[0]?.title || "Origami"} <br />
        </h1> */}
        {/* <p className="text-lg md:text-xl font-light tracking-widest uppercase mb-12 text-gray-200">
          {sectionData?.items?.[0]?.subtitle || "The Art of Living"}
        </p> */}


      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <ChevronDown size={32} className="text-white opacity-70" />
      </div>
    </section>
  );
}
