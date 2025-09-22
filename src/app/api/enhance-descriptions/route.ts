import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import Product from '../../../models/Product';

// SEO için geliştirilmiş açıklama oluşturucu
function enhanceDescription(product: any) {
  const { name, description, category, tags, wholesalePrice, retailPrice } = product;
  
  // Mevcut açıklama varsa onu koruyalım
  let enhancedDesc = description || '';
  
  // Kategori bazlı genel bilgiler
  const categoryInfo: Record<string, any> = {
    'Temizlik Ürünleri': {
      benefits: 'hijyen ve temizlik standartlarınızı en üst seviyeye çıkarır',
      usage: 'Ev, ofis ve endüstriyel alanlarda güvenle kullanılabilir',
      quality: 'Yüksek kaliteli formülasyonu sayesinde etkili temizlik sağlar'
    },
    'Kağıt Ürünleri': {
      benefits: 'günlük ihtiyaçlarınızı karşılamak için tasarlanmıştır',
      usage: 'Ev, ofis, restoran ve otel işletmelerinde tercih edilir',
      quality: 'Dayanıklı yapısı ve yüksek emicilik özelliği ile öne çıkar'
    },
    'Kırtasiye Ürünleri': {
      benefits: 'iş verimliliğinizi artırmak için gerekli tüm özellikleri sunar',
      usage: 'Ofis, okul ve ev kullanımı için idealdir',
      quality: 'Ergonomik tasarımı ve fonksiyonel özellikleri ile kullanım kolaylığı sağlar'
    },
    'Gıda Ürünleri': {
      benefits: 'beslenme ihtiyaçlarınızı karşılamak için özenle seçilmiştir',
      usage: 'Günlük tüketim için uygun, sağlıklı ve lezzetli alternatif sunar',
      quality: 'Kalite standartlarına uygun üretim ve ambalajlama ile taze kalır'
    },
    'Ofis Malzemeleri': {
      benefits: 'iş yerinizin organizasyonunu ve verimliliğini artırır',
      usage: 'Modern ofis ortamlarının ihtiyaçları için özel olarak tasarlanmıştır',
      quality: 'Dayanıklı malzeme ve işçiliği ile uzun süreli kullanım garantisi verir'
    },
    'Makine & Ekipman': {
      benefits: 'iş süreçlerinizi hızlandırır ve kaliteyi artırır',
      usage: 'Endüstriyel ve ticari uygulamalarda güvenilir performans sağlar',
      quality: 'İleri teknoloji ve sağlam yapısı ile uzun ömürlü kullanım sunar'
    }
  };

  const catInfo = categoryInfo[category] || categoryInfo['Temizlik Ürünleri'];
  
  // Fiyat avantajı bilgisi
  const discount = Math.round(((wholesalePrice - retailPrice) / wholesalePrice) * 100);
  const priceInfo = discount > 0 ? `%${discount} indirimli fiyatla` : 'uygun fiyatla';
  
  // Etiket bazlı özellikler
  const tagFeatures = tags && tags.length > 0 ? 
    `${tags.slice(0, 3).join(', ')} özellikleri ile` : '';
  
  // SEO dostu açıklama oluştur
  const seoDescription = `
${name}, ${catInfo.benefits}. ${tagFeatures ? tagFeatures + ' ' : ''}${catInfo.quality}. 

${catInfo.usage}. Hygieia kalite garantisi ile sunulan bu ürün, ${priceInfo} satın alabilirsiniz. 

${enhancedDesc ? enhancedDesc + ' ' : ''}Kurumsal müşterilerimize özel toplu satış avantajları mevcuttur. Hızlı teslimat ve güvenilir hizmet anlayışımızla, ihtiyacınız olan ${category.toLowerCase()} ürünlerini zamanında teslim alabilirsiniz.

Ürün hakkında detaylı bilgi almak ve özel fiyat teklifi için bizimle iletişime geçebilirsiniz.
  `.trim();

  return seoDescription;
}

export async function POST() {
  try {
    await connectToDatabase();

    // Tüm aktif ürünleri getir
    const products = await Product.find({ status: 'active' });
    console.log(`📦 ${products.length} aktif ürün bulundu`);

    let updatedCount = 0;
    let skippedCount = 0;
    const results = [];

    for (const product of products) {
      // Mevcut açıklama çok kısa veya yoksa güncelle
      const currentDesc = product.description || '';
      
      if (currentDesc.length < 100) {
        const enhancedDesc = enhanceDescription(product);
        
        await Product.findByIdAndUpdate(product._id, {
          description: enhancedDesc,
          updatedAt: new Date()
        });
        
        results.push({
          id: product._id,
          name: product.name,
          oldLength: currentDesc.length,
          newLength: enhancedDesc.length,
          status: 'updated'
        });
        
        updatedCount++;
      } else {
        results.push({
          id: product._id,
          name: product.name,
          descriptionLength: currentDesc.length,
          status: 'skipped'
        });
        skippedCount++;
      }
    }

    // Örnek güncellenmiş ürün
    const sampleProduct = await Product.findOne({ 
      status: 'active',
      description: { $regex: 'Hygieia kalite garantisi' }
    });

    return NextResponse.json({
      success: true,
      message: 'Ürün açıklamaları başarıyla güncellendi',
      stats: {
        total: products.length,
        updated: updatedCount,
        skipped: skippedCount
      },
      results,
      sampleDescription: sampleProduct ? {
        name: sampleProduct.name,
        description: sampleProduct.description.substring(0, 300) + '...'
      } : null
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Ürün açıklamaları güncellenirken hata oluştu',
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      },
      { status: 500 }
    );
  }
}
