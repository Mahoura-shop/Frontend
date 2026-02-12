# 📦 Installation Guide for Existing Project

## Your Current Project Structure
```
D:\programming\Mahoura\Frontend\
├── src/
│   ├── app/          ← Your existing app directory
│   ├── components/   ← Your existing components
│   ├── hooks/        ← Your existing hooks
│   ├── lib/          ← Your existing lib
│   ├── services/     ← Your existing services
│   ├── store/        ← Your existing store
│   ├── types/        ← Your existing types
│   └── utils/        ← Your existing utils
└── [config files]
```

## 🎯 Installation Steps

### Step 1: Extract Mahoura Files
Extract the ZIP file to a temporary location first.

### Step 2: Copy Files to Your Project
Copy the extracted files into your existing project:

```bash
# From the extracted mahoura-cosmetics folder, copy:

# 1. Copy app files (merge with your existing app)
cp -r src/app/* D:/programming/Mahoura/Frontend/src/app/

# 2. Copy components (merge with your existing components)
cp -r src/components/* D:/programming/Mahoura/Frontend/src/components/

# 3. Copy lib files (merge with your existing lib)
cp -r src/lib/* D:/programming/Mahoura/Frontend/src/lib/

# 4. Copy config files (ONLY if you want to replace them)
# ⚠️ CAREFUL - This will overwrite your existing configs!
# Review first: globals.css, tailwind.config.ts
```

### Step 3: Update Dependencies
Add these to your existing `package.json`:

```json
{
  "dependencies": {
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-checkbox": "^1.0.4",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-separator": "^1.0.3",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-switch": "^1.0.3",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "latest",
    "recharts": "^2.10.0",
    "sonner": "^1.3.1",
    "tailwind-merge": "^2.2.0",
    "tailwindcss-animate": "^1.0.7"
  }
}
```

Then run:
```bash
npm install
```

### Step 4: Merge CSS Files
Add Mahoura styles to your existing `src/app/globals.css`:

**From the Mahoura globals.css, copy:**
1. The Vazirmatn font import
2. The custom CSS variables (`:root` and `.dark` sections)
3. The utility classes (`.glass`, `.shimmer`, `.gradient-text`, etc.)
4. The animation keyframes

**⚠️ Important:** Don't delete your existing styles, just add the Mahoura styles.

### Step 5: Update Tailwind Config
Merge the Mahoura colors into your `tailwind.config.ts`:

Add these to your theme.extend.colors:
```typescript
colors: {
  // ... your existing colors
  primary: {
    rose: "#D4A5A5",
  },
  secondary: {
    plum: "#6B4E71",
  },
  accent: {
    gold: "#C9A875",
  },
  neutral: {
    warm: "#F8F6F4",
    cream: "#E8E6E3",
  },
}
```

Add these animations:
```typescript
keyframes: {
  "float": {
    "0%, 100%": { transform: "translateY(0px)" },
    "50%": { transform: "translateY(-10px)" },
  },
  "shimmer": {
    "0%": { backgroundPosition: "-200% center" },
    "100%": { backgroundPosition: "200% center" },
  },
}
```

### Step 6: Verify Import Paths
All imports use `@/` prefix which maps to your `src/` directory:
- `@/components/ui/button` → `src/components/ui/button`
- `@/lib/utils` → `src/lib/utils`

Your `tsconfig.json` should have:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 📁 What Gets Added

### New Files:
```
src/
├── app/
│   ├── page.tsx (NEW - Landing page)
│   ├── globals.css (MERGE with yours)
│   └── admin/
│       ├── login/page.tsx (NEW)
│       └── dashboard/page.tsx (NEW)
├── components/
│   └── ui/
│       ├── button.tsx (NEW)
│       ├── card.tsx (NEW)
│       ├── input.tsx (NEW)
│       ├── badge.tsx (NEW)
│       └── table.tsx (NEW)
└── lib/
    └── utils.ts (NEW or MERGE)
```

## 🚀 Run Your Project

```bash
cd D:/programming/Mahoura/Frontend
npm install
npm run dev
```

## 🎯 Access Points

- **Landing Page**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login
  - Email: `admin@mahoura.com`
  - Password: `admin123`
- **Admin Dashboard**: http://localhost:3000/admin/dashboard

## ⚠️ Important Notes

1. **Backup First!** - Make a backup of your project before copying files
2. **Review Conflicts** - If you have existing `page.tsx` in app/, decide which to keep
3. **Merge Carefully** - Don't overwrite your existing globals.css and tailwind.config
4. **Test Imports** - Make sure all `@/` imports resolve correctly
5. **Check Routes** - Ensure the new routes don't conflict with your existing ones

## 🔧 Troubleshooting

### Import Errors?
Make sure your `tsconfig.json` has the correct path mapping:
```json
"paths": {
  "@/*": ["./src/*"]
}
```

### Styling Not Working?
1. Check that globals.css is imported in your root layout
2. Verify Tailwind config points to `src/**/*.tsx`
3. Make sure you merged the CSS variables

### Component Not Found?
Check that the component is in `src/components/ui/` directory

## 📝 Next Steps

After installation:
1. Test the landing page at `/`
2. Test admin login at `/admin/login`
3. Customize colors in `tailwind.config.ts`
4. Add your own content to replace sample data
5. Connect to your backend API

Need help? Check README.md for full documentation!
