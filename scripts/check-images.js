// Check image sizes and formats in database
const { MongoClient } = require('mongodb');

async function checkImages() {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://vercel-admin-user-689a1694c6325f15166f0033:jnebqs0OrqUxzFt9@cluster0.829hv1c.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('🔍 MongoDB Image Analysis\n');
    
    const db = client.db();
    const products = await db.collection('products').find({ status: 'active' }).limit(5).toArray();
    
    console.log(`📦 Analyzing ${products.length} products...\n`);
    
    let base64Count = 0;
    let urlCount = 0;
    let totalBase64Size = 0;
    
    products.forEach((product, index) => {
      console.log(`Product ${index + 1}: ${product.name}`);
      console.log(`  SKU: ${product.sku}`);
      
      if (product.images && product.images.length > 0) {
        product.images.forEach((img, imgIndex) => {
          if (img.startsWith('data:image')) {
            base64Count++;
            const base64Size = Buffer.byteLength(img, 'utf8');
            totalBase64Size += base64Size;
            console.log(`  Image ${imgIndex + 1}: BASE64 ❌ Size: ${(base64Size / 1024).toFixed(2)} KB`);
          } else {
            urlCount++;
            console.log(`  Image ${imgIndex + 1}: URL ✓ Path: ${img}`);
          }
        });
      } else {
        console.log(`  Images: None`);
      }
      console.log('');
    });
    
    console.log('📋 Summary:');
    console.log('─────────────────────────────────────');
    console.log(`BASE64 Images: ${base64Count} ❌`);
    console.log(`URL/Path Images: ${urlCount} ✓`);
    console.log(`Total BASE64 Size: ${(totalBase64Size / 1024).toFixed(2)} KB`);
    if (base64Count > 0) {
      console.log(`Avg BASE64 Size: ${(totalBase64Size / base64Count / 1024).toFixed(2)} KB per image`);
    }
    console.log('─────────────────────────────────────\n');
    
    if (base64Count > 0) {
      console.log('🚨 CRITICAL ISSUE FOUND!');
      console.log('');
      console.log('BASE64 images are stored in MongoDB. This causes:');
      console.log('  ❌ Huge document sizes (each image ~50-500KB)');
      console.log('  ❌ Slow database queries (transferring MB of data)');
      console.log('  ❌ Memory issues (loading large documents)');
      console.log('  ❌ Network bandwidth waste');
      console.log('');
      console.log('💡 SOLUTION:');
      console.log('  1. Move images to /public/images/ folder');
      console.log('  2. Store only image paths in database (e.g., "products/image.jpg")');
      console.log('  3. Use Next.js Image Optimization');
      console.log('');
      console.log(`Expected performance improvement: ${base64Count} images × ~200KB = ${(base64Count * 200 / 1024).toFixed(2)} MB less data transfer!`);
    } else {
      console.log('✅ All images are stored as URLs/paths. This is optimal!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

checkImages();
