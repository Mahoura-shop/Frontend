"use client"

import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, FolderTree, ChevronDown, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'

const categories = [
  { id: 1, name: 'مراقبت از پوست', productCount: 245, icon: '🧴', color: 'from-rose-gold to-warm-gold' },
  { id: 2, name: 'آرایش', productCount: 189, icon: '💄', color: 'from-deep-plum to-rose-gold' },
  { id: 3, name: 'عطر و ادکلن', productCount: 156, icon: '🌸', color: 'from-warm-gold to-deep-plum' },
  { id: 4, name: 'مراقبت از مو', productCount: 198, icon: '✨', color: 'from-rose-gold to-deep-plum' },
  { id: 5, name: 'محصولات ارگانیک', productCount: 87, icon: '🌿', color: 'from-green-400 to-emerald-600' },
  { id: 6, name: 'ضد آفتاب', productCount: 65, icon: '☀️', color: 'from-yellow-400 to-orange-500' },
]

export default function CategoriesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold gradient-text mb-2"
          >
            مدیریت دسته‌بندی‌ها
          </motion.h1>
          <p className="text-muted-foreground">
            مشاهده و مدیریت دسته‌بندی محصولات
          </p>
        </div>

        <div className="flex gap-3">
          <div className="flex gap-1 p-1 bg-muted rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              کارتی
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              لیستی
            </Button>
          </div>
          <Button variant="premium" className="gap-2">
            <Plus className="w-5 h-5" />
            افزودن دسته‌بندی
          </Button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: index * 0.1, type: "spring" }}
            >
              <Card className="group relative overflow-hidden hover-lift cursor-pointer border-2 border-transparent hover:border-primary/30 transition-all">
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                
                <div className="relative p-6">
                  <div className="flex items-start justify-between mb-4">
                    <motion.div
                      className="text-5xl"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {category.icon}
                    </motion.div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                  <Badge variant="secondary" className="mb-4">
                    {category.productCount} محصول
                  </Badge>

                  <Button
                    variant="outline"
                    className="w-full gap-2 group-hover:bg-primary/5"
                  >
                    مشاهده محصولات
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  </Button>
                </div>

                <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100" />
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="p-4 text-right font-semibold">دسته‌بندی</th>
                  <th className="p-4 text-right font-semibold">تعداد محصولات</th>
                  <th className="p-4 text-right font-semibold">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <motion.tr
                    key={category.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{category.icon}</div>
                        <div>
                          <p className="font-medium">{category.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary">{category.productCount} محصول</Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:bg-destructive/10 hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-gradient-premium">
              <FolderTree className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">مجموع دسته‌بندی</p>
              <p className="text-2xl font-bold">{categories.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-500">
              <FolderTree className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">فعال</p>
              <p className="text-2xl font-bold">{categories.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-orange-500">
              <FolderTree className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">میانگین محصولات</p>
              <p className="text-2xl font-bold">
                {Math.round(categories.reduce((sum, cat) => sum + cat.productCount, 0) / categories.length)}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
