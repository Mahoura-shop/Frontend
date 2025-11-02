'use client';

import { useState } from "react";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { useProductStore } from "../lib/store";
import { useTranslation } from "../hooks/useTranslation";
import { Product } from "../lib/store";

export function AdminDashboard() {
  const { products, addProduct, updateProduct, deleteProduct } = useProductStore();
  const { t, language } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    imageUrl: "",
    category: "",
    brand: "",
  });

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price.toString(),
        description: product.description,
        imageUrl: product.imageUrl,
        category: product.category,
        brand: product.brand,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        price: "",
        description: "",
        imageUrl: "",
        category: "",
        brand: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
    setFormData({
      name: "",
      price: "",
      description: "",
      imageUrl: "",
      category: "",
      brand: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      description: formData.description,
      imageUrl: formData.imageUrl,
      category: formData.category,
      brand: formData.brand,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      toast.success(t('productUpdated'));
    } else {
      addProduct(productData);
      toast.success(t('productCreated'));
    }

    handleCloseDialog();
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`${t('deleteConfirm')} "${name}"?`)) {
      deleteProduct(id);
      toast.success(t('productDeleted'));
    }
  };

  const formatPrice = (price: number) => {
    if (language === 'fa') {
      return `${price.toLocaleString('fa-IR')} ${t('currency')}`;
    }
    return `${t('currency')}${(price / 30000).toFixed(2)}`;
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          {language === 'fa' ? (
            <>
              <Button
                onClick={() => handleOpenDialog()}
                className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
              >
                <Plus className="ml-2 h-4 w-4" />
                {t('addNewProduct')}
              </Button>
              <div className="text-right">
                <h1 
                  className="mb-2 text-primary"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {t('adminDashboard')}
                </h1>
                <p className="text-muted-foreground">{t('manageProducts')}</p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h1 
                  className="mb-2 text-primary"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {t('adminDashboard')}
                </h1>
                <p className="text-muted-foreground">{t('manageProducts')}</p>
              </div>
              <Button
                onClick={() => handleOpenDialog()}
                className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
              >
                <Plus className="mr-2 h-4 w-4" />
                {t('addNewProduct')}
              </Button>
            </>
          )}
        </div>

        {/* Products Table */}
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                {language === 'fa' ? (
                  <>
                    <TableHead className="text-right">{t('actions')}</TableHead>
                    <TableHead className="text-right">{t('price')}</TableHead>
                    <TableHead>{t('brand')}</TableHead>
                    <TableHead>{t('category')}</TableHead>
                    <TableHead>{t('name')}</TableHead>
                    <TableHead>{t('image')}</TableHead>
                  </>
                ) : (
                  <>
                    <TableHead>{t('image')}</TableHead>
                    <TableHead>{t('name')}</TableHead>
                    <TableHead>{t('category')}</TableHead>
                    <TableHead>{t('brand')}</TableHead>
                    <TableHead className="text-right">{t('price')}</TableHead>
                    <TableHead className="text-right">{t('actions')}</TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  {language === 'fa' ? (
                    <>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleOpenDialog(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(product.id, product.name)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{formatPrice(product.price)}</TableCell>
                      <TableCell>{product.brand}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>
                        <div className="h-12 w-12 overflow-hidden rounded bg-muted">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>
                        <div className="h-12 w-12 overflow-hidden rounded bg-muted">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.brand}</TableCell>
                      <TableCell className="text-right">{formatPrice(product.price)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleOpenDialog(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(product.id, product.name)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {products.length === 0 && (
            <div className="py-16 text-center text-muted-foreground">
              <p>{t('noProducts')}</p>
            </div>
          )}
        </div>

        {/* Product Form Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? t('editProduct') : t('createNewProduct')}
              </DialogTitle>
              <DialogDescription>
                {editingProduct ? t('updateProductDesc') : t('createProductDesc')}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">{t('productName')}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="price">{t('productPrice')}</Label>
                  <Input
                    id="price"
                    type="number"
                    step={language === 'fa' ? '1000' : '0.01'}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">{t('productDescription')}</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="imageUrl">{t('imageUrl')}</Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">{t('category')}</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('selectCategory')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={t('skincare')}>{t('skincare')}</SelectItem>
                        <SelectItem value={t('makeup')}>{t('makeup')}</SelectItem>
                        <SelectItem value={t('fragrance')}>{t('fragrance')}</SelectItem>
                        <SelectItem value={t('haircare')}>{t('haircare')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="brand">{t('brand')}</Label>
                    <Select
                      value={formData.brand}
                      onValueChange={(value) => setFormData({ ...formData, brand: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('selectBrand')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={t('mahoura')}>{t('mahoura')}</SelectItem>
                        <SelectItem value={t('luxeBeauty')}>{t('luxeBeauty')}</SelectItem>
                        <SelectItem value={t('elegance')}>{t('elegance')}</SelectItem>
                        <SelectItem value={t('radiance')}>{t('radiance')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="ghost" onClick={handleCloseDialog}>
                  {t('cancel')}
                </Button>
                <Button 
                  type="submit"
                  className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
                >
                  {editingProduct ? t('updateProduct') : t('createProduct')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
