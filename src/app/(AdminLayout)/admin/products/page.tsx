'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, Pencil, Trash2, Search, ArrowUpDown, ArrowUp, ArrowDown, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ImageCropModal from '@/components/admin/ImageCropModal';
import { toast } from 'sonner';
import { useSettingsStore } from '@/store/useSettingsStore';

interface Product {
  id: number;
  name: string;
  slug: string;
  brand: string;
  category: string;
  price: number;
  currencyCode: string;
  quantity: number;
  quantityType: string;
  isActive: boolean;
  isNew: boolean;
  productPic: string | null;
}

type SortColumn = 'name' | 'brand' | 'category' | 'price' | 'quantity' | null;
type SortDirection = 'asc' | 'desc';

export default function ProductsAdminPage() {
  const { convertToIRR, formatPrice } = useSettingsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filterColumn, setFilterColumn] = useState<string>('');
  const [filterValue, setFilterValue] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    price: '',
    currency: 'IRR',
    quantity: '',
    quantityType: 'pieces',
  });
  const itemsPerPage = 10;

  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'رژ لب مات شماره ۱', slug: 'matte-lipstick-1', brand: 'Mahoura', category: 'آرایش صورت', price: 299000, currencyCode: 'IRR', quantity: 45, quantityType: 'pieces', isActive: true, isNew: true, productPic: null },
    { id: 2, name: 'سرم ویتامین C', slug: 'vitamin-c-serum', brand: 'Mahoura Care', category: 'مراقبت از پوست', price: 450000, currencyCode: 'IRR', quantity: 32, quantityType: 'ml', isActive: true, isNew: true, productPic: null },
    { id: 3, name: 'پالت سایه چشم', slug: 'eyeshadow-palette', brand: 'Mahoura Pro', category: 'آرایش چشم', price: 350000, currencyCode: 'IRR', quantity: 0, quantityType: 'pieces', isActive: false, isNew: false, productPic: null },
    { id: 4, name: 'کرم ضد آفتاب', slug: 'sunscreen-cream', brand: 'Mahoura Care', category: 'مراقبت از پوست', price: 380000, currencyCode: 'IRR', quantity: 60, quantityType: 'ml', isActive: true, isNew: false, productPic: null },
    { id: 5, name: 'ماسکارا حجم دهنده', slug: 'volumizing-mascara', brand: 'Mahoura', category: 'آرایش چشم', price: 280000, currencyCode: 'IRR', quantity: 78, quantityType: 'pieces', isActive: true, isNew: true, productPic: null },
  ]);

  // Filtering
  let filteredProducts = [...products];

  if (searchQuery) {
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (filterColumn && filterValue) {
    filteredProducts = filteredProducts.filter(p => {
      const value = p[filterColumn as keyof Product];
      return String(value).toLowerCase().includes(filterValue.toLowerCase());
    });
  }

  // Sorting
  if (sortColumn) {
    filteredProducts.sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' 
          ? aVal.localeCompare(bVal, 'fa')
          : bVal.localeCompare(aVal, 'fa');
      }
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      return 0;
    });
  }

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const activeCount = products.filter(p => p.isActive).length;
  const inactiveCount = products.filter(p => !p.isActive).length;

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ column }: { column: SortColumn }) => {
    if (sortColumn !== column) return <ArrowUpDown className="w-4 h-4 opacity-50" />;
    return sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
  };

  const handleDelete = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
    toast.success('محصول با موفقیت حذف شد');
  };

  const getFilterOptions = () => {
    if (!filterColumn) return [];
    const uniqueValues = new Set(products.map(p => String(p[filterColumn as keyof Product])));
    return Array.from(uniqueValues);
  };

  const handleAddProduct = () => {
    const priceInIRR = formData.currency === 'IRR' 
      ? parseFloat(formData.price)
      : convertToIRR(parseFloat(formData.price), formData.currency);

    const newProduct: Product = {
      id: products.length + 1,
      name: formData.name,
      slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
      brand: formData.brand,
      category: formData.category,
      price: priceInIRR,
      currencyCode: 'IRR',
      quantity: parseInt(formData.quantity),
      quantityType: formData.quantityType,
      isActive: true,
      isNew: true,
      productPic: selectedImage,
    };

    setProducts([...products, newProduct]);
    toast.success('محصول با موفقیت اضافه شد');
    setShowAddModal(false);
    setFormData({
      name: '',
      brand: '',
      category: '',
      price: '',
      currency: 'IRR',
      quantity: '',
      quantityType: 'pieces',
    });
    setSelectedImage(null);
  };

  return (
    <main className="p-6">
      {/* Header with Counts */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">مدیریت محصولات</h1>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">
            مجموع: <span className="font-bold text-foreground">{products.length}</span>
          </span>
          <span className="text-muted-foreground">
            فعال: <span className="font-bold text-green-600">{activeCount}</span>
          </span>
          <span className="text-muted-foreground">
            غیرفعال: <span className="font-bold text-red-600">{inactiveCount}</span>
          </span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-4 flex-1 max-w-3xl flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="جستجوی محصول..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>

          {/* Two-Step Filter */}
          <Select value={filterColumn} onValueChange={(val) => { setFilterColumn(val); setFilterValue(''); }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="انتخاب فیلتر" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">نام محصول</SelectItem>
              <SelectItem value="brand">برند</SelectItem>
              <SelectItem value="category">دسته‌بندی</SelectItem>
            </SelectContent>
          </Select>

          {filterColumn && (
            <Select value={filterValue} onValueChange={setFilterValue}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="انتخاب مقدار" />
              </SelectTrigger>
              <SelectContent>
                {getFilterOptions().map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {(filterColumn || searchQuery) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setFilterColumn('');
                setFilterValue('');
              }}
            >
              پاک کردن فیلترها
            </Button>
          )}
        </div>

        <Button className="gap-2" onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4" />
          افزودن محصول
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort('name')} className="gap-2 hover:bg-transparent">
                    نام محصول
                    <SortIcon column="name" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort('brand')} className="gap-2 hover:bg-transparent">
                    برند
                    <SortIcon column="brand" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort('category')} className="gap-2 hover:bg-transparent">
                    دسته‌بندی
                    <SortIcon column="category" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort('price')} className="gap-2 hover:bg-transparent">
                    قیمت (ریال)
                    <SortIcon column="price" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort('quantity')} className="gap-2 hover:bg-transparent">
                    موجودی
                    <SortIcon column="quantity" />
                  </Button>
                </TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead className="text-center">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProducts.map((product, i) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group hover:bg-muted/50"
                >
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="font-bold gradient-text">
                    {formatPrice(product.price)}
                  </TableCell>
                  <TableCell>
                    <span className={product.quantity === 0 ? 'text-red-500' : ''}>
                      {product.quantity} {product.quantityType}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.isActive ? 'available' : 'outOfStock'}>
                      {product.isActive ? 'فعال' : 'غیرفعال'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Add/Edit Product Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>افزودن محصول جدید</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>نام محصول</Label>
                <Input 
                  placeholder="نام محصول" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>برند</Label>
                <Select value={formData.brand} onValueChange={(val) => setFormData({...formData, brand: val})}>
                  <SelectTrigger><SelectValue placeholder="انتخاب برند" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mahoura">Mahoura</SelectItem>
                    <SelectItem value="Mahoura Care">Mahoura Care</SelectItem>
                    <SelectItem value="Mahoura Pro">Mahoura Pro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>دسته‌بندی</Label>
                <Select value={formData.category} onValueChange={(val) => setFormData({...formData, category: val})}>
                  <SelectTrigger><SelectValue placeholder="انتخاب دسته" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="آرایش صورت">آرایش صورت</SelectItem>
                    <SelectItem value="مراقبت از پوست">مراقبت از پوست</SelectItem>
                    <SelectItem value="آرایش چشم">آرایش چشم</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>نوع واحد</Label>
                <Select value={formData.quantityType} onValueChange={(val) => setFormData({...formData, quantityType: val})}>
                  <SelectTrigger><SelectValue placeholder="نوع واحد" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pieces">عدد</SelectItem>
                    <SelectItem value="ml">میلی‌لیتر</SelectItem>
                    <SelectItem value="g">گرم</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>قیمت</Label>
                <Input 
                  type="number" 
                  placeholder="قیمت"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>ارز</Label>
                <Select value={formData.currency} onValueChange={(val) => setFormData({...formData, currency: val})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IRR">ریال</SelectItem>
                    <SelectItem value="USD">دلار</SelectItem>
                    <SelectItem value="EUR">یورو</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>موجودی</Label>
                <Input 
                  type="number" 
                  placeholder="تعداد"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>تصویر محصول</Label>
              <Button
                variant="outline"
                className="w-full"
                type="button"
                onClick={() => { setShowCropModal(true); setShowAddModal(false); }}
              >
                {selectedImage ? 'تغییر تصویر' : 'انتخاب تصویر'}
              </Button>
              {selectedImage && (
                <img src={selectedImage} alt="Preview" className="w-32 h-32 object-cover rounded mt-2" />
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>لغو</Button>
              <Button onClick={handleAddProduct}>ذخیره</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Crop Modal */}
      <ImageCropModal
        isOpen={showCropModal}
        onClose={() => { setShowCropModal(false); setShowAddModal(true); }}
        onSave={(img) => {
          setSelectedImage(img);
          setShowAddModal(true);
        }}
        aspectRatio={1}
      />
    </main>
  );
}
