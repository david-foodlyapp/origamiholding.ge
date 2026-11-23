import React, { useState, useEffect } from "react";
import { Menu, X, Moon, Sun } from "lucide-react";
import { Link, useLocation } from "react-router";
import { useTheme } from "../contexts/ThemeContext";
import { motion, AnimatePresence, Variants } from "motion/react";
import { useTranslation } from "react-i18next";
import { useBranding } from "../contexts/BrandingContext";
import { CONFIG } from "../config";

interface MenuItem {
  id: number;
  title: string;
  link: string;
  rank: number;
  status: boolean;
}

function isMenuItem(item: unknown): item is MenuItem {
  if (!item || typeof item !== 'object') return false;
  const value = item as MenuItem;
  return typeof value.id === 'number' && typeof value.title === 'string'
    && value.title.trim().length > 0 && typeof value.link === 'string'
    && /^(\/(?!\/)|https?:\/\/)/i.test(value.link)
    && typeof value.rank === 'number' && value.status === true;
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const lang = i18n.language?.startsWith('ka') ? 'ka' : 'en';
  const { branding } = useBranding();

  useEffect(() => {
    const controller = new AbortController();
    setMenuItems([]);

    const fetchMenu = async () => {
      try {
        const params = new URLSearchParams({ platform: 'origami', locale: lang });
        const response = await fetch(
          `${CONFIG.API_BASE_URL}/api/sections/main-menu-holding?${params}`,
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error(`Menu request failed: ${response.status}`);
        const result = await response.json();
        if (!controller.signal.aborted) {
          setMenuItems(result.data?.status === true && Array.isArray(result.data.items)
            ? result.data.items.filter(isMenuItem).sort((a: MenuItem, b: MenuItem) => a.rank - b.rank)
            : []);
        }
      } catch (error) {
        if (!controller.signal.aborted) console.error('Error fetching main menu:', error);
      }
    };

    fetchMenu();
    return () => controller.abort();
  }, [lang]);

  const currentLang = i18n.language?.startsWith('ka') ? 'KA' : 'EN';

  const changeLanguage = (lang: 'EN' | 'KA') => {
    i18n.changeLanguage(lang === 'KA' ? 'ka' : 'en');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const navClass = isMenuOpen 
    ? "bg-transparent text-white shadow-none py-3 transition-all duration-300" 
    : isScrolled || !isHomePage
    ? "bg-white/80 dark:bg-black/70 backdrop-blur-md text-black dark:text-white shadow-md border-b border-gray-200/50 dark:border-gray-800/50 py-3 transition-all duration-300"
    : "bg-transparent text-white py-4 transition-all duration-300";

  const btnClass = (isScrolled || !isHomePage || isMenuOpen)
    ? "border-black hover:bg-black hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black"
    : "border-white hover:bg-white hover:text-black";

  // When menu is open, forces icons and logo to be white
  const iconAndLogoClass = isMenuOpen 
    ? "text-black dark:text-white"
    : "";

  const menuVariants: Variants = {
    closed: {
      x: "100%",
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as const,
      }
    },
    open: {
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as const,
        when: "beforeChildren",
        staggerChildren: 0.08,
      }
    }
  };

  const itemVariants: Variants = {
    closed: { opacity: 0, x: 20 },
    open: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" as const } }
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${navClass}`}
    >
      <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between relative z-50">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img 
            src={
              (() => {
                const isDarkBackground = isMenuOpen 
                  ? theme === 'dark' 
                  : ((!isScrolled && isHomePage) || (theme === 'dark' && (isScrolled || !isHomePage)));
                
                if (i18n.language === 'ka') {
                  return isDarkBackground 
                    ? (branding?.logo_ka_url || "/logo-white-ge.png") 
                    : (branding?.logo_dark_ka_url || "/logo-black-ge.png");
                } else {
                  return isDarkBackground 
                    ? (branding?.logo_en_url || "/logo-white.png") 
                    : (branding?.logo_dark_en_url || "/logo-black.png");
                }
              })()
            } 
            alt="Origami Holding" 
            className="h-6 lg:h-8 w-auto object-contain transition-all duration-300"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center space-x-8 text-sm tracking-wider uppercase font-medium">
          {menuItems.map((item) => (
            /^https?:\/\//i.test(item.link)
              ? <a key={item.id} href={item.link} className="hover:text-yellow-500 transition-colors">{item.title}</a>
              : <Link key={item.id} to={item.link} className="hover:text-yellow-500 transition-colors">{item.title}</Link>
          ))}

          {/* Desktop Language Switcher */}
          <div className={`relative flex items-center p-1 border rounded-full transition-all duration-300 ${
            isScrolled || !isHomePage 
              ? 'border-gray-200 dark:border-gray-800 bg-gray-100/50 dark:bg-white/5' 
              : 'border-white/30 bg-white/10'
          }`}>
            <motion.div
              initial={false}
              animate={{ x: currentLang === 'EN' ? 0 : '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`absolute top-1 left-1 bottom-1 w-[calc(50%-4px)] rounded-full shadow-sm ${
                isScrolled || !isHomePage 
                  ? 'bg-black dark:bg-white' 
                  : 'bg-white'
              }`}
            />
            <button
              onClick={() => changeLanguage('EN')}
              className={`relative z-10 px-4 py-1 text-[10px] tracking-widest transition-colors duration-300 ${
                currentLang === 'EN' 
                  ? (isScrolled || !isHomePage 
                      ? '!text-white dark:!text-black font-bold' 
                      : '!text-black font-bold') 
                  : (isScrolled || !isHomePage 
                      ? 'text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white' 
                      : 'text-white/60 hover:text-white')
              }`}
            >
              ENG
            </button>
            <button
              onClick={() => changeLanguage('KA')}
              className={`relative z-10 px-4 py-1 text-[10px] tracking-widest font-[Inter] transition-colors duration-300 ${
                currentLang === 'KA' 
                  ? (isScrolled || !isHomePage 
                      ? '!text-white dark:!text-black font-bold' 
                      : '!text-black font-bold') 
                  : (isScrolled || !isHomePage 
                      ? 'text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white' 
                      : 'text-white/60 hover:text-white')
              }`}
            >
              GEO
            </button>
          </div>

          <button 
            onClick={toggleTheme} 
            className={`p-2 rounded-full transition-colors flex items-center justify-center ${
              isScrolled || !isHomePage 
                ? 'hover:bg-gray-200/50 dark:hover:bg-white/10 text-black dark:text-white' 
                : 'hover:bg-white/20 text-white'
            }`}
            aria-label={t('common.darkMode')}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className={`flex items-center lg:hidden space-x-4 transition-colors ${iconAndLogoClass}`}>
          <button 
            onClick={toggleTheme} 
            className={`p-2 rounded-full transition-colors ${isMenuOpen ? 'hover:bg-white/20' : 'hover:bg-gray-200/20'}`}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="outline-none focus:outline-none p-1"
          >
            <motion.div
              animate={{ rotate: isMenuOpen ? 90 : 0, scale: isMenuOpen ? 1.1 : 1 }}
              transition={{ duration: 0.2 }}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </motion.div>
          </button>
        </div>
      </div>

      {/* Backdrop for Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Content - Slide from Right */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed top-0 right-0 w-full sm:w-[400px] h-[100dvh] bg-white dark:bg-[#050505] text-black dark:text-white shadow-2xl lg:hidden z-40 flex flex-col border-l border-gray-200 dark:border-gray-800"
          >
            <div className="flex-1 flex flex-col p-8 pt-[120px] space-y-0 font-[Cinzel] tracking-[0.15em] uppercase text-lg overflow-y-auto">
              {menuItems.map((item) => (
                <motion.div key={item.id} variants={itemVariants}>
                  {/^https?:\/\//i.test(item.link) ? (
                    <a href={item.link} className="block py-5 border-b border-gray-100 dark:border-gray-800 hover:text-yellow-600 transition-colors" onClick={() => setIsMenuOpen(false)}>{item.title}</a>
                  ) : (
                    <Link to={item.link} className="block py-5 border-b border-gray-100 dark:border-gray-800 hover:text-yellow-600 transition-colors" onClick={() => setIsMenuOpen(false)}>{item.title}</Link>
                  )}
                </motion.div>
              ))}

              {/* Language Selector */}
              <motion.div variants={itemVariants} className="pt-8 flex flex-wrap gap-4">
                <button 
                  onClick={() => changeLanguage('EN')}
                  className={`px-5 py-2 text-[10px] tracking-widest border transition-all duration-300 rounded-2xl ${currentLang === 'EN' ? 'border-black dark:border-white bg-black dark:bg-[#ffffff] text-white dark:text-[#000000] font-bold' : 'border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:border-gray-500 hover:text-black dark:hover:text-white'}`}
                >
                  ENG
                </button>
                <button 
                  onClick={() => changeLanguage('KA')}
                  className={`px-5 py-2 text-[10px] tracking-widest border transition-all duration-300 rounded-2xl ${currentLang === 'KA' ? 'border-black dark:border-white bg-black dark:bg-[#ffffff] text-white dark:text-[#000000] font-bold' : 'border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:border-gray-500 hover:text-black dark:hover:text-white'} font-[Inter]`}
                >
                  GEO
                </button>
              </motion.div>


            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
