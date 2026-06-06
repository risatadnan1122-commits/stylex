import React, { useEffect } from 'react';

interface HelmetProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  siteName?: string;
}

export default function Helmet({
  title = "Style X | Luxury Collective & Premium Garments",
  description = "Experience the epitome of premium craftsmanship and high-end fashion. Hand-curated luxury garments designed for the modern connoisseur.",
  keywords = "luxury fashion, premium streetwear, style x, stylish clothing, designer garments, high-end couture",
  image = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=80",
  url = window.location.href,
  siteName = "STYLE X"
}: HelmetProps) {
  // Update document title dynamically in traditional way as a secondary fallback
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

  // Inject luxury Schema.org JSON-LD structured data into the head for deep SEO compliance
  useEffect(() => {
    const existingScript = document.getElementById('luxury-json-ld-seo');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = 'luxury-json-ld-seo';
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Store",
      "name": siteName,
      "description": description,
      "image": image,
      "url": url,
      "priceRange": "$$$$",
      "category": "Luxury designer clothing and premium garments store",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Dhaka",
        "addressCountry": "Bangladesh"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${url}?search={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    });

    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById('luxury-json-ld-seo');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [title, description, image, url, siteName]);

  return (
    <>
      {/* Primary HTML Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Style X Luxury Group" />
      <meta name="robots" content="index, follow" />
      <meta name="theme-color" content="#000000" />

      {/* OpenGraph Protocol / Facebook Cards */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </>
  );
}
