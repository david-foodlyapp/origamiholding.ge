import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface SEOProps {
  title?: string;
  description?: string;
}

export const SEO = ({ title, description }: SEOProps) => {
  const { t } = useTranslation();

  useEffect(() => {
    const baseTitle = "Origami Holding";
    // If no title is provided, use the default tagline
    const defaultTagline = "Development • Architecture • Hospitality";
    
    let fullTitle = "";
    if (title) {
      fullTitle = `${title} | ${baseTitle}`;
    } else {
      fullTitle = `${baseTitle} | ${defaultTagline}`;
    }
    
    document.title = fullTitle;

    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', description);
    }
  }, [title, description, t]);

  return null;
};
