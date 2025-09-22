'use client';

import { useState } from 'react';
import Image from 'next/image';
import { IProduct, ICategory } from '../../../../types';
import { useCart } from '../../../../contexts/CartContext';
import { useToast } from '../../../../components/ToastContainer';
import { formatPriceSimple, getImageUrl } from '../../../../lib/utils';
import ProductCard from '../../../../components/ProductCard';
import ImageZoom from '../../../../components/ImageZoom';
import { 
  Minus, 
  Plus, 
  ShoppingCart, 
  Truck, 
  ZoomIn, 
  Share2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface ProductDetailClientProps {
  product: IProduct;
  similarProducts: IProduct[];
  category: ICategory | null;
}

export default function ProductDetailClient({ 
  product, 
  similarProducts, 
  // category 
}: ProductDetailClientProps) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

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

  const handleZoomClick = () => {
    setIsZoomOpen(true);
  };

  const handleZoomClose = () => {
    setIsZoomOpen(false);
  };


  const images = product.images.length > 0 ? product.images.map(img => getImageUrl(img)) : ['/placeholder-product.svg'];

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Product Detail Section */}
      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        {/* Product Images */}
        <div className="space-y-4">
        {/* Main Image */}
        <div className="relative bg-gray-50 rounded-lg overflow-hidden cursor-zoom-in">
          <Image
            src={getImageUrl(images[selectedImageIndex])}
            alt={product.name}
            width={600}
            height={600}
            className="w-full h-96 lg:h-[600px] object-contain p-8"
            onClick={handleZoomClick}
          />
            
          {/* Zoom Button */}
          <button 
            onClick={handleZoomClick}
            className="absolute top-4 right-4 w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
            title="Fotoğrafı büyüt"
          >
            <ZoomIn size={16} />
          </button>

            {/* Share Button */}
            <button className="absolute bottom-4 left-4 w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
              <Share2 size={16} />
            </button>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 border border-gray-200 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setSelectedImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 border border-gray-200 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Images */}
          {images.length > 1 && (
            <div className="flex space-x-3">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                onDoubleClick={() => {
                  setSelectedImageIndex(index);
                  handleZoomClick();
                }}
                className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden ${
                  selectedImageIndex === index 
                    ? 'border-[#000069]' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                title="Çift tıkla: Büyüt"
              >
                <Image
                  src={getImageUrl(image)}
                  alt={`${product.name} ${index + 1}`}
                  width={80}
                  height={80}
                  className="w-full h-full object-contain p-1"
                />
              </button>
            ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Product Name and Code */}
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-[#000069] mb-2">
              {product.name}
            </h1>
            <p className="text-gray-600">
              Ürün Kodu: {product.sku}
            </p>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold text-[#000069]">
              {formatPriceSimple(product.retailPrice)}
            </span>
          </div>


          {/* Quantity and Add to Cart */}
          <div className="flex items-center space-x-4">
            {/* Quantity Selector */}
            <div className="flex items-center space-x-3">
              <button
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="text-lg font-medium min-w-[40px] text-center">
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
              className="flex-1 bg-[#000069] text-white px-6 py-3 rounded flex items-center justify-center space-x-2 hover:bg-[#000080] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ShoppingCart size={20} />
              <span className="font-semibold">
                {isAdding ? 'Ekleniyor...' : 'Sepete Ekle'}
              </span>
            </button>
          </div>

          {/* Delivery Info */}
          <div className="bg-gray-100 rounded p-3 flex items-center space-x-3">
            <Truck size={20} className="text-[#000069]" />
            <span className="text-sm text-[#000069]">
              3 İş Günü içinde teslim edilir
            </span>
          </div>


          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-[#000069]">Etiketler</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#E9FDF8] text-[#000069] border border-[#6AF0D2]/20"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Additional Information */}
          {product.description && (
            <div className="space-y-4">
              <h3 className="font-semibold text-[#000069]">Ek Bilgiler</h3>
              <p className="text-[#000069] leading-relaxed">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <section className="py-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-[#000080]">
              Benzer Ürünler
            </h2>
            <div className="flex space-x-3">
              <button className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                <ChevronLeft size={16} />
              </button>
              <button className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {similarProducts.map((similarProduct) => (
              <ProductCard key={similarProduct._id} product={similarProduct} />
            ))}
          </div>
        </section>
      )}

      {/* Image Zoom Modal */}
      <ImageZoom
        images={images}
        initialIndex={selectedImageIndex}
        isOpen={isZoomOpen}
        onClose={handleZoomClose}
        productName={product.name}
      />
    </div>
  );
}
