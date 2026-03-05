"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	Plus,
	Pencil,
	Trash2,
	Search,
	ArrowUpDown,
	ArrowUp,
	ArrowDown,
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useSettingsStore } from "@/store/useSettingsStore";
import CustomToast from "@/components/Custom/CustomToast/CustomToast";
import { getData } from "@/services/services";
import { useEffect } from "react";
import { useCallback } from "react";
import DeleteProductDialog from "@/components/admin/Product/DeleteProductDialog";
import UpdateProductDialog from "@/components/admin/Product/UpdateProductDialog";
import ProductInfoDialog from "@/components/admin/Product/ProductInfoDialog";

type SortColumn = "name" | "brand" | "category" | "price" | "quantity" | null;
type SortDirection = "asc" | "desc";

export default function ProductsAdminPage() {
	const { convertToIRR, formatPrice } = useSettingsStore();
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [sortColumn, setSortColumn] = useState<SortColumn>(null);
	const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
	const [filterColumn, setFilterColumn] = useState<string>("");
	const [filterValue, setFilterValue] = useState<string>("");

	const [categories, setCategories] = useState<Category[]>([]);
	const [brands, setBrands] = useState<Brand[]>([]);

	const itemsPerPage = 10;

	const [products, setProducts] = useState<Product[]>([]);

	const fetchBrands = useCallback(() => {
		getData({ endPoint: `/v1/brand` }).then((data) => {
			setBrands(data?.data);
		});
	}, []);
	const fetchCategories = useCallback(() => {
		getData({ endPoint: `/v1/category` }).then((data) => {
			setCategories(data?.data);
		});
	}, []);
	const fetchProducts = useCallback(() => {
		getData({ endPoint: `/v1/product` }).then((data) => {
			const productsList =
				data?.data?.map((product: Product) => ({
					...product,
					categoryID: product?.categoryID?.toString(),
					brandID: product?.brandID?.toString(),
					currencyID: product?.currencyID?.toString(),
					irrPrice:
						product?.irrPrice === 0 ? undefined : product?.irrPrice,
					consumerPrice:
						product?.consumerPrice === 0
							? undefined
							: product?.consumerPrice,
					step1Percent:
						product?.step1Percent === 0
							? undefined
							: product?.step1Percent,
					step2Percent:
						product?.step2Percent === 0
							? undefined
							: product?.step2Percent,
					step3Percent:
						product?.step3Percent === 0
							? undefined
							: product?.step3Percent,
					step1Price:
						product?.step1Price === 0
							? undefined
							: product?.step1Price,
					step2Price:
						product?.step2Price === 0
							? undefined
							: product?.step2Price,
					step3Price:
						product?.step3Price === 0
							? undefined
							: product?.step3Price,
				})) ?? [];
			setProducts(productsList);
			console.log("products", productsList);
		});
	}, []);

	useEffect(() => {
		fetchProducts();
		fetchBrands();
		fetchCategories();
	}, []);

	// Filtering
	let filteredProducts = [...products];

	if (searchQuery) {
		filteredProducts = filteredProducts.filter(
			(p) =>
				p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				p.brand?.name.toLowerCase().includes(searchQuery.toLowerCase()),
		);
	}

	if (filterColumn && filterValue) {
		filteredProducts = filteredProducts.filter((p) => {
			const columnValue = p[filterColumn as keyof Product];

			// Handle boolean fields (isActive, isNew)
			if (filterColumn === "isActive" || filterColumn === "isNew") {
				const boolValue = columnValue === true ? "فعال" : "غیرفعال";
				return boolValue === filterValue;
			}

			// Handle objects with name property (category, brand)
			if (
				columnValue &&
				typeof columnValue === "object" &&
				"name" in columnValue
			) {
				return String(columnValue.name)
					.toLowerCase()
					.includes(filterValue.toLowerCase());
			}

			if (columnValue === null || columnValue === undefined) {
				return filterValue === "بدون مقدار";
			}

			return String(columnValue)
				.toLowerCase()
				.includes(filterValue.toLowerCase());
		});
	}

	const handleSort = (column: SortColumn) => {
		if (sortColumn === column) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortColumn(column);
			setSortDirection("asc");
		}
	};

	// Helper function to get sortable value
	const getSortValue = (product: Product, column: keyof Product) => {
		const value = product[column];

		// Handle objects with name property (category, brand)
		if (value && typeof value === "object" && "name" in value) {
			return value.name || "";
		}

		// Handle booleans
		if (typeof value === "boolean") {
			return value ? 1 : 0; // Convert to number for sorting
		}

		// Handle null/undefined
		if (value === null || value === undefined) {
			return "";
		}

		return value;
	};

	// Sorting
	if (sortColumn) {
		filteredProducts.sort((a, b) => {
			const aVal = getSortValue(a, sortColumn as keyof Product);
			const bVal = getSortValue(b, sortColumn as keyof Product);

			// Handle different types
			if (typeof aVal === "string" && typeof bVal === "string") {
				return sortDirection === "asc"
					? aVal.localeCompare(bVal, "fa")
					: bVal.localeCompare(aVal, "fa");
			}

			if (typeof aVal === "number" && typeof bVal === "number") {
				return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
			}

			// Handle mixed types - convert to string
			const aString = String(aVal);
			const bString = String(bVal);

			return sortDirection === "asc"
				? aString.localeCompare(bString, "fa")
				: bString.localeCompare(aString, "fa");
		});
	}

	const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
	const paginatedProducts = filteredProducts.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage,
	);

	const activeCount = products.filter((p) => p.isActive).length;
	const inactiveCount = products.filter((p) => !p.isActive).length;

	const SortIcon = ({ column }: { column: SortColumn }) => {
		if (sortColumn !== column)
			return <ArrowUpDown className="w-4 h-4 opacity-50" />;
		return sortDirection === "asc" ? (
			<ArrowUp className="w-4 h-4" />
		) : (
			<ArrowDown className="w-4 h-4" />
		);
	};

	const getFilterOptions = () => {
		if (!filterColumn) return [];

		if (filterColumn === "isActive" || filterColumn === "isNew") {
			return ["فعال", "غیرفعال"];
		}

		const uniqueValues = new Set(
			products.map((p) => {
				const value = p[filterColumn as keyof Product];
				return value?.name || value || "بدون مقدار";
			}),
		);

		return Array.from(uniqueValues);
	};

	return (
		<main className="p-6 no-scrollbar">
			{/* Header with Counts */}
			<div className="mb-6">
				<h1 className="text-3xl font-bold mb-2">مدیریت محصولات</h1>
				<div className="flex items-center gap-4 text-sm">
					<span className="text-muted-foreground">
						مجموع:{" "}
						<span className="font-bold text-foreground">
							{products.length}
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
					<Select
						value={filterColumn}
						onValueChange={(val: any) => {
							setFilterColumn(val);
							setFilterValue("");
							setCurrentPage(1);
						}}
					>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="انتخاب فیلتر" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="brand">برند</SelectItem>
							<SelectItem value="category">دسته‌بندی</SelectItem>
							<SelectItem value="isActive">وضعیت</SelectItem>
						</SelectContent>
					</Select>

					{filterColumn && (
						<Select
							value={filterValue}
							onValueChange={(value) => {
								setFilterValue(value);
								setCurrentPage(1);
							}}
						>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="انتخاب مقدار" />
							</SelectTrigger>
							<SelectContent>
								{getFilterOptions().map((option) => (
									<SelectItem key={option} value={option}>
										{option}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}

					{(filterColumn || searchQuery) && (
						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								setSearchQuery("");
								setFilterColumn("");
								setFilterValue("");
								setCurrentPage(1);
							}}
						>
							پاک کردن فیلترها
						</Button>
					)}
				</div>
				<UpdateProductDialog
					fetchProducts={fetchProducts}
					mode="create"
					categories={categories}
					brands={brands}
				/>
				{/* <Button className="gap-2">
					<Plus className="w-4 h-4" />
					افزودن محصول
				</Button> */}
			</div>

			{/* Table */}
			<Card>
				<CardContent className="p-0">
					<Table className="no-scrollbar">
						<TableHeader>
							<TableRow>
								<TableHead>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => handleSort("name")}
										className="gap-2 hover:bg-transparent"
									>
										نام محصول
										<SortIcon column="name" />
									</Button>
								</TableHead>
								<TableHead>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => handleSort("brand")}
										className="gap-2 hover:bg-transparent"
									>
										برند
										<SortIcon column="brand" />
									</Button>
								</TableHead>
								<TableHead>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => handleSort("category")}
										className="gap-2 hover:bg-transparent"
									>
										دسته‌بندی
										<SortIcon column="category" />
									</Button>
								</TableHead>
								<TableHead>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => handleSort("price")}
										className="gap-2 hover:bg-transparent"
									>
										قیمت (ریال)
										<SortIcon column="price" />
									</Button>
								</TableHead>
								<TableHead>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => handleSort("quantity")}
										className="gap-2 hover:bg-transparent"
									>
										موجودی
										<SortIcon column="quantity" />
									</Button>
								</TableHead>
								<TableHead>وضعیت</TableHead>
								<TableHead className="text-center">
									عملیات
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody className="no-scrollbar">
							{paginatedProducts.length === 0 && (
								<TableRow>
									<TableCell
										colSpan={100}
										className="text-center"
									>
										<div className="flex justify-center items-center text-2xl w-full min-h-[50vh]">
											هیچ محصولی یافت نشد.
										</div>
									</TableCell>
								</TableRow>
							)}
							{paginatedProducts.map((product, i) => (
								<motion.tr
									key={product.id}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: i * 0.05 }}
									className="group hover:bg-muted/50"
								>
									<TableCell className="font-medium">
										{product.name}
									</TableCell>
									<TableCell>
										{product.brand?.name || "-"}
									</TableCell>
									<TableCell>
										{product.category?.name || "-"}
									</TableCell>
									<TableCell className="font-bold text-primary-rose">
										{formatPrice(product.irrPrice as number)}
									</TableCell>
									<TableCell>
										<span
											className={
												product.quantity === 0
													? "text-red-500"
													: ""
											}
										>
											{product.quantity}{" "}
											{product.quantityType}
										</span>
									</TableCell>
									<TableCell>
										<Badge
											variant={
												product.isActive
													? "available"
													: "outOfStock"
											}
										>
											{product.isActive
												? "فعال"
												: "غیرفعال"}
										</Badge>
									</TableCell>
									<TableCell>
										<div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
											<ProductInfoDialog
												product={product}
											/>
											<UpdateProductDialog
												fetchProducts={fetchProducts}
												product={product}
												mode="copy"
												categories={categories}
												brands={brands}
											/>
											<UpdateProductDialog
												fetchProducts={fetchProducts}
												product={product}
												mode="update"
												categories={categories}
												brands={brands}
											/>
											<DeleteProductDialog
												id={product?.id}
												fetchProducts={fetchProducts}
											/>
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
		</main>
	);
}
