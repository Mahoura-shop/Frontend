"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, Plus, Pencil, Trash2, Eye, Filter, ArrowUpDown,
  MoreVertical, Package, Download
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Mock data
const products = [
  { id: 1, name: 'کرم شب آبرسان', brand: 'La Mer', category: 'مراقبت از پوست', price: '۲,۵۰۰,۰۰۰', stock: 'موجود', image: '🧴' },
  { id: 2, name: 'رژ لب مات', brand: 'Dior', category: 'آرایش', price: '۱,۸۰۰,۰۰۰', stock: 'موجود', image: '💄' },
  { id: 3, name: 'عطر زنانه', brand: 'Chanel', category: 'عطر و ادکلن', price: '۳,۲۰۰,۰۰۰', stock: 'ناموجود', image: '🌸' },
  { id: 4, name: 'سرم ویتامین C', brand: 'SkinCeuticals', category: 'مراقبت از پوست', price: '۱,۲۰۰,۰۰۰', stock: 'موجود', image: '✨' },
  { id: 5, name: 'ماسک صورت', brand: 'Fresh', category: 'مراقبت از پوست', price: '۹۵۰,۰۰۰', stock: 'موجود', image: '🎭' },
]

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProducts, setSelectedProducts] = useState<number[]>([])

  const toggleProduct = (id: number) => {
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    setSelectedProducts(prev =>
      prev.length === products.length ? [] : products.map(p => p.id)
    )
  }

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
            مدیریت محصولات
          </motion.h1>
          <p className="text-muted-foreground">
            مشاهده و مدیریت تمامی محصولات
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Button variant="premium" className="gap-2">
            <Plus className="w-5 h-5" />
            افزودن محصول
          </Button>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="جستجوی محصولات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
          <Button variant="outline" className="gap-2 md:w-auto">
            <Filter className="w-4 h-4" />
            فیلتر
          </Button>
          <Button variant="outline" className="gap-2 md:w-auto">
            <ArrowUpDown className="w-4 h-4" />
            مرتب‌سازی
          </Button>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-4 rounded-lg border-2 border-primary/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {selectedProducts.length} محصول انتخاب شده
            </span>
            <div className="flex gap-2">
              <Button variant="destructive" size="sm" className="gap-2">
                <Trash2 className="w-4 h-4" />
                حذف
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                خروجی Excel
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Products Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="p-4 text-right">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === products.length}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded border-primary"
                  />
                </th>
                <th className="p-4 text-right font-semibold">محصول</th>
                <th className="p-4 text-right font-semibold">برند</th>
                <th className="p-4 text-right font-semibold">دسته‌بندی</th>
                <th className="p-4 text-right font-semibold">قیمت</th>
                <th className="p-4 text-right font-semibold">وضعیت</th>
                <th className="p-4 text-right font-semibold">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b hover:bg-muted/30 transition-colors"
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => toggleProduct(product.id)}
                      className="w-4 h-4 rounded border-primary"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-mesh flex items-center justify-center text-2xl">
                        {product.image}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant="secondary">{product.brand}</Badge>
                  </td>
                  <td className="p-4 text-muted-foreground">{product.category}</td>
                  <td className="p-4 font-medium">{product.price} تومان</td>
                  <td className="p-4">
                    <Badge variant={product.stock === 'موجود' ? 'default' : 'destructive'}>
                      {product.stock}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                        <Eye className="w-4 h-4" />
                      </Button>
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

        {/* Pagination */}
        <div className="p-4 border-t flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            نمایش ۱ تا ۵ از ۵ محصول
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              قبلی
            </Button>
            <Button variant="outline" size="sm">
              بعدی
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Package className="w-10 h-10 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">مجموع محصولات</p>
              <p className="text-2xl font-bold">۱,۲۳۴</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Package className="w-10 h-10 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">موجود</p>
              <p className="text-2xl font-bold">۱,۲۱۱</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Package className="w-10 h-10 text-destructive" />
            <div>
              <p className="text-sm text-muted-foreground">ناموجود</p>
              <p className="text-2xl font-bold">۲۳</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
