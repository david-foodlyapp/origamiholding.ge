import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useTranslation } from "react-i18next";
import { CONFIG } from "../config";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AboutData {
  id: number;
  type: string;
  title: string | null;
  body: string | null;
  image: string | null;
}

const CUSTOM_KA_ABOUT_HTML = `
  <p>“Origami”-ს ისტორია 2008 წელს, ბათუმში, BWC-ის სახელით დაიწყო. 18-წლიანი უწყვეტი მუშაობისა და ზრდის შედეგად, დღეს უკვე რეგიონის ერთ-ერთ ყველაზე მასშტაბურ, მრავალპროფილურ ჰოლდინგად ჩამოვყალიბდით. კომპანია სამ ძირითად მიმართულებას — დეველოპმენტს, არქიტექტურასა და სტუმარ-მასპინძლობას აერთიანებს, თუმცა ჩვენი მთავარი და სტრატეგიული ხაზი უძრავი ქონების განვითარებაა. ვფიქრობთ, რომ კომპანიაზე ძირითადად ფაქტები საუბრობენ — ჩვენ შევასრულეთ ყველა დაპირება! შევქმენით ბათუმის ერთ-ერთი ყველაზე მასშტაბური პროექტი White Sails, ამჟამად ვაშენებთ პრემიუმ კლასის საცხოვრებელ კომპლექსს Well Home-ს და ვიწყებთ კომპანიის ისტორიაში ყველაზე თამამი იდეის — Origami Island-ის განხორციელებას.</p>
`;

const CUSTOM_EN_ABOUT_HTML = `
  <p>The history of “Origami” began in 2008 in Batumi under the name BWC. Over 18 years of continuous growth and development, we have evolved into one of the region’s largest and most diversified holdings. The company brings together three core directions — development, architecture, and hospitality — while our primary and strategic focus remains real estate development.</p>
`;

export function About() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "en";
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchAbout = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/about-us?type=Origami&locale=${lang}`, {
          headers: {
            "Accept": "application/json"
          }
        });
        if (!response.ok) throw new Error("Failed to fetch");
        const result = await response.json();
        if (result.data && result.data.length > 0) {
          setAboutData(result.data[0]);
        }
      } catch (error) {
        console.error("Error fetching about us:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, [lang]);

  const customBody =
    lang === "ka"
      ? CUSTOM_KA_ABOUT_HTML
      : lang === "en"
        ? CUSTOM_EN_ABOUT_HTML
        : null;
  const aboutTextClassName =
    lang === "ka"
      ? "prose prose-lg dark:prose-invert text-gray-600 font-light leading-relaxed max-w-none [&>p]:mb-4 [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ul>li]:mb-2 [&>strong]:font-semibold text-center"
      : "prose dark:prose-invert text-[0.95rem] text-gray-600 font-light leading-[1.95] max-w-[58rem] mx-auto [&>p]:mb-4 [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ul>li]:mb-2 [&>strong]:font-semibold text-center";

  // Split the body into sections (assumes <h3> as section markers)
  const bodySections = customBody ? [customBody] : aboutData?.body ? aboutData.body.split(/(?=<h3>)/) : [];
  const initialBody = customBody ?? bodySections.slice(0, 2).join('');
  const remainingBody = bodySections.slice(2).join('');
  const hasMore = !customBody && bodySections.length > 2;

  return (
    <section id="about" className="py-24 bg-white dark:bg-[#050505] text-gray-900 dark:text-white overflow-hidden transition-colors duration-500">
      <div className="container mx-auto px-6 lg:px-16 flex flex-col items-center">
        <div className="w-full max-w-4xl flex flex-col items-center space-y-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-[Cinzel] text-gray-800 dark:text-white leading-tight uppercase tracking-widest">
            {aboutData?.title || "A Legacy of Excellence"}
          </h2>
          
          {loading ? (
            <div className="flex items-center text-gray-500 py-4">
               <Loader2 className="w-6 h-6 animate-spin mr-2" />
               <span className="text-sm uppercase tracking-widest">{t('newsPage.loading') || 'Loading...'}</span>
            </div>
          ) : (customBody || aboutData?.body) ? (
            <div className="w-full flex flex-col items-center">
              <div 
                className={aboutTextClassName}
                dangerouslySetInnerHTML={{ __html: initialBody }} 
              />
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="overflow-hidden w-full"
                  >
                    <div 
                      className={aboutTextClassName}
                      dangerouslySetInnerHTML={{ __html: remainingBody }} 
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {!isExpanded && hasMore && (
                <div className="mt-8">
                  <button 
                    onClick={() => setIsExpanded(true)}
                    className="inline-flex items-center space-x-2 text-sm uppercase tracking-wider font-semibold border-b border-black pb-1 hover:text-yellow-600 hover:border-yellow-600 transition-colors cursor-pointer"
                  >
                    <span>{t('homePage.discoverOurStory') || "ჩვენი ისტორია"}</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce"><path d="M7 10l5 5 5-5"/></svg>
                  </button>
                </div>
              )}

              {isExpanded && (
                <div className="mt-12">
                   <Link to="/what-we-do" className="inline-flex items-center space-x-2 text-sm uppercase tracking-wider font-semibold border-b border-black pb-1 hover:text-yellow-600 hover:border-yellow-600 transition-colors">
                    <span>{t('homePage.discoverOurStory') || "Discover Our Story"}</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-8">
              <p className="text-lg lg:text-xl text-gray-600 font-light leading-relaxed">
                Origami Holding has established itself as a premier developer and investor globally.
                Since our inception, we have shaped skylines and redefined luxury living across continents.
              </p>
              <Link to="/what-we-do" className="inline-flex items-center space-x-2 text-sm uppercase tracking-wider font-semibold border-b border-black pb-1 hover:text-yellow-600 hover:border-yellow-600 transition-colors">
                <span>{t('homePage.discoverOurStory') || "Discover Our Story"}</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
