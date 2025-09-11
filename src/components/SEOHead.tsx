import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
}

export const SEOHead = ({
  title = 'DevTools Hub - Essential Developer Tools',
  description = 'Free online developer tools including JSON formatter, UUID generator, Base64 encoder/decoder, URL encoder, and hash generators. Fast, secure, and works offline.',
  keywords = 'developer tools, json formatter, uuid generator, base64 encoder, url encoder, hash generator, password generator, qr code generator, free tools, online tools',
  canonical,
  ogImage = 'https://devtools.hemelo.fyi/android-chrome-512x512.png',
  ogType = 'website'
}: SEOHeadProps) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      metaDescription.setAttribute('content', description);
      document.head.appendChild(metaDescription);
    }

    // Update or create meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords);
    } else {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      metaKeywords.setAttribute('content', keywords);
      document.head.appendChild(metaKeywords);
    }

    // Update or create canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      if (canonicalLink) {
        canonicalLink.setAttribute('href', canonical);
      } else {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        canonicalLink.setAttribute('href', canonical);
        document.head.appendChild(canonicalLink);
      }
    }

    // Update or create Open Graph title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    } else {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      ogTitle.setAttribute('content', title);
      document.head.appendChild(ogTitle);
    }

    // Update or create Open Graph description
    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', description);
    } else {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      ogDescription.setAttribute('content', description);
      document.head.appendChild(ogDescription);
    }

    // Update or create Open Graph image
    let ogImageMeta = document.querySelector('meta[property="og:image"]');
    if (ogImageMeta) {
      ogImageMeta.setAttribute('content', ogImage);
    } else {
      ogImageMeta = document.createElement('meta');
      ogImageMeta.setAttribute('property', 'og:image');
      ogImageMeta.setAttribute('content', ogImage);
      document.head.appendChild(ogImageMeta);
    }

    // Update or create Open Graph type
    let ogTypeMeta = document.querySelector('meta[property="og:type"]');
    if (ogTypeMeta) {
      ogTypeMeta.setAttribute('content', ogType);
    } else {
      ogTypeMeta = document.createElement('meta');
      ogTypeMeta.setAttribute('property', 'og:type');
      ogTypeMeta.setAttribute('content', ogType);
      document.head.appendChild(ogTypeMeta);
    }

    // Update or create Open Graph URL
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', window.location.href);
    } else {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      ogUrl.setAttribute('content', window.location.href);
      document.head.appendChild(ogUrl);
    }

    // Update or create Twitter Card title
    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', title);
    } else {
      twitterTitle = document.createElement('meta');
      twitterTitle.setAttribute('name', 'twitter:title');
      twitterTitle.setAttribute('content', title);
      document.head.appendChild(twitterTitle);
    }

    // Update or create Twitter Card description
    let twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', description);
    } else {
      twitterDescription = document.createElement('meta');
      twitterDescription.setAttribute('name', 'twitter:description');
      twitterDescription.setAttribute('content', description);
      document.head.appendChild(twitterDescription);
    }

    // Update or create Twitter Card image
    let twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (twitterImage) {
      twitterImage.setAttribute('content', ogImage);
    } else {
      twitterImage = document.createElement('meta');
      twitterImage.setAttribute('name', 'twitter:image');
      twitterImage.setAttribute('content', ogImage);
      document.head.appendChild(twitterImage);
    }

    // Set Twitter Card type
    let twitterCard = document.querySelector('meta[name="twitter:card"]');
    if (!twitterCard) {
      twitterCard = document.createElement('meta');
      twitterCard.setAttribute('name', 'twitter:card');
      twitterCard.setAttribute('content', 'summary_large_image');
      document.head.appendChild(twitterCard);
    }
  }, [title, description, keywords, canonical, ogImage, ogType]);

  return null; // This component doesn't render anything
};

