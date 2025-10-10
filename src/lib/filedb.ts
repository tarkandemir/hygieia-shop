import fs from 'fs';
import path from 'path';

// Data klasörünün yolu
const DATA_DIR = path.join(process.cwd(), 'data');

// Cache için
let dataCache: { [key: string]: any[] } = {};
let lastLoadTime: { [key: string]: number } = {};
const CACHE_DURATION = 60000; // 1 dakika cache

/**
 * JSON dosyasından veri okur
 */
function readJsonFile(filename: string): any[] {
  const filePath = path.join(DATA_DIR, filename);
  
  // Cache kontrolü
  const now = Date.now();
  if (dataCache[filename] && lastLoadTime[filename] && (now - lastLoadTime[filename] < CACHE_DURATION)) {
    return dataCache[filename];
  }
  
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    
    // Cache'e kaydet
    dataCache[filename] = data;
    lastLoadTime[filename] = now;
    
    return data;
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
}

/**
 * Products koleksiyonu
 */
export const Products = {
  find: (filter: any = {}) => {
    let products = readJsonFile('products.json');
    
    // Status filtresi
    if (filter.status) {
      products = products.filter(p => p.status === filter.status);
    }
    
    // Category filtresi
    if (filter.category) {
      products = products.filter(p => p.category === filter.category);
    }
    
    // SKU filtresi
    if (filter.sku) {
      products = products.filter(p => p.sku === filter.sku);
    }
    
    return {
      select: (fields: string) => ({
        lean: () => products,
        limit: (n: number) => ({
          lean: () => products.slice(0, n)
        }),
        skip: (n: number) => ({
          limit: (m: number) => ({
            lean: () => products.slice(n, n + m)
          })
        })
      }),
      lean: () => products,
      limit: (n: number) => ({
        lean: () => products.slice(0, n),
        skip: (m: number) => ({
          lean: () => products.slice(m, m + n)
        })
      }),
      skip: (n: number) => ({
        limit: (m: number) => ({
          lean: () => products.slice(n, n + m)
        }),
        lean: () => products.slice(n)
      }),
      sort: (sortObj: any) => {
        const sortedProducts = [...products];
        const sortKey = Object.keys(sortObj)[0];
        const sortOrder = sortObj[sortKey];
        
        sortedProducts.sort((a, b) => {
          if (a[sortKey] < b[sortKey]) return sortOrder === 1 ? -1 : 1;
          if (a[sortKey] > b[sortKey]) return sortOrder === 1 ? 1 : -1;
          return 0;
        });
        
        return {
          lean: () => sortedProducts,
          limit: (n: number) => ({
            lean: () => sortedProducts.slice(0, n)
          }),
          skip: (n: number) => ({
            limit: (m: number) => ({
              lean: () => sortedProducts.slice(n, n + m)
            })
          })
        };
      }
    };
  },
  
  findById: (id: string) => {
    const products = readJsonFile('products.json');
    const product = products.find(p => p._id === id);
    return {
      lean: () => product || null
    };
  },
  
  findOne: (filter: any) => {
    const products = readJsonFile('products.json');
    let result = products;
    
    if (filter._id) {
      result = result.filter(p => p._id === filter._id);
    }
    if (filter.sku) {
      result = result.filter(p => p.sku === filter.sku);
    }
    if (filter.status) {
      result = result.filter(p => p.status === filter.status);
    }
    
    return {
      lean: () => result[0] || null
    };
  },
  
  countDocuments: (filter: any = {}) => {
    let products = readJsonFile('products.json');
    
    if (filter.status) {
      products = products.filter(p => p.status === filter.status);
    }
    if (filter.category) {
      products = products.filter(p => p.category === filter.category);
    }
    
    return products.length;
  },
  
  updateStock: (productId: string, quantityChange: number) => {
    const products = readJsonFile('products.json');
    const productIndex = products.findIndex((p: any) => p._id === productId);
    
    if (productIndex === -1) {
      throw new Error('Product not found');
    }
    
    products[productIndex].stock += quantityChange;
    products[productIndex].updatedAt = new Date().toISOString();
    
    // Dosyaya yaz
    const filePath = path.join(DATA_DIR, 'products.json');
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
    
    // Cache'i güncelle
    dataCache['products.json'] = products;
    lastLoadTime['products.json'] = Date.now();
    
    return products[productIndex];
  }
};

/**
 * Categories koleksiyonu
 */
