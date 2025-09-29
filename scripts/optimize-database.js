// MongoDB Database Optimization Script
// This script adds performance indexes without affecting existing data

const { MongoClient } = require('mongodb');

async function optimizeDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI environment variable is required');
    process.exit(1);
  }

  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    
    // Optimize Products collection
    console.log('Optimizing Products collection...');
    
    // Compound indexes for common queries
    await db.collection('products').createIndex(
      { status: 1, category: 1 },
      { name: 'status_category_idx' }
    );
    
    await db.collection('products').createIndex(
      { status: 1, createdAt: -1 },
      { name: 'status_createdAt_idx' }
    );
    
    await db.collection('products').createIndex(
      { category: 1, status: 1, retailPrice: 1 },
      { name: 'category_status_price_idx' }
    );
    
    // Text index for search functionality
    await db.collection('products').createIndex(
      { name: 'text', description: 'text', tags: 'text' },
      { name: 'search_text_idx' }
    );
    
    // Optimize Categories collection
    console.log('Optimizing Categories collection...');
    
    await db.collection('categories').createIndex(
      { isActive: 1, order: 1 },
      { name: 'isActive_order_idx' }
    );
    
    await db.collection('categories').createIndex(
      { slug: 1, isActive: 1 },
      { name: 'slug_isActive_idx' }
    );
    
    console.log('Database optimization completed successfully!');
    
    // Show current indexes
    console.log('\nProducts indexes:');
    const productIndexes = await db.collection('products').indexes();
    productIndexes.forEach(index => {
      console.log(`- ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
    console.log('\nCategories indexes:');
    const categoryIndexes = await db.collection('categories').indexes();
    categoryIndexes.forEach(index => {
      console.log(`- ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
  } catch (error) {
    console.error('Error optimizing database:', error);
  } finally {
    await client.close();
  }
}

optimizeDatabase();
