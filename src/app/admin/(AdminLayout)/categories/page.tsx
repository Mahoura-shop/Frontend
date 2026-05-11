"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
	Grid3x3,
	List,
	Search,
	FolderTree,
	ArrowUpDown,
	ArrowUp,
	ArrowDown,
} from "lucide-react";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { getData } from "@/services/services";
import DeleteCategoryDialog from "@/components/admin/Category/DeleteCategoryDialog";
import UpdateCategoryDialog from "@/components/admin/Category/UpdateCategoryDialog";
import Button from "@/components/Custom/Button/Button";
import CategoryInfoDialog from "@/components/admin/Category/CategoryInfoDialog";
import GroupPriceUpdate from "@/components/GroupPriceUpdate/GroupPriceUpdate";
import { useSettingsStore } from "@/store/useSettingsStore";
import Loading from "@/components/Loading/Loading";

type CategorySortColumn = "name" | "count" | null;
type SortDirection = "asc" | "desc";

export default function CategoriesPage() {
	const { formatPrice } = useSettingsStore();
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [searchQuery, setSearchQuery] = useState("");
	const [filterValue, setFilterValue] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [sortColumn, setSortColumn] = useState<CategorySortColumn>(null);
	const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
	const itemsPerPage = 12;

	const [categories, setCategories] = useState<Category[]>([]);

	const getSortValue = (category: Category, column: keyof Category) => {
		const value = category[column];
		if (value && typeof value === "object" && "name" in value) {
			return value.name || "";
		}
		if (typeof value === "boolean") {
			return value ? 1 : 0;
		}
		if (value === null || value === undefined) {
			return "";
		}
		return value;
	};

	let filteredCategories = [...categories];
	filteredCategories = categories.filter((cat) =>
		cat?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
	);
	if (filterValue) {
		filteredCategories = filteredCategories.filter(
			(category) =>
				(category.isActive === true ? "فعال" : "غیرفعال") ===
				filterValue,
		);
	}
	if (sortColumn) {
		filteredCategories.sort((a, b) => {
			const aVal = getSortValue(a, sortColumn as keyof Category);
			const bVal = getSortValue(b, sortColumn as keyof Category);
			if (typeof aVal === "string" && typeof bVal === "string") {
				return sortDirection === "asc"
					? aVal.localeCompare(bVal, "fa")
					: bVal.localeCompare(aVal, "fa");
			}

			if (typeof aVal === "number" && typeof bVal === "number") {
				return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
			}

			const aString = String(aVal);
			const bString = String(bVal);

			return sortDirection === "asc"
				? aString.localeCompare(bString, "fa")
				: bString.localeCompare(aString, "fa");
		});
	}

	const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
	let paginatedCategories = filteredCategories.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage,
	);

	const activeCount = categories.filter((c) => c.isActive).length;
	const inactiveCount = categories.filter((c) => !c.isActive).length;

	const fetchCategories = useCallback(() => {
		setLoading(true);
		getData({ endPoint: `/v1/category` })
			.then((data) => {
				console.log("fetchedCategories", data);
				const fetchedCategories: Category[] = data?.data ?? [];
				setCategories([...fetchedCategories]);
				fetchedCategories.forEach(
					(category: Category, index: number) => {
						getData({
							endPoint: `/v1/product/category/${category?.id}`,
						}).then((productData) => {
							setCategories((prev) => {
								const updated = [...prev];
								updated[index] = {
									...updated[index],
									products: productData?.data,
								};
								return updated;
							});
						});
					},
				);
			})
			.finally(() => setLoading(false));
	}, []);

	useEffect(() => {
		fetchCategories();
	}, []);

	const SortIcon = ({ column }: { column: CategorySortColumn }) => {
		if (sortColumn !== column)
			return <ArrowUpDown className="w-4 h-4 opacity-50" />;
		return sortDirection === "asc" ? (
			<ArrowUp className="w-4 h-4" />
		) : (
			<ArrowDown className="w-4 h-4" />
		);
	};
	const handleSort = (column: CategorySortColumn) => {
		if (sortColumn === column) {
			if (sortDirection === "asc") {
				setSortDirection("desc");
			} else {
				setSortColumn(null);
				setSortDirection("asc");
			}
		} else {
			setSortColumn(column);
			setSortDirection("asc");
		}
	};

	const TableHeadItem = ({
		title,
		column,
	}: {
		title: string;
		column: CategorySortColumn;
	}) => {
		return (
			<TableHead>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => handleSort(column)}
					className="gap-2 hover:bg-transparent flex place-self-center w-full"
				>
					{title}
					<SortIcon column={column} />
				</Button>
			</TableHead>
		);
	};
	return (
		<main className="p-6">
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
				<div className="flex items-center gap-4 flex-1">
					<div className="relative flex-1">
						<Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
						<Input
							placeholder="جستجوی دسته‌بندی..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pr-10"
						/>
					</div>
					<Select
						value={filterValue}
						onValueChange={(value) => {
							setFilterValue(value);
							setCurrentPage(1);
						}}
					>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="فیلتر وضعیت" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem key="فعال" value="فعال">
								فعال
							</SelectItem>
							<SelectItem key="غیرفعال" value="غیرفعال">
								غیرفعال
							</SelectItem>
						</SelectContent>
					</Select>
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
					<UpdateCategoryDialog
						fetchCategories={fetchCategories}
						mode="create"
					/>
				</div>
			</div>

			{/* Grid View */}
			{viewMode === "grid" && (
				<>
					{loading ? (
						<div className="h-[50vh] flex place-items-center col-span-4 place-self-center place-content-center">
							<Loading />
						</div>
					) : (
						paginatedCategories.length === 0 && (
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
														هیچ دسته‌بندی یافت نشد.
													</div>
												</TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</CardContent>
							</Card>
						)
					)}
					<div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{paginatedCategories &&
							paginatedCategories?.map((category, i) => (
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
												<CategoryInfoDialog
													category={category}
												/>
												<UpdateCategoryDialog
													fetchCategories={
														fetchCategories
													}
													mode="update"
													category={category}
												/>
												<DeleteCategoryDialog
													id={category?.id}
													fetchCategories={
														fetchCategories
													}
												/>
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
													{formatPrice(
														category.count,
													)}{" "}
													محصول
												</span>
												<GroupPriceUpdate
													name={category.name}
													products={category.products}
												/>
											</div>
										</CardContent>
									</Card>
								</motion.div>
							))}
					</div>
				</>
			)}

			{/* List View */}
			{viewMode === "list" && (
				<Card>
					<CardContent className="p-0">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHeadItem
										title="نام دسته‌بندی"
										column="name"
									/>
									{/* <TableHead>نام دسته‌بندی</TableHead> */}
									<TableHeadItem
										title="تعداد محصولات"
										column="count"
									/>
									{/* <TableHead>تعداد محصولات</TableHead> */}
									<TableHead>وضعیت</TableHead>
									<TableHead>عملیات</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{paginatedCategories.length === 0 && (
									<TableRow>
										<TableCell
											colSpan={100}
											className="text-center"
										>
											<div className="flex justify-center items-center text-2xl w-full min-h-[50vh]">
												هیچ دسته‌بندی یافت نشد.
											</div>
										</TableCell>
									</TableRow>
								)}
								{paginatedCategories?.map((category, i) => (
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
												{formatPrice(category.count)}{" "}
												محصول
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
												<GroupPriceUpdate
													name={category?.name}
													products={
														category?.products
													}
													variant="icon"
												/>
												<CategoryInfoDialog
													category={category}
												/>
												<UpdateCategoryDialog
													fetchCategories={
														fetchCategories
													}
													mode="update"
													category={category}
												/>
												<DeleteCategoryDialog
													id={category?.id}
													fetchCategories={
														fetchCategories
													}
												/>
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
