'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IProduct } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ToastContainer';
import { useLoading } from '@/contexts/LoadingContext';
import { formatPriceSimple, getImageUrl, generateProductSlug } from '@/lib/utils';
import { Minus, Plus, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { startLoading } = useLoading();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleProductClick = () => {
    startLoading();
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      // Check stock availability
      if (quantity > product.stock) {
        showToast({
          type: 'error',
          title: 'Stok yetersiz!',
          message: `Bu ürün için maksimum ${product.stock} adet ekleyebilirsiniz.`,
          duration: 4000
        });
        return;
      }

      addToCart(product, quantity);
      
      // Show success toast
      showToast({
        type: 'success',
        title: 'Ürün sepete eklendi!',
        message: `${quantity} adet ${product.name} sepetinize eklendi.`,
        duration: 3000
      });
      
      // Reset quantity after adding
      setQuantity(1);
    } finally {
      setIsAdding(false);
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, product.stock));
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1));
  };


  const productUrl = `/products/${product._id}/${generateProductSlug(product.name)}`;

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      {/* Product Image */}
      <Link href={productUrl} onClick={handleProductClick} className="block">
        <div className="relative w-full h-48 bg-gray-50">
          <Image
            src={getImageUrl(product.images[0])}
            alt={product.name}
            fill
            className="object-contain p-4"
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-3 space-y-3">
        {/* Title */}
        <Link href={productUrl} onClick={handleProductClick}>
          <h3 className="text-sm font-semibold text-gray-900 hover:text-[#000069] transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-gray-900">
            {formatPriceSimple(product.retailPrice)}
          </span>
        </div>

        {/* Add to Cart Section */}
        <div className="flex items-center justify-between space-x-3">
          {/* Quantity Selector */}
          <div className="flex items-center space-x-3 bg-gray-50 rounded">
            <button
              onClick={decrementQuantity}
              disabled={quantity <= 1}
              className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="text-sm font-medium min-w-[20px] text-center">
              {quantity}
            </span>
            <button
              onClick={incrementQuantity}
              disabled={quantity >= product.stock}
              className="w-9 h-9 bg-[#6AF0D2] text-[#000069] rounded-full flex items-center justify-center hover:bg-[#5BE0C2] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isAdding || product.stock === 0}
            className="w-12 h-12 bg-white text-[#6AF0D2] border border-gray-200 rounded-3xl flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            title={isAdding ? 'Ekleniyor...' : 'Sepete Ekle'}
          >
            <ShoppingCart size={18} className="text-[#6AF0D2]" />
          </button>
        </div>

        {/* Stock Status */}
        {product.stock <= product.minStock && product.stock > 0 && (
          <p className="text-xs text-orange-600">
            Son {product.stock} adet!
          </p>
        )}
        {product.stock === 0 && (
          <p className="text-xs text-red-600">Stokta yok</p>
        )}
      </div>
    </div>
  );
}
