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
import BrandProductsDialog from "@/components/admin/Brand/BrandProductsDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { getData } from "@/services/services";
import PermissionGuard from "@/components/admin/PermissionGuard";
import { usePermission } from "@/hooks/usePermission";
import GroupPriceUpdate from "@/components/GroupPriceUpdate/GroupPriceUpdate";

function BrandsPageContent() {
	const canCreate = usePermission("brand:create");
	const canEdit = usePermission("brand:edit");
	const canDelete = usePermission("brand:delete");
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 12;

	// Sample data
	const [brands, setBrands] = useState<Brand[]>([]);
	const [loading, setLoading] = useState(true);

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
		setLoading(true);
		getData({ endPoint: `/v1/brand` })
			.then((data) => {
				console.log("data", data);
				setBrands(data.data ?? []);
			})
			.finally(() => setLoading(false));
	}, []);

	useEffect(() => {
		fetchBrands();
	}, [fetchBrands]);

	return (
		<main className="p-4 sm:p-6">
			{/* Header with Counts */}
			<div className="mb-6">
				<h1 className="text-2xl sm:text-3xl font-bold mb-2">مدیریت برندها</h1>
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
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
				<div className="flex items-center gap-3 w-full sm:flex-1 sm:max-w-md">
					<div className="relative flex-1 min-w-0">
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
					{canCreate && (
						<UpdateBrandDialog
							fetchBrands={fetchBrands}
							mode="create"
						/>
					)}
				</div>
			</div>

			{/* Grid View */}
			{viewMode === "grid" && (
				<>
					{loading && (
						<div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{Array.from({ length: 8 }).map((_, i) => (
								<Card key={i} className="overflow-hidden">
									<Skeleton className="h-48 w-full rounded-none" />
									<CardContent className="p-4">
										<Skeleton className="h-5 w-28 mb-3" />
										<div className="flex items-center justify-between">
											<Skeleton className="h-4 w-20" />
											<Skeleton className="h-8 w-24 rounded-md" />
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					)}
					{!loading && paginatedBrands.length === 0 && (
						<Card>
							<CardContent className="p-0">
								<Table>
									<TableBody>
										<TableRow>
											<TableCell
												colSpan={100}
												className="text-center"
											>
												<div className="flex justify-center items-center text-2xl w-full min-h-[50vh]">
													هیچ برندی یافت نشد.
												</div>
											</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					)}
					{!loading && (
						<div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{paginatedBrands?.map((brand, i) => (
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
											<div className="absolute top-2 left-2 flex gap-2">
												<BrandInfoDialog
													brand={brand}
												/>
												{canEdit && (
													<UpdateBrandDialog
														fetchBrands={
															fetchBrands
														}
														mode="update"
														brand={brand}
													/>
												)}
												{canDelete && (
													<DeleteBrandDialog
														id={brand?.id}
														fetchBrands={
															fetchBrands
														}
													/>
												)}
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
												<GroupPriceUpdate
													name={brand.name}
													products={brand.products}
												/>
												{/* <BrandProductsDialog
													brand={brand}
												/> */}
											</div>
										</CardContent>
									</Card>
								</motion.div>
							))}
						</div>
					)}
				</>
			)}

			{/* List View */}
			{viewMode === "list" && (
				<>
					{/* Mobile Cards */}
					<div className="sm:hidden space-y-3">
						{loading &&
							Array.from({ length: 6 }).map((_, i) => (
								<Card key={i}>
									<CardContent className="p-4 space-y-3">
										<div className="flex justify-between">
											<Skeleton className="h-4 w-32" />
											<Skeleton className="h-5 w-16 rounded-full" />
										</div>
										<div className="flex justify-between items-center">
											<Skeleton className="h-5 w-20 rounded-full" />
											<div className="flex gap-2">
												<Skeleton className="h-8 w-8 rounded-md" />
												<Skeleton className="h-8 w-8 rounded-md" />
												<Skeleton className="h-8 w-8 rounded-md" />
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						{!loading && paginatedBrands.length === 0 && (
							<div className="flex justify-center items-center text-lg min-h-[40vh] text-muted-foreground">
								هیچ برندی یافت نشد.
							</div>
						)}
						{!loading &&
							paginatedBrands.map((brand, i) => (
								<motion.div
									key={brand.id}
									initial={{ opacity: 0, y: 12 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: i * 0.04 }}
								>
									<Card>
										<CardContent className="p-4">
											<div className="flex items-start justify-between gap-2 mb-3">
												<p className="font-medium">{brand.name}</p>
												<Badge variant={brand.isActive ? "available" : "outOfStock"} className="shrink-0">
													{brand.isActive ? "فعال" : "غیرفعال"}
												</Badge>
											</div>
											<div className="flex items-center justify-between">
												<Badge variant="secondary">{brand.count} محصول</Badge>
												<div className="flex items-center gap-1.5">
													<GroupPriceUpdate name={brand.name} products={brand.products} variant="icon" />
													<BrandInfoDialog brand={brand} />
													{canEdit && (
														<UpdateBrandDialog fetchBrands={fetchBrands} mode="update" brand={brand} />
													)}
													{canDelete && (
														<DeleteBrandDialog id={brand.id} fetchBrands={fetchBrands} />
													)}
												</div>
											</div>
										</CardContent>
									</Card>
								</motion.div>
							))}
					</div>

					{/* Desktop Table */}
					<Card className="hidden sm:block">
						<CardContent className="p-0">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>نام برند</TableHead>
										<TableHead>تعداد محصولات</TableHead>
										<TableHead>وضعیت</TableHead>
										<TableHead className="text-center">عملیات</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{loading &&
										Array.from({ length: 8 }).map((_, i) => (
											<TableRow key={i}>
												<TableCell><Skeleton className="h-4 w-28" /></TableCell>
												<TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
												<TableCell><Skeleton className="h-5 w-14 rounded-full" /></TableCell>
												<TableCell>
													<div className="flex items-center justify-center gap-2">
														<Skeleton className="h-8 w-8 rounded-md" />
														<Skeleton className="h-8 w-8 rounded-md" />
														<Skeleton className="h-8 w-8 rounded-md" />
													</div>
												</TableCell>
											</TableRow>
										))}
									{!loading && paginatedBrands.length === 0 && (
										<TableRow>
											<TableCell colSpan={100} className="text-center w-full">
												<div className="flex justify-center items-center text-2xl w-full min-h-[50vh]">
													هیچ برندی یافت نشد.
												</div>
											</TableCell>
										</TableRow>
									)}
									{paginatedBrands.map((brand, i) => (
										<motion.tr
											key={brand.id}
											initial={{ opacity: 0, x: -20 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: i * 0.05 }}
											className="group hover:bg-muted/50"
										>
											<TableCell className="font-medium">{brand.name}</TableCell>
											<TableCell>
												<Badge variant="secondary">{brand.count} محصول</Badge>
											</TableCell>
											<TableCell>
												<Badge variant={brand.isActive ? "available" : "outOfStock"}>
													{brand.isActive ? "فعال" : "غیرفعال"}
												</Badge>
											</TableCell>
											<TableCell>
												<div className="flex items-center justify-center gap-2">
													<GroupPriceUpdate name={brand.name} products={brand.products} variant="icon" />
													<BrandInfoDialog brand={brand} />
													{canEdit && (
														<UpdateBrandDialog fetchBrands={fetchBrands} mode="update" brand={brand} />
													)}
													{canDelete && (
														<DeleteBrandDialog id={brand.id} fetchBrands={fetchBrands} />
													)}
												</div>
											</TableCell>
										</motion.tr>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</>
			)}

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="mt-6 sm:mt-8">
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

export default function BrandsPage() {
	return (
		<PermissionGuard permission="brand:see">
			<BrandsPageContent />
		</PermissionGuard>
	);
}
