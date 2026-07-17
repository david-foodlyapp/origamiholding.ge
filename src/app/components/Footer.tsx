import React, { useState, useEffect } from "react";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, ChevronDown, Mail, Phone, MapPin, Globe } from "lucide-react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";
import { CONFIG } from "../config";
import { useBranding } from "../contexts/BrandingContext";

interface SocialNetwork {
  id: number;
  name: string;
  icon: string;
  custom_icon_url: string | null;
  image_url: string | null;
  link: string;
  status: boolean;
}

const iconMap: Record<string, React.ReactNode> = {
  facebook: <Facebook size={20} />,
  twitter: <Twitter size={20} />,
  instagram: <Instagram size={20} />,
  linkedin: <Linkedin size={20} />,
  youtube: <Youtube size={20} />,
  globe: <Globe size={20} />,
};

const FooterSection = ({ title, children, link, isLast }: { title: string, children: React.ReactNode, link?: string, isLast?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`${isLast ? '' : 'border-b border-gray-800 md:border-none'} py-4 md:py-0`}>
      {/* Mobile Header */}
      <button
        className="w-full flex justify-between items-center md:hidden focus:outline-none group"
        onClick={() => setIsOpen(!isOpen)}
      >
        {link ? (
          <Link to={link} className="text-white uppercase tracking-widest font-semibold text-left hover:text-yellow-500 transition-colors" onClick={(e) => e.stopPropagation()}>
            {title}
          </Link>
        ) : (
          <h4 className="text-white uppercase tracking-widest font-semibold text-left">
            {title}
          </h4>
        )}
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Desktop Header */}
      <h4 className="hidden md:block text-white uppercase tracking-widest font-semibold mb-6">
        {link ? (
          <Link to={link} className="hover:text-yellow-500 transition-colors">
            {title}
          </Link>
        ) : (
          title
        )}
      </h4>

      {/* Mobile Animated Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden"
          >
            <div className="pt-4 pb-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Content */}
      <div className="hidden md:block">
        {children}
      </div>
    </div>
  );
};

interface Service {
  slug: string;
  name: string;
  status: string;
}

interface ContactData {
  email: string | null;
  phone: string | null;
  address: string | null;
  map_link: string | null;
}

export function Footer() {
  const { t, i18n } = useTranslation();
  const [socials, setSocials] = useState<SocialNetwork[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [footerData, setFooterData] = useState<any>(null);
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const { branding } = useBranding();
  const lang = i18n.language || "en";

  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/social-networks`);
        const result = await response.json();
        setSocials(result.data?.filter((s: SocialNetwork) => s.status) || []);
      } catch (error) {
        console.error("Error fetching social networks:", error);
      }
    };

    const fetchServices = async () => {
      try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/services?locale=${lang}`);
        const result = await response.json();
        setServices(result.data?.filter((s: Service) => s.status === 'active') || []);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    const fetchFooterData = async () => {
      try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/sections/footer?locale=${lang}`);
        const result = await response.json();
        if (result.data) {
          setFooterData(result.data);
        }
      } catch (error) {
        console.error("Error fetching footer data:", error);
      }
    };

    const fetchContact = async () => {
      try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/settings/contact`);
        const result = await response.json();
        if (result.data) {
          setContactData(result.data);
        }
      } catch (error) {
        console.error("Error fetching contact settings:", error);
      }
    };

    fetchSocials();
    fetchServices();
    fetchFooterData();
    fetchContact();
  }, [lang]);

  return (
    <footer className="bg-black text-gray-300 pt-16 pb-8 md:py-20 font-light text-sm">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-4 md:gap-y-12 mb-12 md:mb-16">
          <div className="mb-8 md:mb-0">
            <Link to="/" className="inline-block mb-6">
              <img
                src={
                  lang === 'ka'
                    ? (branding?.logo_ka_url || branding?.logo_url || "/logo-white.png")
                    : (branding?.logo_en_url || branding?.logo_url || "/logo-white.png")
                }
                alt="Origami Holding"
                className="h-8 lg:h-10 w-auto object-contain"
              />
            </Link>
            <p className="mb-6 text-sm font-light tracking-[0.2em] uppercase text-white/65">
              {t('footer.tagline')}
            </p>
            <div className="flex space-x-4 opacity-80">
              {socials.map((social) => {
                const iconName = social.icon?.toLowerCase();
                const iconElement = iconName ? iconMap[iconName] : <Globe size={20} />;

                return (
                  <a
                    key={social.id}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center justify-center w-5 h-5"
                    title={social.name}
                  >
                    {social.custom_icon_url || social.image_url ? (
                      <img
                        src={social.custom_icon_url || social.image_url || ""}
                        alt={social.name}
                        className="w-full h-full object-contain brightness-0 invert"
                      />
                    ) : (
                      iconElement || <Globe size={20} />
                    )}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Nav labels use i18n */}
          <FooterSection title={t('footer.explore')}>
            <ul className="space-y-4 opacity-70">
              <li><Link to="/" className="hover:text-white transition-colors block">{t('nav.ourStory')}</Link></li>
              <li><Link to="/leadership" className="hover:text-white transition-colors block">{t('nav.team')}</Link></li>
              <li><Link to="/news" className="hover:text-white transition-colors block">{t('nav.news')}</Link></li>
            </ul>
          </FooterSection>

          <FooterSection title={t('footer.ourBusinesses')}>
            <ul className="space-y-4 opacity-70">
              {services.length > 0 ? (
                services.map((service) => (
                  <li key={service.slug}>
                    <Link to={`/${service.slug}`} className="hover:text-white transition-colors block">
                      {service.name}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li><Link to="/architecture" className="hover:text-white transition-colors block">Architecture</Link></li>
                  <li><Link to="/development" className="hover:text-white transition-colors block">Development</Link></li>
                  <li><Link to="/hospitality" className="hover:text-white transition-colors block">Hospitality</Link></li>
                </>
              )}
            </ul>
          </FooterSection>

          <FooterSection title={t('footer.contact')} isLast>
            <ul className="space-y-4 opacity-70">
              {contactData?.address && (
                <li>
                  <a href={contactData.map_link || "#"} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors block leading-relaxed">
                    {contactData.address}
                  </a>
                </li>
              )}
              {contactData?.email && (
                <li>
                  <a href={`mailto:${contactData.email}`} className="hover:text-white transition-colors block">
                    {contactData.email}
                  </a>
                </li>
              )}
              {contactData?.phone && (
                <li>
                  <a href={`tel:${contactData.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-white transition-colors block">
                    {contactData.phone}
                  </a>
                </li>
              )}
            </ul>
          </FooterSection>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center opacity-60 text-xs tracking-wider space-y-4 md:space-y-0 text-center md:text-left">
          <p>&copy; {new Date().getFullYear()} Origami Holding. {t('footer.allRightsReserved')}</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 md:gap-y-0 md:mt-0">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">{t('footer.privacyPolicy')}</Link>
            <Link to="/terms-of-service" className="hover:text-white transition-colors">{t('footer.termsOfService')}</Link>
            <Link to="/cookie-policy" className="hover:text-white transition-colors">{t('footer.cookiePolicy')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
