'use client';

import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  // Create structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Anasayfa",
        "item": process.env.NODE_ENV === 'production' 
          ? "https://hygieia.com.tr" 
          : "http://localhost:3000"
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item.label,
        "item": item.href ? (
          process.env.NODE_ENV === 'production' 
            ? `https://hygieia.com.tr${item.href}`
            : `http://localhost:3000${item.href}`
        ) : undefined
      }))
    ]
  };

  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      
      {/* Breadcrumb Navigation */}
      <nav 
        className="bg-white py-4" 
        aria-label="Breadcrumb"
        itemScope 
        itemType="https://schema.org/BreadcrumbList"
      >
        <div className="container mx-auto px-6">
          <ol className="flex items-center space-x-2 text-sm text-[#7E7E94]">
            {/* Home Link */}
            <li 
              itemProp="itemListElement" 
              itemScope 
              itemType="https://schema.org/ListItem"
            >
              <Link
                href="/"
                className="flex items-center hover:text-[#000069] transition-colors"
                itemProp="item"
                title="Anasayfa"
              >
                <span itemProp="name" className="sr-only">Anasayfa</span>
                <Home size={16} aria-label="Anasayfa" />
              </Link>
              <meta itemProp="position" content="1" />
            </li>
            
            {/* Breadcrumb Items */}
            {items.map((item, index) => (
              <li 
                key={index} 
                className="flex items-center space-x-2"
                itemProp="itemListElement" 
                itemScope 
                itemType="https://schema.org/ListItem"
              >
                <ChevronRight size={10} aria-hidden="true" />
                {item.href && index < items.length - 1 ? (
                  <Link
                    href={item.href}
                    className="hover:text-[#000069] transition-colors"
                    itemProp="item"
                    title={item.label}
                  >
                    <span itemProp="name">{item.label}</span>
                  </Link>
                ) : (
                  <span 
                    className={index === items.length - 1 ? 'text-[#000069] font-medium' : ''}
                    itemProp="name"
                    aria-current={index === items.length - 1 ? "page" : undefined}
                  >
                    {item.label}
                  </span>
                )}
                <meta itemProp="position" content={`${index + 2}`} />
              </li>
            ))}
          </ol>
        </div>
      </nav>
    </>
  );
}
