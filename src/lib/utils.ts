import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

export function formatPriceSimple(price: number): string {
  return new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price) + ' TL';
}

export function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  return `SIP${year}${month}${day}${random}`;
}

export function slugify(text: string): string {
  // Türkçe karakterleri İngilizce karşılıklarına çevir
  const turkishMap: { [key: string]: string } = {
    'ç': 'c', 'Ç': 'C',
    'ğ': 'g', 'Ğ': 'G', 
    'ı': 'i', 'I': 'I',
    'İ': 'i', 'i': 'i',
    'ö': 'o', 'Ö': 'O',
    'ş': 's', 'Ş': 'S',
    'ü': 'u', 'Ü': 'U'
  };

  return text
    .toString()
    .toLowerCase()
    .trim()
    // Türkçe karakterleri değiştir
    .replace(/[çÇğĞıİöÖşŞüÜ]/g, (match) => turkishMap[match] || match)
    // Diğer özel karakterleri kaldır
    .replace(/[^\w\s-]/g, '')
    // Boşlukları tire ile değiştir
    .replace(/\s+/g, '-')
    // Çoklu tireleri tek tire yap
    .replace(/-+/g, '-')
    // Başındaki ve sonundaki tireleri kaldır
    .replace(/^-+|-+$/g, '');
}

export function generateProductSlug(name: string): string {
  // Aynı slugify fonksiyonunu kullan
  return slugify(name);
}

export function getImageUrl(imagePath: string): string {
  if (!imagePath) return '/placeholder-product.svg';
  
  // If it's a base64 image, return it directly
  if (imagePath.startsWith('data:image')) {
    return imagePath;
  }
  
  // If it's a URL, return it directly
  if (imagePath.startsWith('http')) return imagePath;
  
  // If it already starts with /images/, return as is
  if (imagePath.startsWith('/images/')) return imagePath;
  
  // Otherwise, treat it as a path and add /images/ prefix
  return `/images/${imagePath}`;
}
