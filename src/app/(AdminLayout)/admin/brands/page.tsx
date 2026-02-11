"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
	Plus,
	Pencil,
	Trash2,
	Grid3x3,
	List,
	Search,
	Image as ImageIcon,
	MoreVertical,
	Eye,
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
import { toast } from "sonner";
import CustomToast from "@/components/Custom/CustomToast/CustomToast";
import BrandInfoDialog from "@/components/admin/Brand/BrandInfoDialog";
import UpdateBrandDialog from "@/components/admin/Brand/UpdateBrandDialog";
import DeleteBrandDialog from "@/components/admin/Brand/DeleteBrandDialog";
import { getData } from "@/services/services";
import { Brand } from "@/types/Brand";

export default function BrandsPage() {
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 12;

	// Sample data
	const [brands, setBrands] = useState<Brand[]>([]);

	const filteredBrands = brands.filter((brand) =>
		brand.name.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);
	const paginatedBrands = filteredBrands.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage,
	);

	const activeCount = brands.filter((b) => b.isActive).length;
	const inactiveCount = brands.filter((b) => !b.isActive).length;

	const fetchBrands = useCallback(() => {
		getData({ endPoint: `/v1/brand` }).then((data) => {
			setBrands(data.data);
		});
	}, []);

	useEffect(() => {
		fetchBrands();
	}, [fetchBrands]);	

	return (
		<main className="p-6">
			{/* Header with Counts */}
			<div className="mb-6">
				<h1 className="text-3xl font-bold mb-2">مدیریت برندها</h1>
				<div className="flex items-center gap-4 text-sm">
					<span className="text-muted-foreground">
						مجموع:{" "}
						<span className="font-bold text-foreground">
							{brands.length}
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
							placeholder="جستجوی برند..."
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
						افزودن برند
					</Button>
				</div>
			</div>

			{/* Grid View */}
			{viewMode === "grid" && (
				<div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{paginatedBrands.map((brand, i) => (
						<motion.div
							key={brand.id}
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: i * 0.05 }}
						>
							<Card className="overflow-hidden group hover:shadow-xl transition-all">
								<div className="relative h-48 bg-muted flex items-center justify-center">
									{brand.brandPic ? (
										<img
											src={brand.brandPic}
											alt={brand.name}
											className="w-full h-full object-cover"
										/>
									) : (
										<ImageIcon className="w-16 h-16 text-muted-foreground" />
									)}

									{/* Quick Actions */}
									<div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
										<BrandInfoDialog brand={brand} />
										<UpdateBrandDialog
											fetchBrands={fetchBrands}
											mode="update"
											brand={brand}
										/>
										<DeleteBrandDialog
											id={brand?.id}
											fetchBrands={fetchBrands}
										/>
									</div>

									{/* Status Badge */}
									<div className="absolute top-2 right-2">
										<Badge
											variant={
												brand.isActive
													? "available"
													: "outOfStock"
											}
										>
											{brand.isActive
												? "فعال"
												: "غیرفعال"}
										</Badge>
									</div>
								</div>

								<CardContent className="p-4">
									<h3 className="font-bold mb-2 text-lg">
										{brand.name}
									</h3>
									<div className="flex items-center justify-between text-sm">
										<span className="text-muted-foreground">
											{brand.count} محصول
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
									<TableHead>نام برند</TableHead>
									<TableHead>تعداد محصولات</TableHead>
									<TableHead>وضعیت</TableHead>
									<TableHead className="text-center">
										عملیات
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{paginatedBrands.map((brand, i) => (
									<motion.tr
										key={brand.id}
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: i * 0.05 }}
										className="group hover:bg-muted/50"
									>
										<TableCell className="font-medium">
											{brand.name}
										</TableCell>
										<TableCell>
											<Badge variant="secondary">
												{brand.count} محصول
											</Badge>
										</TableCell>
										<TableCell>
											<Badge
												variant={
													brand.isActive
														? "available"
														: "outOfStock"
												}
											>
												{brand.isActive
													? "فعال"
													: "غیرفعال"}
											</Badge>
										</TableCell>
										<TableCell>
											<div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
												<BrandInfoDialog
													brand={brand}
												/>
												<UpdateBrandDialog
													fetchBrands={fetchBrands}
													mode="update"
													brand={brand}
												/>
												<DeleteBrandDialog
													id={brand?.id}
													fetchBrands={fetchBrands}
												/>
												{/* <Button
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
														handleDelete(brand.id)
													}
												>
													<Trash2 className="w-4 h-4" />
												</Button> */}
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
