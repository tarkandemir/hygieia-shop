# Hygieia E-Commerce Website 🛒

Modern, responsive e-commerce website for Hygieia - a Turkish wholesale distributor specializing in cleaning supplies, paper products, and office materials.

## 🚀 Features

- **Product Catalog**: Browse products by categories with search and filtering
- **Shopping Cart**: Add/remove items with quantity management
- **Order Management**: Complete checkout process with customer information
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **SEO Optimized**: Enhanced product descriptions and meta tags
- **Admin Integration**: Connected to admin panel for product management

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Lucide Icons
- **Database**: MongoDB with Mongoose ODM
- **State Management**: React Context API
- **Deployment**: Vercel ready

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/tarkandemir/hygieia-shop.git
cd hygieia-shop
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Edit `.env.local` with your MongoDB connection string and other required variables.

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

## 🌐 Environment Variables

Create a `.env.local` file with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── api/            # API routes
│   ├── cart/           # Shopping cart page
│   ├── checkout/       # Checkout process
│   ├── products/       # Product catalog
│   └── kategori/       # Category pages
├── components/         # Reusable UI components
├── contexts/          # React Context providers
├── hooks/             # Custom React hooks
├── lib/               # Utility functions and configs
├── models/            # MongoDB/Mongoose models
└── types/             # TypeScript type definitions
```

## 🚀 Deployment

The website is optimized for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Set up environment variables in Vercel dashboard
3. Deploy automatically on every push to main branch

## 🔧 Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📱 Features Overview

### Customer Features
- Browse products by category
- Search and filter products
- Product detail pages with image zoom
- Shopping cart management
- Secure checkout process
- Order confirmation

### Admin Integration
- Product management via admin panel
- Category management
- Order tracking
- Inventory management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary to Hygieia.

## 📞 Support

For support, email info@hygieia.com.tr or visit our [website](https://hygieia.com.tr).

---

Built with ❤️ by [Tarkan Demir](https://github.com/tarkandemir)