import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import Category from '../../../models/Category';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Test categories
    const testCategories = [
      {
        name: 'Temizlik Ürünleri',
        description: 'Profesyonel temizlik ürünleri',
        icon: 'cleaning',
        color: '#000069',
        order: 1,
        isActive: true
      },
      {
        name: 'Kağıt Ürünleri',
        description: 'Kağıt havlu, peçete ve diğer kağıt ürünleri',
        icon: 'paper',
        color: '#6AF0D2',
        order: 2,
        isActive: true
      },
      {
        name: 'Kırtasiye Ürünleri',
        description: 'Ofis kırtasiye malzemeleri',
        icon: 'office',
        color: '#000069',
        order: 3,
        isActive: true
      }
    ];

    // Check if test categories already exist, if not create them
    const existingCategories = await Category.find({ name: { $in: testCategories.map(c => c.name) } });
    
    if (existingCategories.length === 0) {
      await Category.insertMany(testCategories);
      return NextResponse.json({ 
        message: 'Test categories created successfully',
        categories: testCategories
      });
    } else {
      return NextResponse.json({ 
        message: 'Test categories already exist',
        existingCount: existingCategories.length
      });
    }
  } catch (error) {
    console.error('Test Categories API Error:', error);
    return NextResponse.json({ 
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
