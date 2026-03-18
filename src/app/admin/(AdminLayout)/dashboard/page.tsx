"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
	Package,
	FolderTree,
	Tag,
	TrendingUp,
	TrendingDown,
	Eye,
	Pencil,
	Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { getData } from "@/services/services";

export default function AdminDashboard() {
	const [brandsCount, setBrandsCount] = useState<number>(0);
	const [categoriesCount, setCategoriesCount] = useState<number>(0);
	const [productsCount, setProductsCount] = useState<number>(0);
	const fetchDashboardData = () => {
		getData({ endPoint: `/v1/admin/dashboard` }).then((data) => {
			setProductsCount(data?.data?.productsCount);
			setBrandsCount(data?.data?.brandsCount);
			setCategoriesCount(data?.data?.categoriesCount);
		});
	};
	useEffect(() => {
		fetchDashboardData();
	}, []);
	const stats = useMemo(
		() => [
			{
				title: "مجموع محصولات",
				value: productsCount,
				icon: Package,
				color: "from-blue-500 to-blue-600",
			},
			{
				title: "دسته‌بندی‌ها",
				value: categoriesCount,
				icon: FolderTree,
				color: "from-purple-500 to-purple-600",
			},
			{
				title: "برندها",
				value: brandsCount,
				icon: Tag,
				color: "from-amber-500 to-amber-600",
			},
		],
		[productsCount, categoriesCount, brandsCount],
	);

	const recentProducts = [
		{
			id: 1,
			name: "رژ لب مات شماره ۱",
			brand: "Mahoura",
			category: "آرایش",
			stock: "موجود",
			price: "۲۹۹,۰۰۰",
			image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=100",
		},
		{
			id: 2,
			name: "سرم ویتامین C",
			brand: "Mahoura Care",
			category: "مراقبت",
			stock: "موجود",
			price: "۴۵۰,۰۰۰",
			image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100",
		},
		{
			id: 3,
			name: "پالت سایه چشم",
			brand: "Mahoura Pro",
			category: "آرایش",
			stock: "ناموجود",
			price: "۳۵۰,۰۰۰",
			image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=100",
		},
		{
			id: 4,
			name: "کرم ضد آفتاب",
			brand: "Mahoura Care",
			category: "مراقبت",
			stock: "موجود",
			price: "۳۸۰,۰۰۰",
			image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=100",
		},
	];

	return (
		<main className="p-6">
			<div className="mb-8">
				<h1 className="text-3xl font-bold mb-2">داشبورد</h1>
				<p className="text-muted-foreground">
					خلاصه‌ای از وضعیت فروشگاه شما
				</p>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
				{stats?.map((stat, i) => (
					<motion.div
						key={stat.title}
						initial={{ opacity: 0, y: 20, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						transition={{ delay: i * 0.1, type: "spring" }}
						whileHover={{
							y: -8,
							transition: { type: "spring", stiffness: 400 },
						}}
					>
						<Card className="overflow-hidden relative group">
							<CardHeader className="pb-3">
								<div className="flex items-center justify-between">
									<div
										className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}
									>
										<stat.icon className="w-6 h-6 text-white" />
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<div className="space-y-1">
									<p className="text-sm text-muted-foreground">
										{stat.title}
									</p>
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

							<div className="absolute inset-0 bg-gradient-to-br from-primary-rose/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
						</Card>
					</motion.div>
				))}
			</div>

			{/* Recent Products Table */}
			{/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>آخرین محصولات</CardTitle>
                <CardDescription>محصولات اخیراً اضافه شده</CardDescription>
              </div>
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
                    transition={{ delay: 0.5 + i * 0.05 }}
                    className="group hover:bg-muted/50 transition-colors"
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
                    <TableCell className="font-bold text-primary-rose">{product.price} تومان</TableCell>
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
      </motion.div> */}
		</main>
	);
}
