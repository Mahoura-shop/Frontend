'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Home, Package, FolderTree, Tag, Settings, LogOut, Menu, X,
  Bell, Sun, Moon, User, Search, TrendingUp, TrendingDown,
  AlertTriangle, BarChart, PieChart, Activity, Plus, Pencil,
  Trash2, MoreVertical, Eye, Filter, ArrowUpDown, ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [theme, setTheme] = useState('light');

  const stats = [
    {
      title: 'مجموع محصولات',
      value: '۲۵۰',
      change: '+۱۲%',
      trending: 'up',
      icon: Package,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'دسته‌بندی‌ها',
      value: '۱۵',
      change: '+۳',
      trending: 'up',
      icon: FolderTree,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'برندها',
      value: '۵۰',
      change: '+۸',
      trending: 'up',
      icon: Tag,
      color: 'from-amber-500 to-amber-600',
    },
    {
      title: 'ناموجود',
      value: '۱۲',
      change: '-۴',
      trending: 'down',
      icon: AlertTriangle,
      color: 'from-red-500 to-red-600',
    },
  ];

  const recentProducts = [
    { id: 1, name: 'رژ لب مات شماره ۱', brand: 'Mahoura', category: 'آرایش', stock: 'موجود', price: '۲۹۹,۰۰۰', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=100' },
    { id: 2, name: 'سرم ویتامین C', brand: 'Mahoura Care', category: 'مراقبت', stock: 'موجود', price: '۴۵۰,۰۰۰', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100' },
    { id: 3, name: 'پالت سایه چشم', brand: 'Mahoura Pro', category: 'آرایش', stock: 'ناموجود', price: '۳۵۰,۰۰۰', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=100' },
    { id: 4, name: 'کرم ضد آفتاب', brand: 'Mahoura Care', category: 'مراقبت', stock: 'موجود', price: '۳۸۰,۰۰۰', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=100' },
    { id: 5, name: 'ماسکارا', brand: 'Mahoura', category: 'آرایش', stock: 'موجود', price: '۲۸۰,۰۰۰', image: 'https://images.unsplash.com/photo-1631214460245-0e9b29740c17?w=100' },
  ];

  const menuItems = [
    { id: 'dashboard', label: 'داشبورد', icon: Home },
    { id: 'products', label: 'محصولات', icon: Package },
    { id: 'categories', label: 'دسته‌بندی‌ها', icon: FolderTree },
    { id: 'brands', label: 'برندها', icon: Tag },
    { id: 'settings', label: 'تنظیمات', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-neutral-warm dark:bg-gray-950 flex" dir="rtl">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: 300 }}
        animate={{ x: sidebarOpen ? 0 : 300 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed right-0 top-0 h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 z-50 ${
          sidebarOpen ? 'w-64' : 'w-0'
        } transition-all duration-300 shadow-xl`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold gradient-text">Mahoura</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="md:hidden"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item, i) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  currentPage === item.id
                    ? 'bg-gradient-to-r from-primary-rose to-secondary-plum text-white shadow-lg'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {item.id === 'products' && (
                  <Badge variant="secondary" className="mr-auto">۲۵۰</Badge>
                )}
              </motion.button>
            ))}
          </nav>

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
            >
              <LogOut className="w-5 h-5" />
              خروج
            </Button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'mr-64' : 'mr-0'}`}>
        {/* Top Header */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
          <div className="px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="w-5 h-5" />
              </Button>

              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <Home className="w-4 h-4" />
                <ChevronLeft className="w-4 h-4" />
                <span>داشبورد</span>
              </div>
            </div>

            <div className="flex-1 max-w-md hidden md:block">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="جستجو..."
                  className="pr-10"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </Button>

              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">داشبورد</h1>
            <p className="text-muted-foreground">خلاصه‌ای از وضعیت فروشگاه شما</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: i * 0.1, type: 'spring' }}
                whileHover={{ y: -8, transition: { type: 'spring', stiffness: 400 } }}
              >
                <Card className="overflow-hidden relative group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <Badge variant={stat.trending === 'up' ? 'default' : 'destructive'} className="gap-1">
                        {stat.trending === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {stat.change}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <motion.p
                        className="text-3xl font-bold"
                        initial={{ scale: 1 }}
                        whileInView={{ scale: [1, 1.1, 1] }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                      >
                        {stat.value}
                      </motion.p>
                    </div>
                  </CardContent>
                  
                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-rose/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Charts & Recent Activity */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="w-5 h-5" />
                    محصولات اضافه شده
                  </CardTitle>
                  <CardDescription>در ۳۰ روز گذشته</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-end justify-around gap-2">
                    {[40, 75, 60, 90, 55, 85, 70].map((height, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-primary-rose to-accent-gold rounded-t-lg"
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: 0.6 + i * 0.1, type: 'spring' }}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    فعالیت‌های اخیر
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { action: 'محصول جدید اضافه شد', product: 'رژ لب مات', time: '۲ ساعت پیش' },
                      { action: 'محصول ویرایش شد', product: 'سرم ویتامین C', time: '۵ ساعت پیش' },
                      { action: 'محصول حذف شد', product: 'کرم پودر', time: '۱ روز پیش' },
                      { action: 'دسته جدید ایجاد شد', product: 'لوازم آرایش چشم', time: '۲ روز پیش' },
                    ].map((activity, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + i * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="w-2 h-2 rounded-full bg-primary-rose mt-2 animate-pulse" />
                        <div className="flex-1">
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">{activity.product}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recent Products Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>آخرین محصولات</CardTitle>
                    <CardDescription>محصولات اخیراً اضافه شده</CardDescription>
                  </div>
                  <Button variant="luxury" className="gap-2">
                    <Plus className="w-4 h-4" />
                    افزودن محصول
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>تصویر</TableHead>
                      <TableHead>نام محصول</TableHead>
                      <TableHead>برند</TableHead>
                      <TableHead>دسته</TableHead>
                      <TableHead>قیمت</TableHead>
                      <TableHead>وضعیت</TableHead>
                      <TableHead className="text-center">عملیات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentProducts.map((product, i) => (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + i * 0.05 }}
                        className="group hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <TableCell>
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.brand}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell className="font-bold gradient-text">{product.price} تومان</TableCell>
                        <TableCell>
                          <Badge variant={product.stock === 'موجود' ? 'available' : 'outOfStock'}>
                            {product.stock}
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
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600">
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
          </motion.div>
        </main>
      </div>
    </div>
  );
}
