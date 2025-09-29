import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import Category from '../../../models/Category';
import Product from '../../../models/Product';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Cache headers for better performance
    const headers = {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    };
    
    const categories = await Category.find({ isActive: true })
      .sort({ order: 1, name: 1 })
      .lean();

    // Optimize: Get all product counts in a single aggregation query
    const productCounts = await Product.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Create a map for faster lookup
    const countMap = new Map(
      productCounts.map(item => [item._id, item.count])
    );

    // Combine categories with counts
    const categoriesWithCounts = categories.map(category => ({
      ...category,
      productCount: countMap.get(category.name) || 0
    }));
    
    return NextResponse.json(JSON.parse(JSON.stringify(categoriesWithCounts)), { headers });
    
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
