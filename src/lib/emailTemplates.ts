interface OrderItem {
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Customer {
  name: string;
  email: string;
  phone: string;
  company?: string;
}

interface Address {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

interface OrderData {
  orderNumber: string;
  customer: Customer;
  billingAddress: Address;
  shippingAddress: Address;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  orderDate: Date;
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
  }).format(price);
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Müşteri için sipariş onay e-postası
 */
export function generateCustomerOrderEmail(order: OrderData): string {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        <div style="font-weight: 600; color: #111827;">${item.name}</div>
        <div style="font-size: 12px; color: #6b7280;">SKU: ${item.sku}</div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
        ${item.quantity}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
        ${formatPrice(item.unitPrice)}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">
        ${formatPrice(item.totalPrice)}
      </td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sipariş Onayı - ${order.orderNumber}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #000069 0%, #000080 100%); padding: 40px; text-align: center;">
              <h1 style="margin: 0; color: #6AF0D2; font-size: 28px; font-weight: 700;">Hygieia</h1>
              <p style="margin: 10px 0 0; color: #ffffff; font-size: 16px;">Siparişiniz Alındı!</p>
            </td>
          </tr>

          <!-- Success Message -->
          <tr>
            <td style="padding: 40px 40px 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="display: inline-block; width: 60px; height: 60px; background-color: #10b981; border-radius: 50%; line-height: 60px; font-size: 30px; color: white;">✓</div>
              </div>
              <h2 style="margin: 0 0 10px; color: #111827; font-size: 24px; text-align: center;">Teşekkür Ederiz!</h2>
              <p style="margin: 0; color: #6b7280; text-align: center; font-size: 16px;">
                Siparişiniz başarıyla alındı. En kısa sürede sizinle iletişime geçeceğiz.
              </p>
            </td>
          </tr>

          <!-- Order Details -->
          <tr>
            <td style="padding: 0 40px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; padding: 20px;">
                <tr>
                  <td width="50%" style="padding: 10px;">
                    <div style="font-size: 12px; color: #6b7280; margin-bottom: 5px;">Sipariş Numarası</div>
                    <div style="font-size: 18px; font-weight: 700; color: #000069;">${order.orderNumber}</div>
                  </td>
                  <td width="50%" style="padding: 10px; text-align: right;">
                    <div style="font-size: 12px; color: #6b7280; margin-bottom: 5px;">Sipariş Tarihi</div>
                    <div style="font-size: 14px; font-weight: 600; color: #111827;">${formatDate(order.orderDate)}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Order Items -->
          <tr>
            <td style="padding: 0 40px 20px;">
              <h3 style="margin: 0 0 15px; color: #111827; font-size: 18px;">Sipariş Detayları</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                <thead>
                  <tr style="background-color: #f9fafb;">
                    <th style="padding: 12px; text-align: left; font-size: 12px; color: #6b7280; font-weight: 600; text-transform: uppercase;">Ürün</th>
                    <th style="padding: 12px; text-align: center; font-size: 12px; color: #6b7280; font-weight: 600; text-transform: uppercase;">Adet</th>
                    <th style="padding: 12px; text-align: right; font-size: 12px; color: #6b7280; font-weight: 600; text-transform: uppercase;">Birim Fiyat</th>
                    <th style="padding: 12px; text-align: right; font-size: 12px; color: #6b7280; font-weight: 600; text-transform: uppercase;">Toplam</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Order Summary -->
          <tr>
            <td style="padding: 0 40px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">Ara Toplam:</td>
                  <td style="padding: 8px 0; text-align: right; font-size: 14px; font-weight: 600;">${formatPrice(order.subtotal)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">Kargo:</td>
                  <td style="padding: 8px 0; text-align: right; font-size: 14px; font-weight: 600; color: ${order.shippingCost === 0 ? '#10b981' : '#111827'};">
                    ${order.shippingCost === 0 ? 'Ücretsiz' : formatPrice(order.shippingCost)}
                  </td>
                </tr>
                <tr style="border-top: 2px solid #e5e7eb;">
                  <td style="padding: 12px 0; font-size: 18px; font-weight: 700; color: #111827;">Toplam:</td>
                  <td style="padding: 12px 0; text-align: right; font-size: 18px; font-weight: 700; color: #000069;">${formatPrice(order.totalAmount)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Addresses -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="48%" style="vertical-align: top;">
                    <h4 style="margin: 0 0 10px; color: #111827; font-size: 14px; font-weight: 600;">Fatura Adresi</h4>
                    <div style="font-size: 13px; color: #6b7280; line-height: 1.6;">
                      ${order.billingAddress.name}<br>
                      ${order.billingAddress.address1}<br>
                      ${order.billingAddress.address2 ? order.billingAddress.address2 + '<br>' : ''}
                      ${order.billingAddress.city} / ${order.billingAddress.state}<br>
                      ${order.billingAddress.postalCode} ${order.billingAddress.country}
                    </div>
                  </td>
                  <td width="4%"></td>
                  <td width="48%" style="vertical-align: top;">
                    <h4 style="margin: 0 0 10px; color: #111827; font-size: 14px; font-weight: 600;">Teslimat Adresi</h4>
                    <div style="font-size: 13px; color: #6b7280; line-height: 1.6;">
                      ${order.shippingAddress.name}<br>
                      ${order.shippingAddress.address1}<br>
                      ${order.shippingAddress.address2 ? order.shippingAddress.address2 + '<br>' : ''}
                      ${order.shippingAddress.city} / ${order.shippingAddress.state}<br>
                      ${order.shippingAddress.postalCode} ${order.shippingAddress.country}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 15px; color: #6b7280; font-size: 14px;">
                Sorularınız için bizimle iletişime geçebilirsiniz:
              </p>
              <p style="margin: 0; font-size: 14px;">
                <a href="tel:+905389760902" style="color: #000069; text-decoration: none; font-weight: 600;">📞 0538 976 09 02</a>
                <span style="color: #d1d5db; margin: 0 10px;">|</span>
                <a href="mailto:info@hygieiatr.com" style="color: #000069; text-decoration: none; font-weight: 600;">✉️ info@hygieiatr.com</a>
              </p>
              <p style="margin: 20px 0 0; color: #9ca3af; font-size: 12px;">
                © 2025 Hygieia. Tüm hakları saklıdır.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Admin için yeni sipariş bildirimi e-postası
 */
export function generateAdminOrderNotification(order: OrderData): string {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">
        <strong>${item.name}</strong><br>
        <span style="font-size: 12px; color: #6b7280;">SKU: ${item.sku}</span>
      </td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatPrice(item.totalPrice)}</td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Yeni Sipariş - ${order.orderNumber}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">🚨 Yeni Sipariş Alındı!</h1>
            </td>
          </tr>

          <!-- Order Info -->
          <tr>
            <td style="padding: 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                <tr>
                  <td>
                    <div style="font-size: 14px; color: #92400e; font-weight: 600;">⚡ Acil İşlem Gerekiyor</div>
                    <div style="font-size: 12px; color: #78350f; margin-top: 5px;">Müşteriyle en kısa sürede iletişime geçin.</div>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                <tr>
                  <td>
                    <div style="font-size: 12px; color: #6b7280; margin-bottom: 5px;">Sipariş Numarası</div>
                    <div style="font-size: 20px; font-weight: 700; color: #dc2626; margin-bottom: 15px;">${order.orderNumber}</div>
                    <div style="font-size: 12px; color: #6b7280; margin-bottom: 5px;">Sipariş Tarihi</div>
                    <div style="font-size: 14px; font-weight: 600; color: #111827;">${formatDate(order.orderDate)}</div>
                  </td>
                </tr>
              </table>

              <!-- Customer Info -->
              <h3 style="margin: 0 0 15px; color: #111827; font-size: 16px;">👤 Müşteri Bilgileri</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                <tr>
                  <td>
                    <div style="margin-bottom: 10px;">
                      <strong style="color: #111827;">Ad Soyad:</strong> 
                      <span style="color: #6b7280;">${order.customer.name}</span>
                    </div>
                    <div style="margin-bottom: 10px;">
                      <strong style="color: #111827;">E-posta:</strong> 
                      <a href="mailto:${order.customer.email}" style="color: #2563eb; text-decoration: none;">${order.customer.email}</a>
                    </div>
                    <div style="margin-bottom: 10px;">
                      <strong style="color: #111827;">Telefon:</strong> 
                      <a href="tel:${order.customer.phone}" style="color: #2563eb; text-decoration: none;">${order.customer.phone}</a>
                    </div>
                    ${order.customer.company ? `
                    <div>
                      <strong style="color: #111827;">Firma:</strong> 
                      <span style="color: #6b7280;">${order.customer.company}</span>
                    </div>
                    ` : ''}
                  </td>
                </tr>
              </table>

              <!-- Order Items -->
              <h3 style="margin: 0 0 15px; color: #111827; font-size: 16px;">📦 Sipariş Ürünleri</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; margin-bottom: 20px;">
                <thead>
                  <tr style="background-color: #f9fafb;">
                    <th style="padding: 10px; text-align: left; font-size: 12px; color: #6b7280; font-weight: 600;">Ürün</th>
                    <th style="padding: 10px; text-align: center; font-size: 12px; color: #6b7280; font-weight: 600;">Adet</th>
                    <th style="padding: 10px; text-align: right; font-size: 12px; color: #6b7280; font-weight: 600;">Toplam</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <!-- Order Total -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 5px 0; color: #6b7280;">Ara Toplam:</td>
                  <td style="padding: 5px 0; text-align: right; font-weight: 600;">${formatPrice(order.subtotal)}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; color: #6b7280;">Kargo:</td>
                  <td style="padding: 5px 0; text-align: right; font-weight: 600;">${order.shippingCost === 0 ? 'Ücretsiz' : formatPrice(order.shippingCost)}</td>
                </tr>
                <tr style="border-top: 2px solid #e5e7eb;">
                  <td style="padding: 10px 0 0; font-size: 18px; font-weight: 700; color: #111827;">TOPLAM:</td>
                  <td style="padding: 10px 0 0; text-align: right; font-size: 18px; font-weight: 700; color: #dc2626;">${formatPrice(order.totalAmount)}</td>
                </tr>
              </table>

              <!-- Addresses -->
              <h3 style="margin: 0 0 15px; color: #111827; font-size: 16px;">📍 Adres Bilgileri</h3>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="48%" style="vertical-align: top; padding: 10px; background-color: #f9fafb; border-radius: 6px;">
                    <h4 style="margin: 0 0 8px; color: #111827; font-size: 13px; font-weight: 600;">Fatura Adresi:</h4>
                    <div style="font-size: 12px; color: #6b7280; line-height: 1.6;">
                      ${order.billingAddress.name}<br>
                      ${order.billingAddress.address1}<br>
                      ${order.billingAddress.address2 ? order.billingAddress.address2 + '<br>' : ''}
                      ${order.billingAddress.city} / ${order.billingAddress.state}<br>
                      ${order.billingAddress.postalCode}
                    </div>
                  </td>
                  <td width="4%"></td>
                  <td width="48%" style="vertical-align: top; padding: 10px; background-color: #f9fafb; border-radius: 6px;">
                    <h4 style="margin: 0 0 8px; color: #111827; font-size: 13px; font-weight: 600;">Teslimat Adresi:</h4>
                    <div style="font-size: 12px; color: #6b7280; line-height: 1.6;">
                      ${order.shippingAddress.name}<br>
                      ${order.shippingAddress.address1}<br>
                      ${order.shippingAddress.address2 ? order.shippingAddress.address2 + '<br>' : ''}
                      ${order.shippingAddress.city} / ${order.shippingAddress.state}<br>
                      ${order.shippingAddress.postalCode}
                    </div>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f3f4f6; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #6b7280; font-size: 12px;">
                Bu e-posta otomatik olarak gönderilmiştir.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

