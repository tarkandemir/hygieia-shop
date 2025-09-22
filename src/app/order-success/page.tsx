'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { CheckCircle, Phone, Mail } from 'lucide-react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const now = new Date();
    setCurrentTime(now.toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <CheckCircle size={48} className="text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Siparişiniz Alındı!
            </h1>
            <p className="text-lg text-gray-600">
              Teşekkür ederiz! Siparişiniz başarıyla oluşturuldu.
            </p>
          </div>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-lg p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Sipariş Numarası
                </h3>
                <p className="text-lg font-semibold text-[#000069]">
                  {orderNumber || 'SP24091800001'}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Sipariş Tarihi
                </h3>
                <p className="text-lg font-semibold text-gray-900">
                  {currentTime}
                </p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Sonraki Adımlar
            </h2>
            
            <div className="space-y-4 text-left">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#000069] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Sipariş Onayı</h4>
                  <p className="text-gray-600 text-sm">
                    Satış temsilcimiz sizinle iletişime geçerek siparişinizi onaylayacak.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#000069] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Hazırlık</h4>
                  <p className="text-gray-600 text-sm">
                    Siparişiniz hazırlanarak kargoya verilecek.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#000069] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Teslimat</h4>
                  <p className="text-gray-600 text-sm">
                    Kargo takip numaranız size bildirilecek ve siparişiniz adresinize ulaştırılacak.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-[#000069] text-white rounded-lg p-8 mb-8">
            <h2 className="text-xl font-semibold mb-6">
              Sorularınız İçin Bize Ulaşın
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-[#6AF0D2] text-[#000069] rounded-full mb-3">
                  <Phone size={24} />
                </div>
                <h4 className="font-semibold mb-2">Telefon</h4>
                <a href="tel:+902121234567" className="text-[#6AF0D2] hover:underline">
                  +90 (212) 123 45 67
                </a>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-[#6AF0D2] text-[#000069] rounded-full mb-3">
                  <Mail size={24} />
                </div>
                <h4 className="font-semibold mb-2">E-posta</h4>
                <a href="mailto:info@hygieiatr.com" className="text-[#6AF0D2] hover:underline">
                  info@hygieiatr.com
                </a>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-3 bg-[#000069] text-white rounded-lg font-semibold hover:bg-[#000080] transition-colors"
            >
              Alışverişe Devam Et
            </Link>
            
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-3 border border-[#000069] text-[#000069] rounded-lg font-semibold hover:bg-[#000069] hover:text-white transition-colors"
            >
              Ana Sayfaya Dön
            </Link>
          </div>

          {/* Additional Information */}
          <div className="mt-12 text-sm text-gray-500">
            <p className="mb-2">
              Bu sipariş e-posta adresinize de gönderilmiştir.
            </p>
            <p>
              Sipariş numaranızı not alarak bizimle iletişime geçerken belirtiniz.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#000069] mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
