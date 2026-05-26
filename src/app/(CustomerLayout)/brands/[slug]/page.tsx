'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBrandStore } from '@/store/useBrandStore';

export default function BrandDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { brands, fetchBrands } = useBrandStore();

  useEffect(() => {
    if (brands.length === 0) fetchBrands();
  }, []);

  const brand = brands.find((b) => b.slug === slug);

  if (brands.length > 0 && !brand) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">برندی با این مشخصات یافت نشد</p>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-rose border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-primary-rose/20 via-accent-gold/10 to-secondary-plum/20 py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-6 text-center max-w-2xl mx-auto"
          >
            <div className="w-32 h-32 rounded-full bg-background shadow-lg flex items-center justify-center overflow-hidden border-4 border-white/30">
              {brand.brandPic ? (
                <Image
                  src={brand.brandPic}
                  alt={brand.name}
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-5xl font-bold text-muted-foreground">
                  {brand.name.charAt(0)}
                </span>
              )}
            </div>

            <div>
              <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-3">{brand.name}</h1>
              {brand.description && (
                <p className="text-lg text-muted-foreground leading-relaxed">{brand.description}</p>
              )}
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <Package className="w-5 h-5" />
              <span>{brand.count} محصول در این برند</span>
            </div>

            <Button
              size="lg"
              className="bg-gradient-to-r from-primary-rose to-accent-gold text-white rounded-full px-8 gap-2"
              onClick={() => router.push(`/products?brand=${brand.id}`)}
            >
              مشاهده محصولات
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
