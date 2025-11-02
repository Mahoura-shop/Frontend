'use client';

import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { useProductStore } from "../lib/store";
import { useTranslation } from "../hooks/useTranslation";

interface LandingPageProps {
  onNavigate: (page: string) => void;
  onViewProduct: (id: string) => void;
}

export function LandingPage({ onNavigate, onViewProduct }: LandingPageProps) {
  const { products } = useProductStore();
  const { t, language } = useTranslation();
  const featuredProducts = products.slice(0, 4);

  const formatPrice = (price: number) => {
    if (language === 'fa') {
      return `${price.toLocaleString('fa-IR')} ${t('currency')}`;
    }
    return `${t('currency')}${(price / 30000).toFixed(2)}`;
  };

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-muted/30 to-secondary/20 py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 
            className="mb-4 text-primary"
            style={{ 
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)'
            }}
          >
            {t('heroTitle')}
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
            {t('heroSubtitle')}
          </p>
          <Button 
            size="lg"
            onClick={() => onNavigate('products')}
            className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
          >
            {t('exploreProducts')}
          </Button>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 
              className="mb-2 text-primary"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {t('featuredCollection')}
            </h2>
            <p className="text-muted-foreground">{t('featuredSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <Card 
                key={product.id}
                className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg"
                onClick={() => onViewProduct(product.id)}
              >
                <div className="aspect-square overflow-hidden bg-muted">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="mb-2 line-clamp-1">{product.name}</h3>
                  <Badge variant="secondary" className="mb-2">
                    {product.category}
                  </Badge>
                  <p className="text-primary">{formatPrice(product.price)}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => onNavigate('products')}
            >
              {t('viewDetails')}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>{t('copyright')}</p>
          <div className="mt-4 flex justify-center gap-6">
            <a href="#" className="hover:text-primary">{t('aboutUs')}</a>
            <a href="#" className="hover:text-primary">{t('contact')}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
