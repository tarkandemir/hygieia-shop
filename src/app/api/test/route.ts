import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import Product from '../../../models/Product';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Test products with sample images
    const testProducts = [
      {
        name: 'Temizlik Ürünü - Dezenfektan',
        description: 'Yüksek kaliteli dezenfektan ürünü',
        sku: 'DEZ001',
        category: 'Temizlik Ürünleri',
        wholesalePrice: 50,
        retailPrice: 45,
        stock: 100,
        minStock: 10,
        unit: 'adet',
        tags: ['dezenfektan', 'temizlik', 'hijyen'],
        status: 'active',
        images: ['products/sample-product-1.jpg']
      },
      {
        name: 'Kağıt Havlu - Premium',
        description: 'Premium kalite kağıt havlu',
        sku: 'KAG001',
        category: 'Kağıt Ürünleri',
        wholesalePrice: 25,
        retailPrice: 22,
        stock: 200,
        minStock: 20,
        unit: 'paket',
        tags: ['kağıt', 'havlu', 'premium'],
        status: 'active',
        images: ['products/sample-product-2.jpg']
      }
    ];

    // Check if test products already exist, if not create them
    const existingProducts = await Product.find({ sku: { $in: ['DEZ001', 'KAG001'] } });
    
    if (existingProducts.length === 0) {
      await Product.insertMany(testProducts);
      return NextResponse.json({ 
        message: 'Test products created successfully',
        products: testProducts
      });
    } else {
      // Update existing products with image paths
      await Product.updateOne(
        { sku: 'DEZ001' }, 
        { $set: { images: ['products/sample-product-1.jpg'] } }
      );
      await Product.updateOne(
        { sku: 'KAG001' }, 
        { $set: { images: ['products/sample-product-2.jpg'] } }
      );
      
      return NextResponse.json({ 
        message: 'Test products updated with images',
        existingCount: existingProducts.length
      });
    }
  } catch (error) {
    console.error('Test API Error:', error);
    return NextResponse.json({ 
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