export const Categories = {
  find: (filter: any = {}) => {
    let categories = readJsonFile('categories.json');
    
    if (filter.isActive !== undefined) {
      categories = categories.filter(c => c.isActive === filter.isActive);
    }
    
    if (filter.slug) {
      categories = categories.filter(c => c.slug === filter.slug);
    }
    
    return {
      select: (fields: string) => ({
        lean: () => categories
      }),
      lean: () => categories,
      sort: (sortObj: any) => {
        const sortedCategories = [...categories];
        const sortKey = Object.keys(sortObj)[0];
        const sortOrder = sortObj[sortKey];
        
        sortedCategories.sort((a, b) => {
          if (a[sortKey] < b[sortKey]) return sortOrder === 1 ? -1 : 1;
          if (a[sortKey] > b[sortKey]) return sortOrder === 1 ? 1 : -1;
          return 0;
        });
        
        return {
          lean: () => sortedCategories
        };
      }
    };
  },
  
  findOne: (filter: any) => {
    const categories = readJsonFile('categories.json');
    let result = categories;
    
    if (filter.slug) {
      result = result.filter(c => c.slug === filter.slug);
    }
    if (filter.name) {
      result = result.filter(c => c.name === filter.name);
    }
    
    return {
      lean: () => result[0] || null
    };
  },
  
  countDocuments: () => {
    return readJsonFile('categories.json').length;
  }
};

/**
 * Orders koleksiyonu
 */
export const Orders = {
  find: (filter: any = {}) => {
    let orders = readJsonFile('orders.json');
    
    if (filter.status) {
      orders = orders.filter(o => o.status === filter.status);
    }
    
    return {
      lean: () => orders,
      sort: (sortObj: any) => {
        const sortedOrders = [...orders];
        const sortKey = Object.keys(sortObj)[0];
        const sortOrder = sortObj[sortKey];
        
        sortedOrders.sort((a, b) => {
          if (a[sortKey] < b[sortKey]) return sortOrder === 1 ? -1 : 1;
          if (a[sortKey] > b[sortKey]) return sortOrder === 1 ? 1 : -1;
          return 0;
        });
        
        return {
          lean: () => sortedOrders
        };
      }
    };
  },
  
  create: async (orderData: any) => {
    const orders = readJsonFile('orders.json');
    
    // Yeni order için ID oluştur
    const newId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newOrder = {
      _id: newId,
      ...orderData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Order number oluştur
    if (!newOrder.orderNumber) {
      const date = new Date();
      const year = date.getFullYear().toString().slice(-2);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      
      const prefix = `SP${year}${month}${day}`;
      const todayOrders = orders.filter((o: any) => o.orderNumber?.startsWith(prefix));
      const sequence = todayOrders.length + 1;
      
      newOrder.orderNumber = `${prefix}${sequence.toString().padStart(4, '0')}`;
    }
    
    orders.push(newOrder);
    
    // Dosyaya yaz
    const filePath = path.join(DATA_DIR, 'orders.json');
    fs.writeFileSync(filePath, JSON.stringify(orders, null, 2));
    
    // Cache'i güncelle
    dataCache['orders.json'] = orders;
    lastLoadTime['orders.json'] = Date.now();
    
    return newOrder;
  }
};

/**
 * Settings koleksiyonu
 */
export const Settings = {
  find: () => {
    const settings = readJsonFile('settings.json');
    return {
      lean: () => settings
    };
  },
  
  findOne: (filter: any) => {
    const settings = readJsonFile('settings.json');
    let result = settings;
    
    if (filter.key) {
      result = result.filter((s: any) => s.key === filter.key);
    }
    
    return {
      lean: () => result[0] || null
    };
  }
};

/**
 * Notifications koleksiyonu
 */
export const Notifications = {
  find: (filter: any = {}) => {
    let notifications = readJsonFile('notifications.json');
    
    if (filter.read !== undefined) {
      notifications = notifications.filter((n: any) => n.read === filter.read);
    }
    
    return {
      lean: () => notifications,
      sort: (sortObj: any) => {
        const sorted = [...notifications];
        const sortKey = Object.keys(sortObj)[0];
        const sortOrder = sortObj[sortKey];
        
        sorted.sort((a, b) => {
          if (a[sortKey] < b[sortKey]) return sortOrder === 1 ? -1 : 1;
          if (a[sortKey] > b[sortKey]) return sortOrder === 1 ? 1 : -1;
          return 0;
        });
        
        return {
          lean: () => sorted,
          limit: (n: number) => ({
            lean: () => sorted.slice(0, n)
          })
        };
      }
    };
  }
};

/**
 * Users koleksiyonu
 */
export const Users = {
  find: () => {
    const users = readJsonFile('users.json');
    return {
      lean: () => users
    };
  },
  
  findOne: (filter: any) => {
    const users = readJsonFile('users.json');
    let result = users;
    
    if (filter.email) {
      result = result.filter((u: any) => u.email === filter.email);
    }
    if (filter.username) {
      result = result.filter((u: any) => u.username === filter.username);
    }
    
    return {
      lean: () => result[0] || null
    };
  }
};

// Cache'i temizle
export function clearCache() {
  dataCache = {};
  lastLoadTime = {};
}

