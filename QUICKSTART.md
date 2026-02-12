# 🚀 Mahoura Cosmetics - Quick Start Guide

## Overview
This is a complete Next.js application for a luxury cosmetics e-commerce platform with:
- ✨ Stunning animated landing page
- 🎨 Full admin panel with dashboard
- 🌙 Dark/Light theme support
- 🇮🇷 Persian (RTL) language support
- 📱 Fully responsive design

## Installation & Running

### 1. Extract the project
Unzip the `mahoura-cosmetics` folder to your desired location.

### 2. Install dependencies
\`\`\`bash
cd mahoura-cosmetics
npm install
\`\`\`

### 3. Run development server
\`\`\`bash
npm run dev
\`\`\`

### 4. Open in browser
Navigate to: http://localhost:3000

## Pages & Routes

### Public Pages
- **Home**: `/` - Landing page with all animated sections
  
### Admin Pages  
- **Login**: `/admin/login` - Admin login page (use any email/password for demo)
- **Dashboard**: `/admin/dashboard` - Main dashboard with stats
- **Products**: `/admin/products` - Products management
- **Categories**: `/admin/categories` - Categories management

## Key Features by Page

### Landing Page (/)
1. **Hero Section** - Animated gradient, parallax, floating particles
2. **Categories** - 4 main categories with hover effects
3. **Featured Products** - Product carousel with wishlist/quick view
4. **Brand Story** - Parallax section with animated stats
5. **New Arrivals** - Bento grid with NEW badges
6. **Newsletter** - Email signup with animations
7. **Footer** - Social links and sitemap

### Admin Dashboard (/admin/dashboard)
- 4 stat cards with animated numbers
- Product addition chart (7 days)
- Category distribution chart
- Recent activity feed
- All with beautiful animations

### Products Management (/admin/products)
- Data table with products
- Bulk selection and actions
- Search and filter functionality
- Individual product actions (view, edit, delete)
- Stock status badges
- Quick stats cards

### Categories Management (/admin/categories)
- Grid/List view toggle
- 6 categories with product counts
- Hover animations and effects
- Add/Edit/Delete actions
- Category stats

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Theme**: next-themes

## Customization Tips

### Change Colors
Edit `tailwind.config.js`:
\`\`\`javascript
colors: {
  'rose-gold': '#YOUR_COLOR',
  'deep-plum': '#YOUR_COLOR',
  'warm-gold': '#YOUR_COLOR',
}
\`\`\`

### Add New Pages
1. Create folder in `app/` directory
2. Add `page.tsx` file
3. Use admin layout by placing in `app/admin/`

### Modify Animations
Edit animation keyframes in `app/globals.css`

## Project Structure

\`\`\`
mahoura-cosmetics/
├── app/
│   ├── admin/              # Admin section
│   │   ├── dashboard/
│   │   ├── products/
│   │   ├── categories/
│   │   ├── login/
│   │   └── layout.tsx      # Admin sidebar layout
│   ├── page.tsx            # Landing page
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # shadcn components
│   └── theme-provider.tsx
├── lib/
│   └── utils.ts
└── package.json
\`\`\`

## Development Tips

### Run in Production Mode
\`\`\`bash
npm run build
npm start
\`\`\`

### Add New shadcn Components
The project includes Button, Card, Input, Badge, Label, Checkbox.
To add more, follow shadcn/ui documentation.

### Environment Variables
Create `.env.local` for API keys (when needed):
\`\`\`
NEXT_PUBLIC_API_URL=your_api_url
\`\`\`

## Next Steps

1. **Add Real Data**: Replace mock data with API calls
2. **Add Authentication**: Implement NextAuth.js or similar
3. **Add Database**: Connect to MongoDB, PostgreSQL, etc.
4. **Add Product CRUD**: Complete add/edit/delete functionality
5. **Add Image Upload**: Implement file upload for product images
6. **Add Shopping Cart**: Build cart and checkout flow

## Support & Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Framer Motion**: https://www.framer.com/motion/
- **shadcn/ui**: https://ui.shadcn.com

## Troubleshooting

### Port already in use
Change port in package.json:
\`\`\`json
"dev": "next dev -p 3001"
\`\`\`

### Hydration errors
Check for client-only components wrapped with `"use client"`

### Theme not working
Make sure ThemeProvider is in root layout

---

**Enjoy building with Mahoura! 🎨✨**

For questions: info@mahoura.com
