const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = 'mongodb+srv://vercel-admin-user-689a1694c6325f15166f0033:jnebqs0OrqUxzFt9@cluster0.829hv1c.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

// Data klasörünü oluştur
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

async function exportCollection(collectionName) {
  try {
    const collection = mongoose.connection.collection(collectionName);
    const documents = await collection.find({}).toArray();
    
    // MongoDB ObjectId'leri string'e çevir
    const jsonData = JSON.stringify(documents, null, 2);
    
    const filePath = path.join(dataDir, `${collectionName}.json`);
    fs.writeFileSync(filePath, jsonData);
    
    console.log(`✓ ${collectionName}: ${documents.length} kayıt export edildi`);
    return documents.length;
  } catch (error) {
    console.error(`✗ ${collectionName} export hatası:`, error.message);
    return 0;
  }
}

async function exportAllCollections() {
  try {
    console.log('MongoDB\'ye bağlanılıyor...');
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Bağlantı başarılı\n');

    // Tüm koleksiyonları listele
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    console.log(`Toplam ${collectionNames.length} koleksiyon bulundu:\n`);
    
    let totalDocuments = 0;
    
    for (const collectionName of collectionNames) {
      const count = await exportCollection(collectionName);
      totalDocuments += count;
    }
    
    console.log(`\n✓ Export tamamlandı!`);
    console.log(`Toplam ${totalDocuments} kayıt export edildi.`);
    console.log(`Dosyalar: ${dataDir}`);
    
  } catch (error) {
    console.error('Export hatası:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✓ MongoDB bağlantısı kapatıldı');
  }
}

// Script'i çalıştır
exportAllCollections().then(() => process.exit(0));

