# 📋 Manual Copy Guide for Windows

## 🎯 Quick Copy Instructions

### Files to Copy from Extracted Folder → Your Project

#### 1️⃣ Copy Landing Page
```
FROM: mahoura-cosmetics\src\app\page.tsx
TO:   D:\programming\Mahoura\Frontend\src\app\page.tsx
```

#### 2️⃣ Copy Admin Pages
```
FROM: mahoura-cosmetics\src\app\admin\
TO:   D:\programming\Mahoura\Frontend\src\app\admin\
```
This includes:
- `admin\login\page.tsx`
- `admin\dashboard\page.tsx`
- `admin\layout.tsx`

#### 3️⃣ Copy UI Components
```
FROM: mahoura-cosmetics\src\components\ui\
TO:   D:\programming\Mahoura\Frontend\src\components\ui\
```
This includes:
- `button.tsx`
- `card.tsx`
- `input.tsx`
- `badge.tsx`
- `table.tsx`

#### 4️⃣ Copy Utils
```
FROM: mahoura-cosmetics\src\lib\utils.ts
TO:   D:\programming\Mahoura\Frontend\src\lib\utils.ts
```

## ⚙️ Configuration Files to Merge

### ⚠️ DON'T JUST OVERWRITE - MERGE THESE! ⚠️

#### globals.css
**Location:** `src\app\globals.css`

**Add these sections to your existing file:**

1. At the top:
```css
@import url('https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css');
```

2. In `:root` section, add:
```css
--font-vazirmatn: 'Vazirmatn', sans-serif;
/* Add all the Mahoura color variables */
```

3. Add utility classes:
```css
.glass { /* glassmorphism */ }
.shimmer { /* shimmer effect */ }
.gradient-text { /* gradient text */ }
```

4. Add animations:
```css
@keyframes fadeInUp { /* ... */ }
@keyframes fadeInScale { /* ... */ }
```

#### tailwind.config.ts
**Location:** `tailwind.config.ts`

**Merge these into your existing config:**

1. Update `content` array:
```typescript
content: [
  './src/pages/**/*.{ts,tsx}',
  './src/components/**/*.{ts,tsx}',
  './src/app/**/*.{ts,tsx}',
],
```

2. Add to `theme.extend.colors`:
```typescript
primary: {
  rose: "#D4A5A5",
},
secondary: {
  plum: "#6B4E71",
},
accent: {
  gold: "#C9A875",
},
```

3. Add to `theme.extend.keyframes`:
```typescript
"float": { /* ... */ },
"shimmer": { /* ... */ },
"pulse-glow": { /* ... */ },
```

## 📦 Update package.json

**Add these dependencies to your existing `package.json`:**

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
    "tailwind-merge": "^2.2.0",
    "tailwindcss-animate": "^1.0.7"
  }
}
```

## 🚀 After Copying Files

### Step 1: Install Dependencies
```bash
cd D:\programming\Mahoura\Frontend
npm install
```

### Step 2: Start Dev Server
```bash
npm run dev
```

### Step 3: Test Your Site
- Landing page: http://localhost:3000
- Admin login: http://localhost:3000/admin/login
  - Email: `admin@mahoura.com`
  - Password: `admin123`

## ✅ Checklist

- [ ] Copied `src/app/page.tsx`
- [ ] Copied `src/app/admin/` folder
- [ ] Copied `src/components/ui/` folder
- [ ] Copied `src/lib/utils.ts`
- [ ] Merged `globals.css` (added Mahoura styles)
- [ ] Merged `tailwind.config.ts` (added colors & animations)
- [ ] Updated `package.json` (added dependencies)
- [ ] Ran `npm install`
- [ ] Verified `tsconfig.json` has `"@/*": ["./src/*"]`
- [ ] Tested landing page
- [ ] Tested admin pages

## 🔍 File Structure After Copy

```
D:\programming\Mahoura\Frontend\
├── src/
│   ├── app/
│   │   ├── page.tsx              ← NEW Mahoura landing page
│   │   ├── globals.css           ← MERGED with Mahoura styles
│   │   ├── layout.tsx            ← Your existing layout
│   │   └── admin/                ← NEW Mahoura admin
│   │       ├── login/page.tsx
│   │       ├── dashboard/page.tsx
│   │       └── layout.tsx
│   ├── components/
│   │   ├── ui/                   ← NEW Mahoura UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── badge.tsx
│   │   │   └── table.tsx
│   │   └── [your existing components]
│   ├── lib/
│   │   ├── utils.ts              ← NEW Mahoura utils
│   │   └── [your existing lib files]
│   ├── hooks/                    ← Your existing hooks
│   ├── services/                 ← Your existing services
│   ├── store/                    ← Your existing store
│   ├── types/                    ← Your existing types
│   └── utils/                    ← Your existing utils
├── tailwind.config.ts            ← MERGED with Mahoura config
├── tsconfig.json                 ← Should already be correct
└── package.json                  ← UPDATED with new dependencies
```

## 💡 Tips

1. **Use a diff tool** like WinMerge to compare config files before merging
2. **Keep backups** of your original files before merging
3. **Test incrementally** - copy files in groups and test after each group
4. **Check console** for any import errors after copying

## ❓ Troubleshooting

### "Cannot find module '@/components/ui/button'"
- Check that files are in `src/components/ui/`
- Verify `tsconfig.json` has correct path mapping

### Styles not working
- Make sure you merged `globals.css` properly
- Check that `tailwind.config.ts` includes `src/**/*.tsx` in content array
- Restart dev server after config changes

### Dependency errors
- Run `npm install --legacy-peer-deps` if there are conflicts
- Make sure all dependencies from package.json are added

Need more help? See INSTALLATION.md for detailed instructions!
