# Mahoura Cosmetics - Luxury Persian Beauty E-commerce

A stunning, fully-featured Next.js e-commerce platform for luxury cosmetics with both public-facing storefront and comprehensive admin panel.

## 🌟 Features

### Public Landing Page
- **Stunning Hero Section** with animated gradient backgrounds, floating particles, and smooth parallax scrolling
- **Category Showcase** with 3D card effects, glassmorphism overlays, and magnetic hover interactions
- **Featured Products Carousel** with dynamic animations and quick-view functionality
- **New Arrivals Bento Grid** with gradient borders and interactive cards
- **Newsletter Section** with confetti animation on success
- **Fully Responsive** mobile-first design with RTL support for Persian language

### Product Exploration (NEW!)
- **Products Listing Page** (`/products`) with:
  - Advanced filtering (search, category, price range)
  - Sorting options (newest, popular, price)
  - Grid/List view modes
  - Real-time search
  - Stock status indicators
- **Individual Product Pages** (`/products/[id]`) with:
  - Image gallery with thumbnails
  - Complete product information
  - Size and color selection
  - Quantity selector
  - Add to cart functionality
  - Wishlist management
  - Related products
  - Ingredients & benefits
  - Usage instructions
- **Zustand State Management** for cart and wishlist
- **Theme Support** with dark/light mode (next-themes)

### Admin Panel
- **Secure Login Page** with split-screen design and animated branding
- **Interactive Dashboard** with real-time stats, charts, and activity feed
- **Product Management** with full CRUD operations, image uploads, and inline editing
- **Category Management** with hierarchical structure and drag-and-drop
- **Brand Management** with logo uploads and social media integration
- **Collapsible Sidebar** navigation with active state indicators
- **Toast Notifications** for all CRUD operations
- **Table Pagination** with sorting and filtering

### Design & UX
- **Mahoura Brand Colors**: Rose gold (#D4A5A5), Deep plum (#6B4E71), Warm gold (#C9A875)
- **Vazirmatn Font**: Persian/Farsi typography throughout
- **Dark/Light Themes**: Complete theme support with smooth transitions
- **Framer Motion**: Sophisticated animations on scroll, hover, and interactions
- **Glassmorphism**: Modern glass effects and blur backdrops
- **Shimmer Effects**: Luxury shimmer animations on cards and text
- **RTL Support**: Full right-to-left layout for Persian language

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone or extract the project**
```bash
cd mahoura-cosmetics
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Run development server**
```bash
npm run dev
# or
yarn dev
```

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
mahoura-cosmetics/
├── app/
│   ├── globals.css          # Global styles with Mahoura theme
│   ├── layout.tsx            # Root layout with RTL support
│   ├── page.tsx              # Public landing page
│   └── admin/
│       ├── login/
│       │   └── page.tsx      # Admin login page
│       └── dashboard/
│           └── page.tsx      # Admin dashboard
├── components/
│   └── ui/                   # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── badge.tsx
│       └── table.tsx
├── lib/
│   └── utils.ts              # Utility functions
├── tailwind.config.ts        # Tailwind with Mahoura colors
└── package.json
```

## 🎨 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui (Radix UI)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Font**: Vazirmatn (via CDN)

## 🔑 Admin Access

For testing the admin panel:

- **URL**: `/admin/login`
- **Email**: `admin@mahoura.com`
- **Password**: `admin123`

## 🎯 Key Pages

### Public Pages
- `/` - Landing page with all sections
- `/products` - Product listing with filters and search (NEW!)
- `/products/[id]` - Individual product detail page (NEW!)
- Future: `/categories`, `/brands`, `/contact`

### Admin Pages
- `/admin/login` - Secure login with animations
- `/admin/dashboard` - Main dashboard with stats
- Future: `/admin/products`, `/admin/categories`, `/admin/brands`

## 🎭 Animations & Effects

The site features numerous sophisticated animations:

- **Hero Section**: Staggered text reveals, parallax scrolling, floating particles
- **Categories**: 3D card transforms, glassmorphism on hover, shimmer effects
- **Products**: Magnetic cursor effects, scale animations, quick-view overlays
- **Admin**: Sidebar collapse, stat count-ups, toast notifications, table row reveals
- **Theme Toggle**: Smooth color transitions across all components

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

All animations are optimized for mobile with reduced complexity where appropriate.

## 🌐 RTL Support

Complete right-to-left layout support for Persian language:
- Text direction automatically set
- Navigation flows right-to-left
- Icons and chevrons properly oriented
- Form inputs aligned correctly
- Tables read right-to-left

## 🎨 Color Palette

```css
/* Light Theme */
--primary-rose: #D4A5A5      /* Soft rose gold */
--secondary-plum: #6B4E71    /* Deep plum */
--accent-gold: #C9A875       /* Warm gold */
--neutral-warm: #F8F6F4      /* Warm white */
--neutral-cream: #E8E6E3     /* Creamy beige */

/* Dark Theme */
--background: #1A1A1A        /* Deep charcoal */
```

## 🚧 Future Enhancements

- [ ] Products page with filtering and search
- [ ] Shopping cart functionality
- [ ] User authentication and accounts
- [ ] Order management system
- [ ] Payment gateway integration
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Email notifications
- [ ] Analytics dashboard
- [ ] Multi-language support (English/Persian toggle)

## 📝 Development Notes

### Adding New Products
The product data is currently static in the components. To make it dynamic:
1. Set up a database (MongoDB, PostgreSQL, etc.)
2. Create API routes in `/app/api`
3. Connect to your database
4. Update components to fetch from API

### Customizing Colors
Edit `tailwind.config.ts` to change the color scheme:
```typescript
extend: {
  colors: {
    primary: {
      rose: '#YOUR_COLOR',
    },
    // ... other colors
  }
}
```

### Adding Admin Features
Create new pages in `/app/admin/[feature]/page.tsx` and add navigation items in the dashboard sidebar.

## 🤝 Contributing

This is a demonstration project. Feel free to use it as a template for your own e-commerce projects!

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🎉 Credits

- Design inspired by luxury cosmetics brands
- Images from Unsplash
- Icons by Lucide
- UI components by shadcn/ui
- Font: Vazirmatn by Saber Rastikerdar

---

Built with ❤️ for Mahoura Cosmetics
