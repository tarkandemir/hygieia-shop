'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Breadcrumb from '../../components/Breadcrumb';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../components/ToastContainer';
import { formatPriceSimple, getImageUrl } from '../../lib/utils';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, getItemCount } = useCart();
  const { showToast } = useToast();
  const [isClearing, setIsClearing] = useState(false);

  const breadcrumbItems = [
    { label: 'Anasayfa', href: '/' },
    { label: 'Sepetim' },
  ];

  const handleClearCart = async () => {
    setIsClearing(true);
    try {
      clearCart();
      showToast({
        type: 'success',
        title: 'Sepet temizlendi!',
        message: 'Tüm ürünler sepetinizden kaldırıldı.',
        duration: 3000
      });
    } finally {
      setIsClearing(false);
    }
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number, productName: string) => {
    const item = cart.items.find(item => item.product._id === productId);
    const oldQuantity = item?.quantity || 0;
    const maxStock = item?.product.stock || 0;
    
    // Check if trying to exceed stock
    if (newQuantity > maxStock) {
      showToast({
        type: 'error',
        title: 'Stok yetersiz!',
        message: `${productName} için maksimum ${maxStock} adet ekleyebilirsiniz.`,
        duration: 4000
      });
      return;
    }
    
    updateQuantity(productId, newQuantity);
    
    if (newQuantity > oldQuantity) {
      showToast({
        type: 'success',
        title: 'Miktar artırıldı!',
        message: `${productName} miktarı ${newQuantity} olarak güncellendi.`,
        duration: 2000
      });
    } else {
      showToast({
        type: 'info',
        title: 'Miktar azaltıldı!',
        message: `${productName} miktarı ${newQuantity} olarak güncellendi.`,
        duration: 2000
      });
    }
  };

  const handleRemoveFromCart = (productId: string, productName: string) => {
    removeFromCart(productId);
    showToast({
      type: 'warning',
      title: 'Ürün kaldırıldı!',
      message: `${productName} sepetinizden kaldırıldı.`,
      duration: 3000
    });
  };

  const itemCount = getItemCount();

  // Progress steps
  const steps = [
    { id: 'cart', label: 'Sepet', active: true, completed: false },
    { id: 'delivery', label: 'Teslimat', active: false, completed: false },
    { id: 'summary', label: 'Sipariş Özeti', active: false, completed: false },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header activeLink="cart" />
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
                    {index + 1}
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

        {cart.items.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                {/* Cart Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Sepet ({itemCount} ürün)
                  </h2>
                  <button
                    onClick={handleClearCart}
                    disabled={isClearing}
                    className="text-red-600 hover:text-red-700 font-medium text-sm disabled:opacity-50"
                  >
                    {isClearing ? 'Temizleniyor...' : 'Sepeti Boşalt'}
                  </button>
                </div>

                {/* Cart Items List */}
                <div className="space-y-6">
                  {cart.items.map((item) => (
                    <div key={item.product._id} className="flex items-center space-x-4 py-4 border-b border-gray-100 last:border-b-0">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <Image
                          src={getImageUrl(item.product.images[0])}
                          alt={item.product.name}
                          width={80}
                          height={80}
                          className="w-20 h-20 object-contain bg-gray-50 rounded"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-gray-500 mb-1">
                          Ürün Kodu: {item.product.sku}
                        </p>
                        <p className="text-xs text-gray-500 mb-2">
                          Stok: {item.product.stock} adet
                        </p>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1, item.product.name)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-sm font-medium min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1, item.product.name)}
                            disabled={item.quantity >= item.product.stock}
                            className="w-8 h-8 bg-[#6AF0D2] text-[#000069] rounded-full flex items-center justify-center hover:bg-[#5BE0C2] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Price and Remove */}
                      <div className="text-right">
                        <div className="space-y-2">
                          <div className="text-lg font-bold text-gray-900">
                            {formatPriceSimple(item.totalPrice)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatPriceSimple(item.unitPrice)} / adet
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveFromCart(item.product._id, item.product.name)}
                          className="mt-2 text-red-600 hover:text-red-700 p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Continue Shopping */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Link
                    href="/products"
                    className="inline-flex items-center space-x-2 text-[#000069] hover:text-[#000080] font-medium"
                  >
                    <ArrowLeft size={16} />
                    <span>Alışverişe Devam Et</span>
                  </Link>
                </div>
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

                {cart.shippingCost === 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
                    <p className="text-sm text-green-800">
                      🎉 Ücretsiz kargo kazandınız!
                    </p>
                  </div>
                )}

                {cart.subtotal < 500 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                    <p className="text-sm text-blue-800">
                      {formatPriceSimple(500 - cart.subtotal)} daha ekleyin, ücretsiz kargo kazanın!
                    </p>
                  </div>
                )}

                <Link
                  href="/checkout"
                  className="w-full bg-[#000069] text-white py-3 rounded-lg font-semibold hover:bg-[#000080] transition-colors flex items-center justify-center"
                >
                  Teslimat Bilgilerine Devam Et
                </Link>

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    Sorularınız için{' '}
                    <a href="tel:+902121234567" className="text-[#000069] hover:underline">
                      bizi arayın
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty Cart */
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={40} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Sepetiniz boş
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Henüz sepetinizde ürün bulunmuyor. Alışverişe başlamak için ürünlerimizi inceleyin.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center space-x-2 bg-[#000069] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#000080] transition-colors"
            >
              <ShoppingBag size={20} />
              <span>Alışverişe Başla</span>
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}