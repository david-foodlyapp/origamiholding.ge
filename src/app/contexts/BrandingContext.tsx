import React, { createContext, useContext, useState, useEffect } from 'react';
import { CONFIG } from '../config';

interface BrandingData {
  logo_url: string | null;
  logo_en_url: string | null;
  logo_ka_url: string | null;
  logo_dark_url: string | null;
  logo_dark_en_url: string | null;
  logo_dark_ka_url: string | null;
  favicon_url: string | null;
}

interface BrandingContextType {
  branding: BrandingData | null;
  loading: boolean;
  error: Error | null;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export const BrandingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [branding, setBranding] = useState<BrandingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/settings/branding`);
        const result = await response.json();
        if (result.data) {
          setBranding(result.data);
          
          // Update favicon dynamically
          if (result.data.favicon_url) {
            const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
            link.type = 'image/x-icon';
            link.rel = 'shortcut icon';
            link.href = result.data.favicon_url;
            document.getElementsByTagName('head')[0].appendChild(link);
          }
        }
      } catch (err) {
        console.error("Error fetching branding:", err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchBranding();
  }, []);

  return (
    <BrandingContext.Provider value={{ branding, loading, error }}>
      {children}
    </BrandingContext.Provider>
  );
};

export const useBranding = () => {
  const context = useContext(BrandingContext);
  if (context === undefined) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
};
