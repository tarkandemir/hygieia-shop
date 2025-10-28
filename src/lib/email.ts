import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

// SMTP ayarları environment variable'lardan veya default değerlerden gelir
const SMTP_HOST = process.env.SMTP_HOST || 'smtp-mail.outlook.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER || 'noreply@hygieiatr.com';
const SMTP_PASSWORD = process.env.SMTP_PASSWORD || 'Fed*55600!';
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@hygieiatr.com';
const FROM_NAME = process.env.FROM_NAME || 'Hygieia';

// Admin e-posta adresleri (virgülle ayrılmış)
// Örnek: "admin1@domain.com,admin2@domain.com,admin3@domain.com"
const ADMIN_EMAILS_RAW = process.env.ADMIN_EMAIL || 'info@hygieiatr.com';
export const ADMIN_EMAILS = ADMIN_EMAILS_RAW.split(',').map(email => email.trim()).filter(email => email.length > 0);

// Nodemailer transporter oluştur
const createTransporter = () => {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false, // 587 için false (STARTTLS)
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
    tls: {
      ciphers: 'SSLv3',
      rejectUnauthorized: false,
    },
  });
};

/**
 * E-posta gönder
 */
export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const transporter = createTransporter();

    const info = await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to,
      subject,
      html,
    });

    console.log('✅ E-posta gönderildi:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ E-posta gönderme hatası:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Bilinmeyen hata' };
  }
}

/**
 * Birden fazla e-posta gönder
 */
export async function sendBulkEmails(emails: EmailOptions[]) {
  const results = await Promise.allSettled(
    emails.map(email => sendEmail(email))
  );

  return results.map((result, index) => ({
    to: emails[index].to,
    success: result.status === 'fulfilled' && result.value.success,
    error: result.status === 'rejected' ? result.reason : undefined,
  }));
}

