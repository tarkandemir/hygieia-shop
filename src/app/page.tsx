import Header from '../components/Header';
import Footer from '../components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, MessageCircle } from 'lucide-react';

export default function HomePage() {
  const services = [
    {
      title: 'Kağıt Ürünleri',
      description: 'Hygieia Türkiye\'nin önde gelen kağıt üreticileri ile birebir çalışmakta olup sizlerin istek ve ihtiyaçlarına göre ürün sunmaktayız.',
      icon: 'memo',
      iconClass: 'fa-light fa-memo',
    },
    {
      title: 'Temizlik Ürünleri', 
      description: 'Hygieia, Türkiye\'de üretilen veya yurt dışından ithal edilen her türlü temizlik malzemesinin tedariğini sağlamaktadır.',
      icon: 'spray-can',
      iconClass: 'fa-light fa-spray-can',
    },
    {
      title: 'Kırtasiye Ürünleri',
      description: 'Tebeşirden projektöre kadar ihtiyacınız olan tüm kırtasiye malzemeleri için Hygieia\'yı tercih edebilirsiniz.',
      icon: 'projector',
      iconClass: 'fa-light fa-projector',
    },
    {
      title: 'Gıda Ürünleri',
      description: 'İnsanoğlunun enerjisi gıda, gıda da çözüm ortağınız Hygieia. Mutfakta kullandığınız konvansiyonel yiyeceklerden paketlenmiş ürünlere, ithal tropikal kuru meyvelerden organik kuruyemişle hazırlanan sağlık atıştırmalıklara kadar Hygieia Fark Yaratan çözümler sunar.',
      icon: 'bowl-hot',
      iconClass: 'fa-light fa-bowl-hot',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header activeLink="home" />

      {/* Hero Section */}
      <section className="relative bg-[#000080] text-white min-h-[682px] flex items-center">        
        <div className="relative container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Image Left - Woman Only */}
            <div className="relative">
              <Image
                src="/hero-woman.jpg"
                alt="Hygieia Professional Woman"
                width={680}
                height={652}
                className="w-full h-auto"
                priority
              />
            </div>

            {/* Hero Text Right */}
            <div className="space-y-8">
              <h1 className="text-[60px] font-semibold leading-[1.2] text-[#6AF0D2]">
                Hygieia ile<br />
                fark yaratmanın<br />
                tam zamanı!
              </h1>
              
              {/* CTA Button */}
              <Link 
                href="/products"
                className="inline-flex items-center space-x-2 bg-[#6AF0D2] text-[#000080] px-6 py-3 rounded-lg font-semibold text-base hover:bg-[#5BE0C2] transition-colors border border-[#6AF0D2]"
              >
                <span>İşletmenize Özel Çözümler</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-[#E9FDF8]">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* About Text Left */}
            <div className="space-y-6">
              <div>
                <h3 className="text-[#000080] text-base font-normal mb-2">Hakkımızda</h3>
                <h2 className="text-[32px] font-semibold text-[#000080] mb-6 leading-[1.375] max-w-lg">
                  Kurumsal firmalara, özel ve<br />
                  benzersiz çözümler sunuyoruz
                </h2>
              </div>
              
              <div className="space-y-4 text-[#000080] text-base leading-7">
                <p>
                  2021 yılında kurumsal firmaların çözüm ortağı olarak çıktığımız yolda amacımız doğru ürünü, 
                  doğru fiyata ve söz verdiğimiz zamanda tedarik etmek. Çok kısa sürede Türkiye&apos;nin önde gelen 
                  yerli ve yabancı firmaların tercihi olduk.
                </p>
                
                <p>
                  Yaptığımız işe ve size önem veriyor, Fark Yaratmak için Hygieia&apos;yı denemenizi tavsiye ediyoruz.
                </p>
              </div>
            </div>

            {/* About Images Right */}
            <div className="relative">
              {/* Decorative dots pattern */}
              <div className="absolute top-0 left-0 w-40 h-40 opacity-20">
                <div className="grid grid-cols-12 gap-1">
                  {Array.from({ length: 144 }, (_, i) => (
                    <div key={i} className="w-1 h-1 bg-[#9CEAEF] rounded-full"></div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 ml-8 mt-8">
                <div className="space-y-4">
                  <div className="h-60 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl overflow-hidden">
                    <Image
                      src="/about-image-1.jpg"
                      alt="About Hygieia 1"
                      width={280}
                      height={360}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl overflow-hidden">
                    <Image
                      src="/about-image-2.jpg"
                      alt="About Hygieia 2"
                      width={280}
                      height={360}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="h-32 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl overflow-hidden">
                    <Image
                      src="/about-image-3.jpg"
                      alt="About Hygieia 3"
                      width={220}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="h-60 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl overflow-hidden">
                    <Image
                      src="/about-image-4.jpg"
                      alt="About Hygieia 4"
                      width={220}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left side - Decorative images with dot pattern */}
            <div className="relative">
              {/* Decorative dots pattern */}
              <div className="absolute top-0 left-0 w-40 h-40 opacity-20">
                <div className="grid grid-cols-12 gap-1">
                  {Array.from({ length: 144 }, (_, i) => (
                    <div key={i} className="w-1 h-1 bg-[#000080] rounded-full"></div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 ml-8 mt-8">
                <div className="space-y-4">
                  <div className="h-60 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl overflow-hidden">
                    <Image
                      src="/services-image-1.jpg"
                      alt="Services Image 1"
                      width={220}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl overflow-hidden">
                    <Image
                      src="/services-image-2.jpg"
                      alt="Services Image 2"
                      width={220}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="h-32 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl overflow-hidden">
                    <Image
                      src="/about-image-3.jpg"
                      alt="Services Image 3"
                      width={220}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="h-60 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl overflow-hidden">
                    <Image
                      src="/about-image-4.jpg"
                      alt="Services Image 4"
                      width={220}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Services content */}
            <div className="space-y-8">
              {/* Section Header */}
              <div>
                <h3 className="text-[#000080] text-base font-normal mb-2">Hizmetlerimiz</h3>
                <h2 className="text-[32px] font-semibold text-[#000080] mb-4 leading-[1.375] max-w-lg">
                  Tüm ihtiyaçlarınıza en uygun fiyat ve kaliteli binlerce ürün
                </h2>
              </div>

              {/* Services List */}
              <div className="space-y-8">
                {services.map((service, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className="w-20 h-20 bg-[#E9FDF8] rounded-xl flex items-center justify-center flex-shrink-0">
                      <Image
                        src={`/${service.icon}-icon.svg`}
                        alt={`${service.title} Icon`}
                        width={service.icon === 'memo' ? 27 : service.icon === 'projector' ? 45 : 36}
                        height={36}
                        className="text-[#000080]"
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-[#000080]">
                          {service.title}
                        </h3>
                        <Link 
                          href="/products" 
                          className="text-sm text-[#000080] hover:text-[#6AF0D2] transition-colors border-b border-[#000080] hover:border-[#6AF0D2]"
                        >
                          Tümünü Gör
                        </Link>
                      </div>
                      <p className="text-sm text-[#000080] leading-6">
                        {service.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-20 bg-cover bg-center relative">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/quote-bg.jpg"
            alt="Quote Background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#000080]/50"></div>
        </div>
        
        <div className="relative container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <Image
              src="/logo.png"
              alt="Hygieia"
              width={250}
              height={80}
              className="mx-auto mb-8"
            />
            <blockquote className="text-xl text-white font-normal leading-relaxed">
              &quot;Yaptığımız işe ve size önem veriyor, Fark Yaratmak için<br />
              Hygieia&apos;yı denemenizi tavsiye ediyoruz.&quot;
            </blockquote>
          </div>
        </div>
      </section>

      {/* View All Products CTA */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-6 text-center">
          <Link 
            href="/products"
            className="inline-flex items-center space-x-2 bg-[#000080] text-[#6AF0D2] px-8 py-3 rounded-lg font-semibold text-base hover:bg-[#000069] transition-colors"
          >
            <span>Tüm Ürünleri Gör</span>
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-[#000080]">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl font-semibold text-[#6AF0D2] mb-4">
              Başka bir arzunuz?
            </h2>
            
            <p className="text-white text-sm leading-6 mb-8">
              Kurumsal çözüm ortağınız Hygieia ile tedarik sorunu çözmek ve Fark Yaratmak bir telefon kadar uzağınızda.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+905321234567"
                className="inline-flex items-center justify-center space-x-3 bg-[#6AF0D2] text-[#000080] px-6 py-3 rounded-2xl font-semibold hover:bg-[#5BE0C2] transition-colors"
              >
                <Phone size={16} />
                <span>Bizi Arayın</span>
              </a>
              
              <a
                href="https://wa.me/905321234567"
                className="inline-flex items-center justify-center space-x-3 border border-[#6AF0D2] text-[#6AF0D2] px-6 py-3 rounded-2xl font-semibold hover:bg-[#6AF0D2] hover:text-[#000080] transition-colors"
              >
                <MessageCircle size={16} />
                <span>Bize Yazın</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
