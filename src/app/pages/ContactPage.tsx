import React, { useState } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Phone, Mail, MapPin, ArrowRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SEO } from "../components/SEO";
import { CONFIG } from "../config";

interface ContactData {
  email: string | null;
  phone: string | null;
  secondary_phone: string | null;
  address: string | null;
  map_link: string | null;
  map_iframe: string | null;
}

export function ContactPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    inquiryType: "",
    message: ""
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [loadingContact, setLoadingContact] = useState(true);

  React.useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/settings/contact`);
        const result = await response.json();
        if (result.data) {
          setContactData(result.data);
        }
      } catch (error) {
        console.error("Error fetching contact data:", error);
      } finally {
        setLoadingContact(false);
      }
    };
    fetchContact();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading') return;
    
    setStatus('loading');

    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/api/contact-messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone,
          subject: formData.inquiryType,
          message: formData.message,
          source_page: window.location.pathname
        }),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          inquiryType: "",
          message: ""
        });
        // Reset status after 5 seconds
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 5000);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <SEO title={t('seo.contact')} description={t('contactPage.description')} />
      {/* Header Banner */}
      <section className="relative h-[400px] lg:h-[500px] flex items-end pb-16 justify-center bg-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBvZmZpY2UlMjBidWlsZGluZ3xlbnwxfHx8fDE3NzQ4ODEwODB8MA&ixlib=rb-4.1.0&q=80&w=1920"
            alt="Contact Us"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 text-center text-white">
          <h1 className="text-4xl lg:text-5xl font-[Cinzel] text-white font-bold tracking-wide drop-shadow-md uppercase">
            {t('manuPages.contact')}
          </h1>
          <div className="flex justify-center items-center space-x-2 text-xs uppercase tracking-widest text-gray-400 mb-4">
            <span>{t('manuPages.home')}</span>
            <span>/</span>
            <span className="text-white">{t('manuPages.contact')}</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">

            {/* Contact Form */}
            <div>
              <div className="mb-12">
                <h2 className="text-xl lg:text-2xl font-[Cinzel] font-semibold text-gray-900 mb-4">
                  {t('contactPage.sendEnquiry')}
                </h2>
              </div>

              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative group">
                    <input
                      type="text"
                      id="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder={t('contactPage.firstName')}
                      className="w-full bg-transparent border-b border-gray-300 py-3 text-sm font-light focus:outline-none focus:border-black transition-colors peer placeholder-transparent"
                      required
                    />
                    <label htmlFor="firstName" className="absolute left-0 -top-3.5 text-xs text-gray-500 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-black uppercase tracking-wider">{t('contactPage.firstName')}</label>
                  </div>
                  <div className="relative group">
                    <input
                      type="text"
                      id="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder={t('contactPage.lastName')}
                      className="w-full bg-transparent border-b border-gray-300 py-3 text-sm font-light focus:outline-none focus:border-black transition-colors peer placeholder-transparent"
                      required
                    />
                    <label htmlFor="lastName" className="absolute left-0 -top-3.5 text-xs text-gray-500 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-black uppercase tracking-wider">{t('contactPage.lastName')}</label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative group">
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t('contactPage.email')}
                      className="w-full bg-transparent border-b border-gray-300 py-3 text-sm font-light focus:outline-none focus:border-black transition-colors peer placeholder-transparent"
                      required
                    />
                    <label htmlFor="email" className="absolute left-0 -top-3.5 text-xs text-gray-500 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-black uppercase tracking-wider">{t('contactPage.email')}</label>
                  </div>
                  <div className="relative group">
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={t('contactPage.phone')}
                      className="w-full bg-transparent border-b border-gray-300 py-3 text-sm font-light focus:outline-none focus:border-black transition-colors peer placeholder-transparent"
                      required
                    />
                    <label htmlFor="phone" className="absolute left-0 -top-3.5 text-xs text-gray-500 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-black uppercase tracking-wider">{t('contactPage.phone')}</label>
                  </div>
                </div>

                <div className="relative group">
                  <select
                    id="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-gray-300 py-3 text-sm font-light focus:outline-none focus:border-black transition-colors appearance-none uppercase tracking-wider text-gray-700"
                    required
                  >
                    <option value="" disabled>{t('contactPage.inquiryType')}</option>
                    <option value="sales">{t('contactPage.inquiryOptions.sales')}</option>
                    <option value="customer_service">{t('contactPage.inquiryOptions.customerService')}</option>
                    <option value="careers">{t('contactPage.inquiryOptions.careers')}</option>
                    <option value="media">{t('contactPage.inquiryOptions.media')}</option>
                    <option value="other">{t('contactPage.inquiryOptions.other')}</option>
                  </select>
                </div>

                <div className="relative group pt-4">
                  <textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t('contactPage.message')}
                    className="w-full bg-transparent border-b border-gray-300 py-3 text-sm font-light focus:outline-none focus:border-black transition-colors peer placeholder-transparent resize-none"
                  ></textarea>
                  <label htmlFor="message" className="absolute left-0 top-0 text-xs text-gray-500 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-7 peer-focus:top-0 peer-focus:text-xs peer-focus:text-black uppercase tracking-wider">{t('contactPage.message')}</label>
                </div>

                <div className="pt-6 space-y-4">
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="group flex items-center justify-center space-x-3 w-full md:w-auto px-12 py-4 bg-black text-white hover:bg-gray-900 transition-colors uppercase tracking-widest text-sm font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <span>{status === 'loading' ? t('newsPage.loading') : t('contactPage.submit')}</span>
                    {status === 'loading' ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    )}
                  </button>

                  {status === 'success' && (
                    <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-4 rounded-lg">
                      <CheckCircle2 size={20} />
                      <span className="text-sm font-medium">{t('contactPage.successMessage')}</span>
                    </div>
                  )}

                  {status === 'error' && (
                    <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-lg">
                      <AlertCircle size={20} />
                      <span className="text-sm font-medium">{t('contactPage.errorMessage')}</span>
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Contact Information */}
            <div className="lg:pl-12 lg:border-l border-gray-200 flex flex-col space-y-12">

              <div>
                <h3 className="text-lg font-[Cinzel] font-semibold text-gray-900 mb-6">{t('contactPage.contactInfo')}</h3>
                <div className="space-y-6 text-sm font-light text-gray-600">
                  {(contactData?.address || !loadingContact) && contactData?.address && (
                    <a 
                      href={contactData?.map_link || "#"} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-start space-x-4 group cursor-pointer"
                    >
                      <MapPin className="text-yellow-600 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" size={20} />
                      <p className="leading-relaxed group-hover:text-black transition-colors">
                        {contactData.address}
                      </p>
                    </a>
                  )}
                  {(contactData?.phone || !loadingContact) && contactData?.phone && (
                    <a 
                      href={`tel:${contactData.phone.replace(/[^0-9+]/g, '')}`} 
                      className="flex items-center space-x-4 group cursor-pointer"
                    >
                      <Phone className="text-yellow-600 flex-shrink-0 group-hover:scale-110 transition-transform" size={20} />
                      <p className="group-hover:text-black transition-colors">{contactData.phone}</p>
                    </a>
                  )}
                  {(contactData?.email || !loadingContact) && contactData?.email && (
                    <a 
                      href={`mailto:${contactData.email}`}
                      className="flex items-center space-x-4 group cursor-pointer"
                    >
                      <Mail className="text-yellow-600 flex-shrink-0 group-hover:scale-110 transition-transform" size={20} />
                      <p className="group-hover:text-black transition-colors">{contactData.email}</p>
                    </a>
                  )}
                </div>
              </div>

              <div className="w-16 h-px bg-gray-200"></div>

              <div>
                <h3 className="text-lg font-[Cinzel] font-semibold text-gray-900 mb-6">{t('contactPage.ourLocation')}</h3>
                <div className="w-full h-80 lg:h-96 rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                  {contactData?.map_iframe ? (
                    <iframe
                      src={
                        contactData.map_iframe.includes('<iframe') 
                          ? contactData.map_iframe.match(/src="([^"]+)"/)?.[1] || "" 
                          : contactData.map_iframe
                      }
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  ) : (
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2981.753926603933!2d41.632472976555405!3d41.639450071268996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x406787002f332c1b%3A0xa8fa69a453217b4c!2sWell%20Home!5e0!3m2!1sen!2sge!4v1775465782953!5m2!1sen!2sge"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
