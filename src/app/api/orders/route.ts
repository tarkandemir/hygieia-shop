import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import Order from '../../../models/Order';
import Product from '../../../models/Product';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const orderData = await request.json();

    // Validate required fields
    if (!orderData.customer || !orderData.billingAddress || !orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      return NextResponse.json(
        { error: 'Gerekli alanlar eksik' },
        { status: 400 }
      );
    }

    // Validate and prepare order items
    const validatedItems = [];
    let subtotal = 0;

    for (const item of orderData.items) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        return NextResponse.json(
          { error: 'Geçersiz ürün bilgisi' },
          { status: 400 }
        );
      }

      // Get product details and check stock
      const product = await Product.findById(item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Ürün bulunamadı: ${item.productId}` },
          { status: 400 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Yetersiz stok: ${product.name} (Mevcut: ${product.stock}, İstenen: ${item.quantity})` },
          { status: 400 }
        );
      }

      const unitPrice = product.retailPrice; // Website uses retail price
      const itemTotal = Math.round((unitPrice * item.quantity) * 100) / 100;
      subtotal += itemTotal;

      validatedItems.push({
        productId: item.productId,
        name: product.name,
        sku: product.sku,
        category: product.category || '',
        quantity: item.quantity,
        unitPrice,
        totalPrice: itemTotal,
      });

      // Update product stock
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Generate order number
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Find the highest order number for today
    const prefix = `SP${year}${month}${day}`;
    const lastOrder = await Order.findOne({
      orderNumber: { $regex: `^${prefix}` }
    }).sort({ orderNumber: -1 });
    
    let sequence = 1;
    if (lastOrder) {
      const lastSequence = parseInt(lastOrder.orderNumber.slice(-4));
      sequence = lastSequence + 1;
    }
    
    const orderNumber = `${prefix}${sequence.toString().padStart(4, '0')}`;

    // Create order with website-specific format
    const order = new Order({
      orderNumber,
      customer: {
        name: `${orderData.customer.name} ${orderData.customer.surname}`.trim(),
        email: orderData.customer.email,
        phone: orderData.customer.phone,
        company: orderData.customer.company || '',
        taxId: orderData.customer.taxId || '',
      },
      billingAddress: {
        name: `${orderData.customer.name} ${orderData.customer.surname}`.trim(),
        company: orderData.customer.company || '',
        address1: orderData.billingAddress.address1,
        address2: orderData.billingAddress.address2 || '',
        city: orderData.billingAddress.city,
        state: orderData.billingAddress.district,
        postalCode: orderData.billingAddress.postalCode || '00000',
        country: orderData.billingAddress.country || 'Türkiye',
        phone: orderData.customer.phone,
      },
      shippingAddress: {
        name: `${orderData.customer.name} ${orderData.customer.surname}`.trim(),
        company: orderData.customer.company || '',
        address1: orderData.shippingAddress.address1,
        address2: orderData.shippingAddress.address2 || '',
        city: orderData.shippingAddress.city,
        state: orderData.shippingAddress.district,
        postalCode: orderData.shippingAddress.postalCode || '00000',
        country: orderData.shippingAddress.country || 'Türkiye',
        phone: orderData.customer.phone,
      },
      items: validatedItems,
      subtotal: Math.round(subtotal * 100) / 100,
      taxAmount: 0, // KDV dahil fiyat
      shippingCost: orderData.shippingCost || 0,
      discountAmount: 0,
      totalAmount: Math.round((subtotal + (orderData.shippingCost || 0)) * 100) / 100,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'bank_transfer',
      orderDate: new Date(),
      notes: orderData.notes || 'Website siparişi',
      createdBy: null, // Website siparişi
    });

    await order.save();

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order._id,
      message: 'Sipariş başarıyla oluşturuldu'
    }, { status: 201 });

  } catch (error) {
    console.error('Website order creation error:', error);
    console.error('Error details:', (error as Error).stack);
    return NextResponse.json(
      { 
        error: 'Sipariş oluşturulamadı',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get('orderNumber');

    if (!orderNumber) {
      return NextResponse.json(
        { error: 'Sipariş numarası gerekli' },
        { status: 400 }
      );
    }

    const order = await Order.findOne({ orderNumber }).lean();

    if (!order) {
      return NextResponse.json(
        { error: 'Sipariş bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);

  } catch (error) {
    console.error('Order fetch error:', error);
    return NextResponse.json(
      { error: 'Sipariş bilgileri alınamadı' },
      { status: 500 }
    );
  }
}
