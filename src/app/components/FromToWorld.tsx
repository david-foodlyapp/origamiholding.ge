import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Globe, Building2, Users } from "lucide-react";
import { CONFIG } from "../config";

interface StatItem {
  id: number;
  title: string;
  subtitle: string;
  description: string;
}

interface SectionData {
  title: string;
  description: string;
  items: StatItem[];
}

export function FromToWorld() {
  const { t, i18n } = useTranslation();
  const isKa = i18n.language === 'ka';
  const [sectionData, setSectionData] = useState<SectionData | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/sections/our-results?locale=${i18n.language}`);
        const result = await response.json();
        if (result.data) {
          setSectionData(result.data);
        }
      } catch (error) {
        console.error("Error fetching our-results section data:", error);
      }
    };

    fetchItems();
  }, [i18n.language]);

  // Use dynamic description from API
  const description = sectionData?.description;

  // We map the dynamic items to the static icons. 
  // If there are more items, we could use a default icon or mapping logic.
  const icons = [
    <Globe strokeWidth={1} className="w-12 h-12 text-yellow-600 mb-6 mx-auto" />,
    <Building2 strokeWidth={1} className="w-12 h-12 text-yellow-600 mb-6 mx-auto" />,
    <Users strokeWidth={1} className="w-12 h-12 text-yellow-600 mb-6 mx-auto" />
  ];

  const stats = sectionData?.items?.map((item, index) => ({
    icon: icons[index % icons.length],
    number: item.subtitle || item.description,
    text: item.title
  })) || [];

  return (
    <section className="pb-20 lg:pb-28 pt-0 bg-white text-gray-900">
      <div className="container mx-auto px-6 lg:px-12 max-w-6xl text-center">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-[Cinzel] tracking-[0.15em] lg:tracking-[0.2em] uppercase text-gray-800 mb-6 lg:mb-8">
          {sectionData?.title}
        </h2>
        {description && (
          <p className="text-gray-500 font-light max-w-2xl mx-auto mb-16 text-sm lg:text-base leading-relaxed">
            {description}
          </p>
        )}

        <div className="border border-gray-200 rounded-xl p-8 lg:p-14 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            {stats.map((stat, index) => (
              <div key={index} className="pt-8 md:pt-0 first:pt-0 flex flex-col items-center">
                {stat.icon}
                <div className="text-3xl lg:text-4xl font-semibold mb-3 text-gray-800">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-500 font-light text-center px-4 leading-relaxed">
                  {stat.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
