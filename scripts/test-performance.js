// MongoDB Performance Test Script
const { MongoClient } = require('mongodb');

async function testPerformance() {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://vercel-admin-user-689a1694c6325f15166f0033:jnebqs0OrqUxzFt9@cluster0.829hv1c.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
  
  console.log('🔍 MongoDB Performance Test\n');
  console.log('Testing connection to:', uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
  
  const client = new MongoClient(uri, {
    maxPoolSize: 20,
    serverSelectionTimeoutMS: 2000,
    socketTimeoutMS: 20000,
    connectTimeoutMS: 2000,
  });
  
  try {
    // Test 1: Connection Speed
    console.log('\n📊 Test 1: Connection Speed');
    const connectStart = Date.now();
    await client.connect();
    const connectTime = Date.now() - connectStart;
    console.log(`✓ Connection time: ${connectTime}ms`);
    
    const db = client.db();
    
    // Test 2: Single Product Query
    console.log('\n📊 Test 2: Single Product Query (by ID)');
    let singleTime = 0;
    const products = await db.collection('products').find({ status: 'active' }).limit(1).toArray();
    if (products.length > 0) {
      const productId = products[0]._id;
      const singleStart = Date.now();
      await db.collection('products').findOne({ _id: productId });
      singleTime = Date.now() - singleStart;
      console.log(`✓ Single product query: ${singleTime}ms`);
    }
    
    // Test 3: Category Products Query
    console.log('\n📊 Test 3: Category Products Query (20 items)');
    const categoryStart = Date.now();
    const categoryProducts = await db.collection('products')
      .find({ status: 'active' })
      .limit(20)
      .project({ name: 1, images: 1, retailPrice: 1, stock: 1, category: 1 })
      .toArray();
    const categoryTime = Date.now() - categoryStart;
    console.log(`✓ Category products (${categoryProducts.length} items): ${categoryTime}ms`);
    
    // Test 4: Count Query
    console.log('\n📊 Test 4: Count Query');
    const countStart = Date.now();
    const totalCount = await db.collection('products').countDocuments({ status: 'active' });
    const countTime = Date.now() - countStart;
    console.log(`✓ Count query (${totalCount} total): ${countTime}ms`);
    
    // Test 5: Aggregation Query
    console.log('\n📊 Test 5: Aggregation Query (category counts)');
    const aggStart = Date.now();
    const categoryCounts = await db.collection('products').aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]).toArray();
    const aggTime = Date.now() - aggStart;
    console.log(`✓ Aggregation (${categoryCounts.length} categories): ${aggTime}ms`);
    
    // Test 6: Index Check
    console.log('\n📊 Test 6: Index Check');
    const indexes = await db.collection('products').indexes();
    console.log(`✓ Total indexes: ${indexes.length}`);
    console.log('Available indexes:');
    indexes.forEach(idx => {
      console.log(`  - ${idx.name}: ${JSON.stringify(idx.key)}`);
    });
    
    // Summary
    console.log('\n📋 Performance Summary:');
    console.log('─────────────────────────────────────');
    console.log(`Connection:        ${connectTime}ms ${connectTime > 1000 ? '❌ SLOW' : '✓ OK'}`);
    console.log(`Single Product:    ${singleTime}ms ${singleTime > 100 ? '⚠️ SLOW' : '✓ OK'}`);
    console.log(`Category Products: ${categoryTime}ms ${categoryTime > 500 ? '❌ SLOW' : categoryTime > 200 ? '⚠️ OK' : '✓ FAST'}`);
    console.log(`Count Query:       ${countTime}ms ${countTime > 200 ? '⚠️ SLOW' : '✓ OK'}`);
    console.log(`Aggregation:       ${aggTime}ms ${aggTime > 300 ? '⚠️ SLOW' : '✓ OK'}`);
    console.log('─────────────────────────────────────');
    
    // Recommendations
    console.log('\n💡 Recommendations:');
    if (connectTime > 1000) {
      console.log('⚠️ Connection is slow. Consider:');
      console.log('  - Using a closer MongoDB region');
      console.log('  - Checking network latency');
    }
    if (categoryTime > 500) {
      console.log('⚠️ Category query is slow. Consider:');
      console.log('  - Adding compound index: { status: 1, category: 1 }');
      console.log('  - Reducing limit or using pagination');
    }
    if (!indexes.find(idx => idx.name === 'status_category_idx')) {
      console.log('⚠️ Missing compound indexes. Run:');
      console.log('  npm run optimize-db');
    }
    
  } catch (error) {
    console.error('❌ Performance test failed:', error);
  } finally {
    await client.close();
  }
}

testPerformance();
