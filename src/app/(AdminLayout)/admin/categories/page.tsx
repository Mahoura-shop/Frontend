"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
	Plus,
	Pencil,
	Trash2,
	Grid3x3,
	List,
	Search,
	Image as ImageIcon,
	Eye,
	FolderTree,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import CustomToast from "@/components/Custom/CustomToast/CustomToast";
import { getData } from "@/services/services";

interface Category {
	id: number;
	name: string;
	slug: string;
	description?: string;
	categoryPic: string | null;
	count: number;
	isActive: boolean;
}

export default function CategoriesPage() {
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 12;

	// Sample data
	const [categories, setCategories] = useState<Category[]>([
		{
			id: 1,
			name: "آرایش صورت",
			slug: "makeup-face",
			categoryPic: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200",
			count: 120,
			isActive: true,
		},
		{
			id: 2,
			name: "مراقبت از پوست",
			slug: "skin-care",
			categoryPic: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=200",
			count: 85,
			isActive: true,
		},
		{
			id: 3,
			name: "آرایش چشم",
			slug: "eye-makeup",
			categoryPic: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=200",
			count: 65,
			isActive: true,
		},
		{
			id: 4,
			name: "عطر و ادکلن",
			slug: "perfume",
			categoryPic: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=200",
			count: 45,
			isActive: true,
		},
		{
			id: 5,
			name: "مراقبت مو",
			slug: "hair-care",
			categoryPic: null,
			count: 38,
			isActive: true,
		},
		{
			id: 6,
			name: "لوازم آرایش",
			slug: "makeup-tools",
			categoryPic: null,
			count: 25,
			isActive: false,
		},
	]);

	const filteredCategories = categories.filter((cat) =>
		cat?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
	const paginatedCategories = filteredCategories.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage,
	);

	const activeCount = categories.filter((c) => c.isActive).length;
	const inactiveCount = categories.filter((c) => !c.isActive).length;

	useEffect(() => {
		getData({ endPoint: `/v1/category` }).then((data) => {
			// console.log("data", [...categories, ...data.data]);
			setCategories((prev) => [...prev, ...data.data]);
		});
	}, []);

	const handleDelete = (id: number) => {
		setCategories(categories.filter((c) => c.id !== id));
		CustomToast("دسته‌بندی با موفقیت حذف شد", "success");
	};

	return (
		<main className="p-6">
			{/* Header with Counts */}
			<div className="mb-6">
				<h1 className="text-3xl font-bold mb-2">مدیریت دسته‌بندی‌ها</h1>
				<div className="flex items-center gap-4 text-sm">
					<span className="text-muted-foreground">
						مجموع:{" "}
						<span className="font-bold text-foreground">
							{categories.length}
						</span>
					</span>
					<span className="text-muted-foreground">
						فعال:{" "}
						<span className="font-bold text-green-600">
							{activeCount}
						</span>
					</span>
					<span className="text-muted-foreground">
						غیرفعال:{" "}
						<span className="font-bold text-red-600">
							{inactiveCount}
						</span>
					</span>
				</div>
			</div>

			{/* Toolbar */}
			<div className="flex items-center justify-between mb-6 flex-wrap gap-4">
				<div className="flex items-center gap-4 flex-1 max-w-md">
					<div className="relative flex-1">
						<Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
						<Input
							placeholder="جستجوی دسته‌بندی..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pr-10"
						/>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<Button
						variant={viewMode === "grid" ? "default" : "ghost"}
						size="icon"
						onClick={() => setViewMode("grid")}
					>
						<Grid3x3 className="w-5 h-5" />
					</Button>
					<Button
						variant={viewMode === "list" ? "default" : "ghost"}
						size="icon"
						onClick={() => setViewMode("list")}
					>
						<List className="w-5 h-5" />
					</Button>
					<Button className="gap-2">
						<Plus className="w-4 h-4" />
						افزودن دسته‌بندی
					</Button>
				</div>
			</div>

			{/* Grid View */}
			{viewMode === "grid" && (
				<div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{paginatedCategories.map((category, i) => (
						<motion.div
							key={category.id}
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: i * 0.05 }}
						>
							<Card className="overflow-hidden group hover:shadow-xl transition-all">
								<div className="relative h-48 bg-muted flex items-center justify-center overflow-hidden">
									{category.categoryPic ? (
										<img
											src={category.categoryPic}
											alt={category.name}
											className="w-full h-full object-cover"
										/>
									) : (
										<FolderTree className="w-16 h-16 text-muted-foreground" />
									)}

									{/* Quick Actions */}
									<div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
										<Button
											size="icon"
											variant="secondary"
											className="h-8 w-8"
										>
											<Eye className="w-4 h-4" />
										</Button>
										<Button
											size="icon"
											variant="secondary"
											className="h-8 w-8"
										>
											<Pencil className="w-4 h-4" />
										</Button>
										<Button
											size="icon"
											variant="secondary"
											className="h-8 w-8 text-red-500"
											onClick={() =>
												handleDelete(category.id)
											}
										>
											<Trash2 className="w-4 h-4" />
										</Button>
									</div>

									{/* Status Badge */}
									<div className="absolute top-2 right-2">
										<Badge
											variant={
												category.isActive
													? "available"
													: "outOfStock"
											}
										>
											{category.isActive
												? "فعال"
												: "غیرفعال"}
										</Badge>
									</div>
								</div>

								<CardContent className="p-4">
									<h3 className="font-bold mb-2 text-lg">
										{category.name}
									</h3>
									<div className="flex items-center justify-between text-sm">
										<span className="text-muted-foreground">
											{category.count} محصول
										</span>
										<Button
											variant="ghost"
											size="sm"
											className="h-8"
										>
											مشاهده محصولات
										</Button>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>
			)}

			{/* List View */}
			{viewMode === "list" && (
				<Card>
					<CardContent className="p-0">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>نام دسته‌بندی</TableHead>
									<TableHead>تعداد محصولات</TableHead>
									<TableHead>وضعیت</TableHead>
									<TableHead className="text-center">
										عملیات
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{paginatedCategories.map((category, i) => (
									<motion.tr
										key={category.id}
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: i * 0.05 }}
										className="group hover:bg-muted/50"
									>
										<TableCell className="font-medium">
											{category.name}
										</TableCell>
										<TableCell>
											<Badge variant="secondary">
												{category.count} محصول
											</Badge>
										</TableCell>
										<TableCell>
											<Badge
												variant={
													category.isActive
														? "available"
														: "outOfStock"
												}
											>
												{category.isActive
													? "فعال"
													: "غیرفعال"}
											</Badge>
										</TableCell>
										<TableCell>
											<div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8"
												>
													<Eye className="w-4 h-4" />
												</Button>
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8"
												>
													<Pencil className="w-4 h-4" />
												</Button>
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8 text-red-500"
													onClick={() =>
														handleDelete(
															category.id,
														)
													}
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
			)}

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
		</main>
	);
}
