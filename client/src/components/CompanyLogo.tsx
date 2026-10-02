import React, { useState } from 'react';

interface CompanyLogoProps {
  name: string;
  slug?: string;
  logoUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

// Map company slugs/names to their official domain for Clearbit logo lookups
const COMPANY_DOMAINS: Record<string, string> = {
  amazon: 'amazon.com',
  google: 'google.com',
  microsoft: 'microsoft.com',
  apple: 'apple.com',
  meta: 'meta.com',
  adobe: 'adobe.com',
  uber: 'uber.com',
  tcs: 'tcs.com',
  infosys: 'infosys.com',
  accenture: 'accenture.com',
  deloitte: 'deloitte.com',
  ibm: 'ibm.com',
  oracle: 'oracle.com',
  salesforce: 'salesforce.com',
  zoho: 'zoho.com',
  cognizant: 'cognizant.com',
  atlassian: 'atlassian.com',
  flipkart: 'flipkart.com',
  cisco: 'cisco.com',
  intel: 'intel.com',
  wipro: 'wipro.com',
  capgemini: 'capgemini.com',
  hcl: 'hcltech.com',
  samsung: 'samsung.com',
  qualcomm: 'qualcomm.com',
  nvidia: 'nvidia.com',
  netflix: 'netflix.com',
  spotify: 'spotify.com',
  linkedin: 'linkedin.com',
  twitter: 'twitter.com',
  snap: 'snapchat.com',
  airbnb: 'airbnb.com',
  stripe: 'stripe.com',
  shopify: 'shopify.com',
  databricks: 'databricks.com',
  openai: 'openai.com',
  bytedance: 'bytedance.com',
  paytm: 'paytm.com',
  swiggy: 'swiggy.com',
  zomato: 'zomato.com',
  ola: 'olacabs.com',
  freshworks: 'freshworks.com',
};

// Brand colors for letter-avatar fallback
const BRAND_COLORS: Record<string, { bg: string; text: string }> = {
  amazon: { bg: '#131921', text: '#FF9900' },
  google: { bg: '#4285F4', text: '#FFFFFF' },
  microsoft: { bg: '#00A4EF', text: '#FFFFFF' },
  apple: { bg: '#000000', text: '#FFFFFF' },
  meta: { bg: '#0866FF', text: '#FFFFFF' },
  adobe: { bg: '#FA0F00', text: '#FFFFFF' },
  uber: { bg: '#000000', text: '#FFFFFF' },
  tcs: { bg: '#003366', text: '#00A3E0' },
  infosys: { bg: '#007CC3', text: '#FFFFFF' },
  accenture: { bg: '#A100FF', text: '#FFFFFF' },
  deloitte: { bg: '#000000', text: '#86BC25' },
  ibm: { bg: '#0530AD', text: '#FFFFFF' },
  oracle: { bg: '#C74634', text: '#FFFFFF' },
  salesforce: { bg: '#00A1E0', text: '#FFFFFF' },
  zoho: { bg: '#D42227', text: '#FFFFFF' },
  cognizant: { bg: '#0033A0', text: '#FFFFFF' },
  atlassian: { bg: '#0052CC', text: '#FFFFFF' },
  flipkart: { bg: '#2874F0', text: '#FFE500' },
  cisco: { bg: '#049FD9', text: '#FFFFFF' },
  intel: { bg: '#0068B5', text: '#FFFFFF' },
  wipro: { bg: '#341C68', text: '#FFFFFF' },
  nvidia: { bg: '#76B900', text: '#FFFFFF' },
  netflix: { bg: '#E50914', text: '#FFFFFF' },
  stripe: { bg: '#635BFF', text: '#FFFFFF' },
  airbnb: { bg: '#FF5A5F', text: '#FFFFFF' },
  openai: { bg: '#10A37F', text: '#FFFFFF' },
};

export const CompanyLogo: React.FC<CompanyLogoProps> = ({
  name,
  slug,
  logoUrl,
  size = 'md',
  className = ''
}) => {
  const [primaryError, setPrimaryError] = useState(false);
  const [secondaryError, setSecondaryError] = useState(false);

  const normalizedSlug = (slug || name || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  const sizeClasses = {
    sm: 'w-6 h-6 rounded-lg',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-14 h-14 rounded-2xl',
    xl: 'w-20 h-20 rounded-2xl'
  }[size];

  const imgSizeClasses = {
    sm: 'w-full h-full',
    md: 'w-full h-full',
    lg: 'w-full h-full',
    xl: 'w-full h-full'
  }[size];

  const letterSizes = {
    sm: 'text-[9px]',
    md: 'text-xs',
    lg: 'text-lg',
    xl: 'text-2xl'
  }[size];

  // Determine domain
  const domain = COMPANY_DOMAINS[normalizedSlug] || `${normalizedSlug}.com`;

  // Primary: Clearbit Logo API (512px, crisp, free, no auth needed)
  const clearbitUrl = `https://logo.clearbit.com/${domain}?size=128`;
  
  // Secondary fallback: Google S2 favicon (higher res)
  const googleFaviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

  // Get brand colors for letter fallback
  const brandColor = BRAND_COLORS[normalizedSlug];
  const initials = name ? name.slice(0, 2).toUpperCase() : 'CO';

  // If a direct logoUrl was provided by the backend, try it first
  const shouldTryBackendUrl = logoUrl && !logoUrl.includes('undefined');

  return (
    <div
      className={`${sizeClasses} overflow-hidden border border-white/[0.12] flex items-center justify-center flex-shrink-0 shadow-md bg-white ${className}`}
    >
      {!primaryError ? (
        <img
          src={clearbitUrl}
          alt={`${name} logo`}
          className={`${imgSizeClasses} object-contain p-1`}
          onError={() => setPrimaryError(true)}
          loading="lazy"
        />
      ) : !secondaryError ? (
        <img
          src={googleFaviconUrl}
          alt={`${name} logo`}
          className={`${imgSizeClasses} object-contain p-1.5`}
          onError={() => setSecondaryError(true)}
          loading="lazy"
        />
      ) : (
        // Letter avatar fallback with brand color
        <div
          className={`w-full h-full flex items-center justify-center font-extrabold ${letterSizes}`}
          style={{
            backgroundColor: brandColor?.bg || '#1e293b',
            color: brandColor?.text || '#94a3b8',
          }}
        >
          {initials}
        </div>
      )}
    </div>
  );
};
