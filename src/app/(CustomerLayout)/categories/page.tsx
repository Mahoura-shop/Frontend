'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useCategoryStore } from '@/store/useCategoryStore';

export default function CategoriesPage() {
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, []);

  const activeCategories = categories.filter((c) => c.isActive);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-primary-rose/20 via-accent-gold/10 to-secondary-plum/20 py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-6">دسته‌بندی‌ها</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              مجموعه دسته‌بندی‌های محصولات موجود در فروشگاه ماهورا
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {activeCategories.length === 0 ? (
          <p className="text-center text-muted-foreground">دسته‌بندی‌ای یافت نشد</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {activeCategories.map((category, i) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/products?category=${category.id}`}>
                  <Card className="h-full hover:shadow-xl transition-shadow cursor-pointer group">
                    <CardContent className="p-6 flex flex-col items-center gap-3">
                      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center overflow-hidden group-hover:ring-2 ring-primary-rose transition-all">
                        {category.categoryPic ? (
                          <Image
                            src={category.categoryPic}
                            alt={category.name}
                            width={80}
                            height={80}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <span className="text-2xl font-bold text-muted-foreground">
                            {category.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-center leading-tight">{category.name}</h3>
                      {category.description && (
                        <p className="text-xs text-muted-foreground text-center line-clamp-2">
                          {category.description}
                        </p>
                      )}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Package className="w-3 h-3" />
                        <span>{category.count} محصول</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
