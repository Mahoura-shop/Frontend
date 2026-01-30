'use client';

import { motion } from 'framer-motion';
import { Heart, Award, Users, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';

export default function AboutPage() {
  const values = [
    { icon: Heart, title: 'کیفیت برتر', description: 'تمام محصولات ما با بالاترین استانداردهای کیفیتی تولید می‌شوند' },
    { icon: Award, title: 'تخصص و تجربه', description: 'بیش از ۱۰ سال تجربه در صنعت زیبایی و آرایشی' },
    { icon: Users, title: 'رضایت مشتری', description: 'بیش از ۱۰۰۰ مشتری راضی در سراسر کشور' },
    { icon: Sparkles, title: 'نوآوری مداوم', description: 'همیشه در حال ارائه جدیدترین و بهترین محصولات' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <div className="bg-gradient-to-r from-primary-rose/20 via-accent-gold/10 to-secondary-plum/20 py-24">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-6">درباره ماهورا</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                ماهورا با هدف ارائه بهترین محصولات آرایشی و بهداشتی لوکس به بازار ایران، فعالیت خود را آغاز کرده است.
              </p>
            </motion.div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-16">
          <div className="mb-16">
            <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl font-bold text-center mb-12 gradient-text">
              ارزش‌های ما
            </motion.h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, i) => (
                <motion.div key={value.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <Card className="h-full hover:shadow-xl transition-shadow">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-rose to-accent-gold flex items-center justify-center">
                        <value.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                      <p className="text-muted-foreground text-sm">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
