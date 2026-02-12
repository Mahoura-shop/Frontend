# 🚀 Quick Start Guide - Mahoura Cosmetics

Get your luxury cosmetics e-commerce site running in minutes!

## ⚡ Fast Setup (3 Steps)

### 1. Install Dependencies
```bash
cd mahoura-cosmetics
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Open Browser
Navigate to: **http://localhost:3000**

That's it! Your site is now running! 🎉

---

## 📍 Important URLs

### Public Site
- **Home Page**: http://localhost:3000
- Features all animations, categories, products, newsletter

### Admin Panel
- **Login Page**: http://localhost:3000/admin/login
- **Dashboard**: http://localhost:3000/admin/dashboard (after login)

### Test Credentials
```
Email: admin@mahoura.com
Password: admin123
```

---

## 🎨 What You'll See

### Landing Page Features:
✅ Animated hero section with floating particles
✅ Category cards with 3D hover effects
✅ Featured products carousel
✅ New arrivals bento grid
✅ Newsletter subscription
✅ Fully responsive design
✅ RTL Persian layout
✅ Dark/Light theme support

### Admin Dashboard Features:
✅ Secure login with animations
✅ Stats cards with real-time updates
✅ Product management table
✅ Activity feed
✅ Charts and analytics
✅ Collapsible sidebar
✅ Responsive admin interface

---

## 🎯 Quick Navigation

The site includes:

### Public Navigation:
- محصولات (Products)
- دسته‌بندی‌ها (Categories)  
- برندها (Brands)
- تماس با ما (Contact)

### Admin Sidebar:
- داشبورد (Dashboard) - Current stats
- محصولات (Products) - Product management
- دسته‌بندی‌ها (Categories) - Category management
- برندها (Brands) - Brand management
- تنظیمات (Settings) - Configuration

---

## 🛠️ Common Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

## 🎬 Key Animations to Notice

1. **Hero Section** - Watch the text reveal word-by-word
2. **Category Cards** - Hover to see 3D tilt and glass effect
3. **Product Cards** - Hover for quick-view overlay
4. **Admin Stats** - Count-up animation when they load
5. **Newsletter** - Submit to see confetti celebration

---

## 📱 Responsive Testing

Try these viewport sizes:
- **Mobile**: 375px (iPhone)
- **Tablet**: 768px (iPad)
- **Desktop**: 1440px (Standard)

All animations adapt automatically!

---

## 🎨 Customization Quick Tips

### Change Colors:
Edit `tailwind.config.ts` - Look for:
- `primary-rose: '#D4A5A5'`
- `secondary-plum: '#6B4E71'`  
- `accent-gold: '#C9A875'`

### Change Font:
Edit `app/globals.css` - Change the Google Fonts URL

### Add Products:
Currently static data in components. See README.md for database setup.

---

## ❓ Troubleshooting

### Port Already in Use?
```bash
# Use different port
npm run dev -- -p 3001
```

### Styling Issues?
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### TypeScript Errors?
```bash
# Rebuild types
rm -rf node_modules
npm install
```

---

## 📚 Next Steps

1. ✅ Explore the landing page
2. ✅ Test admin login
3. ✅ Browse admin dashboard
4. ✅ Try theme toggle (dark/light)
5. ✅ Test responsive design (resize browser)
6. ✅ Read full README.md for detailed docs

---

## 🌟 Pro Tips

- **Desktop**: Hover effects are amazing!
- **Mobile**: Swipe gestures work on carousels
- **Admin**: Use keyboard shortcuts (Tab, Enter, Escape)
- **Animations**: Scroll slowly to see all effects
- **Theme**: Toggle dark mode in nav/admin header

---

## 🎯 File Structure at a Glance

```
mahoura-cosmetics/
├── app/
│   ├── page.tsx              ← Landing page (START HERE)
│   ├── admin/
│   │   ├── login/page.tsx    ← Admin login
│   │   └── dashboard/page.tsx ← Admin dashboard
├── components/ui/            ← Reusable components
├── README.md                 ← Full documentation
└── package.json              ← Dependencies
```

---

## 🎉 Enjoy!

You now have a fully-featured, beautifully animated luxury cosmetics e-commerce platform!

For detailed documentation, see README.md

For questions or issues, check the troubleshooting section above.

**Happy coding! ✨**
