'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import { useCart } from '@/contexts/CartContext';
import { formatPriceSimple } from '@/lib/utils';
import { ICustomer, IAddress } from '@/types';
import { ArrowLeft, Phone } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const [customer, setCustomer] = useState<ICustomer>({
    name: '',
    surname: '',
    email: '',
    phone: '',
    company: '',
    taxId: '',
  });

  const [billingAddress, setBillingAddress] = useState<IAddress>({
    name: '',
    company: '',
    address1: '',
    address2: '',
    city: '',
    district: '',
    neighborhood: '',
    postalCode: '',
    country: 'Türkiye',
    phone: '',
  });

  const [shippingAddress, setShippingAddress] = useState<IAddress>({
    name: '',
    company: '',
    address1: '',
    address2: '',
    city: '',
    district: '',
    neighborhood: '',
    postalCode: '',
    country: 'Türkiye',
    phone: '',
  });

  const [sameAsbilling, setSameAsBinding] = useState(true);

  const breadcrumbItems = [
    { label: 'Sepetim', href: '/cart' },
    { label: 'Teslimat' },
  ];

  // Progress steps
  const steps = [
    { id: 'cart', label: 'Sepet', active: false, completed: true },
    { id: 'delivery', label: 'Teslimat', active: true, completed: false },
    { id: 'summary', label: 'Sipariş Özeti', active: false, completed: false },
  ];

  // Validation functions
  const validateTCKN = (tckn: string): boolean => {
    if (!/^\d{11}$/.test(tckn)) return false;
    if (tckn[0] === '0') return false;
    
    const digits = tckn.split('').map(Number);
    const sum1 = (digits[0] + digits[2] + digits[4] + digits[6] + digits[8]) * 7;
    const sum2 = digits[1] + digits[3] + digits[5] + digits[7] + digits[9];
    const checksum1 = (sum1 - sum2) % 10;
    const checksum2 = (digits.slice(0, 10).reduce((a, b) => a + b, 0)) % 10;
    
    return checksum1 === digits[9] && checksum2 === digits[10];
  };

  const validateVKN = (vkn: string): boolean => {
    if (!/^\d{10}$/.test(vkn)) return false;
    
    const digits = vkn.split('').map(Number);
    const weights = [9, 8, 7, 6, 5, 4, 3, 2, 1];
    let sum = 0;
    
    for (let i = 0; i < 9; i++) {
      sum += digits[i] * weights[i];
    }
    
    const remainder = sum % 11;
    const checkDigit = remainder < 2 ? remainder : 11 - remainder;
    
    return checkDigit === digits[9];
  };

  const validatePhone = (phone: string): boolean => {
    // Türkiye telefon numarası formatları: +905xxxxxxxxx, 05xxxxxxxxx, 5xxxxxxxxx
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return /^(\+90|0)?5\d{9}$/.test(cleanPhone);
  };

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePostalCode = (postalCode: string): boolean => {
    return /^\d{5}$/.test(postalCode);
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    // İsim validasyonu
    if (!customer.name.trim()) {
      newErrors.name = 'Ad alanı zorunludur';
    } else if (customer.name.trim().length < 2) {
      newErrors.name = 'Ad en az 2 karakter olmalıdır';
    } else if (!/^[a-zA-ZçÇğĞıİöÖşŞüÜ\s]+$/.test(customer.name)) {
      newErrors.name = 'Ad sadece harf içerebilir';
    }

    // Soyisim validasyonu
    if (!customer.surname.trim()) {
      newErrors.surname = 'Soyad alanı zorunludur';
    } else if (customer.surname.trim().length < 2) {
      newErrors.surname = 'Soyad en az 2 karakter olmalıdır';
    } else if (!/^[a-zA-ZçÇğĞıİöÖşŞüÜ\s]+$/.test(customer.surname)) {
      newErrors.surname = 'Soyad sadece harf içerebilir';
    }

    // E-posta validasyonu
    if (!customer.email.trim()) {
      newErrors.email = 'E-posta alanı zorunludur';
    } else if (!validateEmail(customer.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi giriniz';
    }

    // Telefon validasyonu
    if (!customer.phone.trim()) {
      newErrors.phone = 'Telefon alanı zorunludur';
    } else if (!validatePhone(customer.phone)) {
      newErrors.phone = 'Geçerli bir Türkiye telefon numarası giriniz (örn: 05xxxxxxxxx)';
    }

    // Vergi No/TC Kimlik validasyonu (opsiyonel ama girilmişse geçerli olmalı)
    if (customer.taxId && customer.taxId.trim()) {
      if (customer.taxId.length === 11) {
        if (!validateTCKN(customer.taxId)) {
          newErrors.taxId = 'Geçerli bir TC Kimlik No giriniz';
        }
      } else if (customer.taxId.length === 10) {
        if (!validateVKN(customer.taxId)) {
          newErrors.taxId = 'Geçerli bir Vergi Kimlik No giriniz';
        }
      } else {
        newErrors.taxId = 'TC Kimlik No (11 haneli) veya Vergi Kimlik No (10 haneli) giriniz';
      }
    }

    // Şirket adı validasyonu (opsiyonel)
    if (customer.company && customer.company.trim().length < 2) {
      newErrors.company = 'Firma adı en az 2 karakter olmalıdır';
    }

    // Fatura Adresi validasyonu
    if (!billingAddress.city.trim()) {
      newErrors.billingCity = 'Fatura adresi il alanı zorunludur';
    } else if (!/^[a-zA-ZçÇğĞıİöÖşŞüÜ\s]+$/.test(billingAddress.city)) {
      newErrors.billingCity = 'İl adı sadece harf içerebilir';
    }

    if (!billingAddress.district.trim()) {
      newErrors.billingDistrict = 'Fatura adresi ilçe alanı zorunludur';
    } else if (!/^[a-zA-ZçÇğĞıİöÖşŞüÜ\s]+$/.test(billingAddress.district)) {
      newErrors.billingDistrict = 'İlçe adı sadece harf içerebilir';
    }

    if (!billingAddress.neighborhood.trim()) {
      newErrors.billingNeighborhood = 'Fatura adresi mahalle alanı zorunludur';
    } else if (billingAddress.neighborhood.trim().length < 2) {
      newErrors.billingNeighborhood = 'Mahalle en az 2 karakter olmalıdır';
    }

    if (!billingAddress.address1.trim()) {
      newErrors.billingAddress1 = 'Fatura adresi tam adres alanı zorunludur';
    } else if (billingAddress.address1.trim().length < 10) {
      newErrors.billingAddress1 = 'Tam adres en az 10 karakter olmalıdır';
    }

    if (billingAddress.postalCode && billingAddress.postalCode.trim() && !validatePostalCode(billingAddress.postalCode)) {
      newErrors.billingPostalCode = 'Posta kodu 5 haneli olmalıdır (örn: 34710)';
    }

    // Teslimat Adresi validasyonu (sadece farklı ise)
    if (!sameAsbilling) {
      if (!shippingAddress.city.trim()) {
        newErrors.shippingCity = 'Teslimat adresi il alanı zorunludur';
      } else if (!/^[a-zA-ZçÇğĞıİöÖşŞüÜ\s]+$/.test(shippingAddress.city)) {
        newErrors.shippingCity = 'İl adı sadece harf içerebilir';
      }

      if (!shippingAddress.district.trim()) {
        newErrors.shippingDistrict = 'Teslimat adresi ilçe alanı zorunludur';
      } else if (!/^[a-zA-ZçÇğĞıİöÖşŞüÜ\s]+$/.test(shippingAddress.district)) {
        newErrors.shippingDistrict = 'İlçe adı sadece harf içerebilir';
      }

      if (!shippingAddress.neighborhood.trim()) {
        newErrors.shippingNeighborhood = 'Teslimat adresi mahalle alanı zorunludur';
      } else if (shippingAddress.neighborhood.trim().length < 2) {
        newErrors.shippingNeighborhood = 'Mahalle en az 2 karakter olmalıdır';
      }

      if (!shippingAddress.address1.trim()) {
        newErrors.shippingAddress1 = 'Teslimat adresi tam adres alanı zorunludur';
      } else if (shippingAddress.address1.trim().length < 10) {
        newErrors.shippingAddress1 = 'Tam adres en az 10 karakter olmalıdır';
      }

      if (shippingAddress.postalCode && shippingAddress.postalCode.trim() && !validatePostalCode(shippingAddress.postalCode)) {
        newErrors.shippingPostalCode = 'Posta kodu 5 haneli olmalıdır (örn: 34710)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validasyonu
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare order data
      const orderData = {
        customer: {
          name: customer.name,
          surname: customer.surname,
          email: customer.email,
          phone: customer.phone,
          company: customer.company,
          taxId: customer.taxId,
        },
        billingAddress: {
          address1: billingAddress.address1,
          address2: billingAddress.address2,
          city: billingAddress.city,
          district: billingAddress.district,
          neighborhood: billingAddress.neighborhood,
          postalCode: billingAddress.postalCode,
          country: billingAddress.country,
        },
        shippingAddress: sameAsbilling ? {
          address1: billingAddress.address1,
          address2: billingAddress.address2,
          city: billingAddress.city,
          district: billingAddress.district,
          neighborhood: billingAddress.neighborhood,
          postalCode: billingAddress.postalCode,
          country: billingAddress.country,
        } : {
          address1: shippingAddress.address1,
          address2: shippingAddress.address2,
          city: shippingAddress.city,
          district: shippingAddress.district,
          neighborhood: shippingAddress.neighborhood,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country,
        },
        items: cart.items.map(item => ({
          productId: item.product._id,
          quantity: item.quantity,
        })),
        shippingCost: cart.shippingCost,
        notes: 'Website siparişi',
      };

      // Submit order to API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = result.error || 'Sipariş oluşturulamadı';
        const errorDetails = result.details ? ` (${result.details})` : '';
        throw new Error(errorMessage + errorDetails);
      }

      // Clear cart and redirect to success page
      clearCart();
      router.push(`/order-success?orderNumber=${result.orderNumber}`);
    } catch (error) {
      console.error('Order submission failed:', error);
      alert(error instanceof Error ? error.message : 'Sipariş oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Sepetiniz boş
          </h2>
          <p className="text-gray-600 mb-8">
            Checkout yapabilmek için sepetinizde ürün bulunması gerekiyor.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center space-x-2 bg-[#000069] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#000080] transition-colors"
          >
            <span>Alışverişe Başla</span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Breadcrumb items={breadcrumbItems} />

      <div className="container mx-auto px-6 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step.active
                        ? 'bg-[#6AF0D2] text-[#000069]'
                        : step.completed
                        ? 'bg-[#000069] text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step.completed ? '✓' : index + 1}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium ${
                      step.active ? 'text-[#000069]' : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-16 h-0.5 bg-gray-200 mx-4 mt-5"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Delivery Information */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  İletişim Bilgileri
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ad *
                    </label>
                    <input
                      type="text"
                      required
                      value={customer.name}
                      onChange={(e) => {
                        setCustomer({ ...customer, name: e.target.value });
                        if (errors.name) {
                          setErrors({ ...errors, name: '' });
                        }
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                        errors.name 
                          ? 'border-red-300 focus:ring-red-200' 
                          : 'border-gray-200 focus:ring-[#6AF0D2]'
                      }`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Soyad *
                    </label>
                    <input
                      type="text"
                      required
                      value={customer.surname}
                      onChange={(e) => {
                        setCustomer({ ...customer, surname: e.target.value });
                        if (errors.surname) {
                          setErrors({ ...errors, surname: '' });
                        }
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                        errors.surname 
                          ? 'border-red-300 focus:ring-red-200' 
                          : 'border-gray-200 focus:ring-[#6AF0D2]'
                      }`}
                    />
                    {errors.surname && (
                      <p className="mt-1 text-sm text-red-600">{errors.surname}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Firma Adı
                    </label>
                    <input
                      type="text"
                      value={customer.company}
                      onChange={(e) => {
                        setCustomer({ ...customer, company: e.target.value });
                        if (errors.company) {
                          setErrors({ ...errors, company: '' });
                        }
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                        errors.company 
                          ? 'border-red-300 focus:ring-red-200' 
                          : 'border-gray-200 focus:ring-[#6AF0D2]'
                      }`}
                    />
                    {errors.company && (
                      <p className="mt-1 text-sm text-red-600">{errors.company}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      TC Kimlik No / Vergi No
                    </label>
                    <input
                      type="text"
                      value={customer.taxId}
                      onChange={(e) => {
                        // Sadece rakam girişine izin ver
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        setCustomer({ ...customer, taxId: value });
                        if (errors.taxId) {
                          setErrors({ ...errors, taxId: '' });
                        }
                      }}
                      placeholder="TC Kimlik No (11 haneli) veya Vergi No (10 haneli)"
                      maxLength={11}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                        errors.taxId 
                          ? 'border-red-300 focus:ring-red-200' 
                          : 'border-gray-200 focus:ring-[#6AF0D2]'
                      }`}
                    />
                    {errors.taxId && (
                      <p className="mt-1 text-sm text-red-600">{errors.taxId}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefon *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customer.phone}
                      onChange={(e) => {
                        setCustomer({ ...customer, phone: e.target.value });
                        if (errors.phone) {
                          setErrors({ ...errors, phone: '' });
                        }
                      }}
                      placeholder="05xxxxxxxxx"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                        errors.phone 
                          ? 'border-red-300 focus:ring-red-200' 
                          : 'border-gray-200 focus:ring-[#6AF0D2]'
                      }`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-posta *
                    </label>
                    <input
                      type="email"
                      required
                      value={customer.email}
                      onChange={(e) => {
                        setCustomer({ ...customer, email: e.target.value });
                        if (errors.email) {
                          setErrors({ ...errors, email: '' });
                        }
                      }}
                      placeholder="ornek@email.com"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                        errors.email 
                          ? 'border-red-300 focus:ring-red-200' 
                          : 'border-gray-200 focus:ring-[#6AF0D2]'
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Billing Address Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Fatura Adresi
                </h3>
                
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        İl *
                      </label>
                      <input
                        type="text"
                        required
                        value={billingAddress.city}
                        onChange={(e) => {
                          setBillingAddress({ ...billingAddress, city: e.target.value });
                          if (errors.billingCity) {
                            setErrors({ ...errors, billingCity: '' });
                          }
                        }}
                        placeholder="İstanbul"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                          errors.billingCity 
                            ? 'border-red-300 focus:ring-red-200' 
                            : 'border-gray-200 focus:ring-[#6AF0D2]'
                        }`}
                      />
                      {errors.billingCity && (
                        <p className="mt-1 text-sm text-red-600">{errors.billingCity}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        İlçe *
                      </label>
                      <input
                        type="text"
                        required
                        value={billingAddress.district}
                        onChange={(e) => {
                          setBillingAddress({ ...billingAddress, district: e.target.value });
                          if (errors.billingDistrict) {
                            setErrors({ ...errors, billingDistrict: '' });
                          }
                        }}
                        placeholder="Kadıköy"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                          errors.billingDistrict 
                            ? 'border-red-300 focus:ring-red-200' 
                            : 'border-gray-200 focus:ring-[#6AF0D2]'
                        }`}
                      />
                      {errors.billingDistrict && (
                        <p className="mt-1 text-sm text-red-600">{errors.billingDistrict}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mahalle *
                    </label>
                    <input
                      type="text"
                      required
                      value={billingAddress.neighborhood}
                      onChange={(e) => {
                        setBillingAddress({ ...billingAddress, neighborhood: e.target.value });
                        if (errors.billingNeighborhood) {
                          setErrors({ ...errors, billingNeighborhood: '' });
                        }
                      }}
                      placeholder="Moda Mahallesi"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                        errors.billingNeighborhood 
                          ? 'border-red-300 focus:ring-red-200' 
                          : 'border-gray-200 focus:ring-[#6AF0D2]'
                      }`}
                    />
                    {errors.billingNeighborhood && (
                      <p className="mt-1 text-sm text-red-600">{errors.billingNeighborhood}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tam Adres *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={billingAddress.address1}
                      onChange={(e) => {
                        setBillingAddress({ ...billingAddress, address1: e.target.value });
                        if (errors.billingAddress1) {
                          setErrors({ ...errors, billingAddress1: '' });
                        }
                      }}
                      placeholder="Sokak adı, bina numarası, daire numarası vb."
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                        errors.billingAddress1 
                          ? 'border-red-300 focus:ring-red-200' 
                          : 'border-gray-200 focus:ring-[#6AF0D2]'
                      }`}
                    />
                    {errors.billingAddress1 && (
                      <p className="mt-1 text-sm text-red-600">{errors.billingAddress1}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Posta Kodu
                    </label>
                    <input
                      type="text"
                      value={billingAddress.postalCode}
                      onChange={(e) => {
                        // Sadece rakam girişine izin ver
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        setBillingAddress({ ...billingAddress, postalCode: value });
                        if (errors.billingPostalCode) {
                          setErrors({ ...errors, billingPostalCode: '' });
                        }
                      }}
                      placeholder="34710"
                      maxLength={5}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                        errors.billingPostalCode 
                          ? 'border-red-300 focus:ring-red-200' 
                          : 'border-gray-200 focus:ring-[#6AF0D2]'
                      }`}
                    />
                    {errors.billingPostalCode && (
                      <p className="mt-1 text-sm text-red-600">{errors.billingPostalCode}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Address Option */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <input
                    type="checkbox"
                    id="sameAsBilling"
                    checked={sameAsbilling}
                    onChange={(e) => setSameAsBinding(e.target.checked)}
                    className="w-4 h-4 text-[#6AF0D2] border-gray-300 rounded focus:ring-[#6AF0D2] focus:ring-2"
                  />
                  <label htmlFor="sameAsBilling" className="text-sm font-medium text-gray-700">
                    Teslimat adresi fatura adresi ile aynı
                  </label>
                </div>

                {!sameAsbilling && (
                  <>
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                      Teslimat Adresi
                    </h3>
                    
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            İl *
                          </label>
                          <input
                            type="text"
                            required
                            value={shippingAddress.city}
                            onChange={(e) => {
                              setShippingAddress({ ...shippingAddress, city: e.target.value });
                              if (errors.shippingCity) {
                                setErrors({ ...errors, shippingCity: '' });
                              }
                            }}
                            placeholder="İstanbul"
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                              errors.shippingCity 
                                ? 'border-red-300 focus:ring-red-200' 
                                : 'border-gray-200 focus:ring-[#6AF0D2]'
                            }`}
                          />
                          {errors.shippingCity && (
                            <p className="mt-1 text-sm text-red-600">{errors.shippingCity}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            İlçe *
                          </label>
                          <input
                            type="text"
                            required
                            value={shippingAddress.district}
                            onChange={(e) => {
                              setShippingAddress({ ...shippingAddress, district: e.target.value });
                              if (errors.shippingDistrict) {
                                setErrors({ ...errors, shippingDistrict: '' });
                              }
                            }}
                            placeholder="Kadıköy"
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                              errors.shippingDistrict 
                                ? 'border-red-300 focus:ring-red-200' 
                                : 'border-gray-200 focus:ring-[#6AF0D2]'
                            }`}
                          />
                          {errors.shippingDistrict && (
                            <p className="mt-1 text-sm text-red-600">{errors.shippingDistrict}</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mahalle *
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingAddress.neighborhood}
                          onChange={(e) => {
                            setShippingAddress({ ...shippingAddress, neighborhood: e.target.value });
                            if (errors.shippingNeighborhood) {
                              setErrors({ ...errors, shippingNeighborhood: '' });
                            }
                          }}
                          placeholder="Moda Mahallesi"
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                            errors.shippingNeighborhood 
                              ? 'border-red-300 focus:ring-red-200' 
                              : 'border-gray-200 focus:ring-[#6AF0D2]'
                          }`}
                        />
                        {errors.shippingNeighborhood && (
                          <p className="mt-1 text-sm text-red-600">{errors.shippingNeighborhood}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tam Adres *
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={shippingAddress.address1}
                          onChange={(e) => {
                            setShippingAddress({ ...shippingAddress, address1: e.target.value });
                            if (errors.shippingAddress1) {
                              setErrors({ ...errors, shippingAddress1: '' });
                            }
                          }}
                          placeholder="Sokak adı, bina numarası, daire numarası vb."
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                            errors.shippingAddress1 
                              ? 'border-red-300 focus:ring-red-200' 
                              : 'border-gray-200 focus:ring-[#6AF0D2]'
                          }`}
                        />
                        {errors.shippingAddress1 && (
                          <p className="mt-1 text-sm text-red-600">{errors.shippingAddress1}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Posta Kodu
                        </label>
                        <input
                          type="text"
                          value={shippingAddress.postalCode}
                          onChange={(e) => {
                            // Sadece rakam girişine izin ver
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            setShippingAddress({ ...shippingAddress, postalCode: value });
                            if (errors.shippingPostalCode) {
                              setErrors({ ...errors, shippingPostalCode: '' });
                            }
                          }}
                          placeholder="34710"
                          maxLength={5}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                            errors.shippingPostalCode 
                              ? 'border-red-300 focus:ring-red-200' 
                              : 'border-gray-200 focus:ring-[#6AF0D2]'
                          }`}
                        />
                        {errors.shippingPostalCode && (
                          <p className="mt-1 text-sm text-red-600">{errors.shippingPostalCode}</p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Continue Shopping Link */}
              <div className="flex justify-between items-center">
                <a
                  href="/cart"
                  className="inline-flex items-center space-x-2 text-[#000069] hover:text-[#000080] font-medium"
                >
                  <ArrowLeft size={16} />
                  <span>Sepete Dön</span>
                </a>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Sipariş Özeti
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ara Toplam</span>
                    <span className="font-medium">
                      {formatPriceSimple(cart.subtotal)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Teslimat</span>
                    <span className="font-medium text-green-600">
                      {cart.shippingCost === 0 ? 'Ücretsiz' : formatPriceSimple(cart.shippingCost)}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Toplam</span>
                      <span className="text-[#000069]">
                        {formatPriceSimple(cart.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#000069] text-white py-3 rounded-lg font-semibold hover:bg-[#000080] disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-4"
                >
                  {isSubmitting ? 'Siparişiniz Oluşturuluyor...' : 'Siparişi Tamamla'}
                </button>

                <div className="text-center space-y-2">
                  <p className="text-xs text-gray-500">
                    Sorularınız için{' '}
                    <a href="tel:+902121234567" className="text-[#000069] hover:underline">
                      bizi arayın
                    </a>
                  </p>
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                    <button
                      type="button"
                      className="flex items-center space-x-1 text-[#000069] hover:underline"
                    >
                      <Phone size={12} />
                      <span>Bizi Arayın</span>
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      className="text-[#000069] hover:underline"
                    >
                      Bize Yazın
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}
