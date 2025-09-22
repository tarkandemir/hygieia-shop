import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import Category from '../../../models/Category';
import Product from '../../../models/Product';

export async function GET() {
  try {
    await connectToDatabase();
    
    const categories = await Category.find({ isActive: true })
      .sort({ order: 1, name: 1 })
      .lean();

    // Her kategori için ürün sayısını hesapla
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.countDocuments({
          category: category.name,
          status: 'active'
        });
        
        return {
          ...category,
          productCount
        };
      })
    );
    
    return NextResponse.json(JSON.parse(JSON.stringify(categoriesWithCounts)));
    
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
