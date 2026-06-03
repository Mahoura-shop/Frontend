"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	Search,
	ArrowUpDown,
	ArrowUp,
	ArrowDown,
	DollarSign,
	Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
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
import { getData, patchData } from "@/services/services";
import { useEffect } from "react";
import { useCallback } from "react";
import InputFree from "@/components/Custom/Input/InputFree";
import { getCurrencies } from "@/services/currency";
import { Skeleton } from "@/components/ui/skeleton";
import CustomToast from "@/components/Custom/CustomToast/CustomToast";
import PermissionGuard from "@/components/admin/PermissionGuard";

type ProductSortColumn = "name" | "price" | "irrPrice" | "newPrice" | null;
type SortDirection = "asc" | "desc";

function PriceGroupPageContent() {
	const { formatPrice } = useSettingsStore();
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [loading, setLoading] = useState(true);
	const [sortColumn, setSortColumn] = useState<ProductSortColumn>(null);
	const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
	const [currencies, setCurrencies] = useState<Currency[]>([]);
	const [currencyFilter, setCurrencyFilter] = useState<string>("");

	const itemsPerPage = 10;

	const [productPrices, setProductPrices] = useState<ProductPrice[]>([]);

	const fetchProductPrices = useCallback(() => {
		getData({ endPoint: `/v1/product/prices` }).then((data) => {
			const productsList = data?.data ?? [];
			setProductPrices(productsList);
			console.log("products", productsList);
		});
	}, []);

	const fetchCurrencies = () => {
		setLoading(true);
		getCurrencies()
			.then((data) => {
				setCurrencies(data?.data);
			})
			.finally(() => setLoading(false));
	};

	const getCurrency = (currencyID: string) => {
		return currencies.find(
			(currency) => currency.id === Number(currencyID),
		);
	};

	useEffect(() => {
		fetchProductPrices();
		fetchCurrencies();
	}, []);

	// Filtering
	let filteredProductPrices = [...productPrices];

	if (searchQuery) {
		filteredProductPrices = filteredProductPrices.filter((p) =>
			p.name.toLowerCase().includes(searchQuery.toLowerCase()),
		);
	}

	if (currencyFilter) {
		filteredProductPrices = filteredProductPrices.filter(
			(p) => String(p.currency.id) === currencyFilter,
		);
	}

	const handleSort = (column: ProductSortColumn) => {
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

	// Sorting
	const getSortValue = (
		product: ProductPrice,
		column: keyof ProductPrice,
	) => {
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

	if (sortColumn) {
		filteredProductPrices.sort((a, b) => {
			const aVal = getSortValue(a, sortColumn as keyof ProductPrice);
			const bVal = getSortValue(b, sortColumn as keyof ProductPrice);
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

	const totalPages = Math.ceil(filteredProductPrices.length / itemsPerPage);
	const paginatedProductPrices = filteredProductPrices.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage,
	);

	const updateProductPrices = () => {
		let filteredProductPrices = [...productPrices];

		if (searchQuery) {
			filteredProductPrices = filteredProductPrices.filter((p) =>
				p.name.toLowerCase().includes(searchQuery.toLowerCase()),
			);
		}

		if (currencyFilter) {
			filteredProductPrices = filteredProductPrices.filter(
				(p) => String(p.currency.id) === currencyFilter,
			);
		}
		const productPricesPayload = {
			productPrices: filteredProductPrices?.map((productPrice) => ({
				id: productPrice.id,
				irrPrice: productPrice.newIrrPrice,
			})),
		};
		patchData({
			endPoint: `/v1/product/prices`,
			data: productPricesPayload,
		}).then((data) => {
			CustomToast(data?.message, "success");
			fetchProductPrices();
		});
	};

	// const updateProductPrices = () => {
	// 	// Prevent sending empty payload if that's causing the 422
	// 	if (productPrices.length === 0) {
	// 		console.warn("No products to update");
	// 		return;
	// 	}

	// 	const productPricesPayload = {
	// 		productPrices: productPrices.map((productPrice) => ({
	// 			id: productPrice.id,
	// 			irrPrice: productPrice.newIrrPrice,
	// 		})),
	// 	};

	// 	// Ensure you are sending JSON
	// 	patchData({
	// 		endPoint: `/v1/product/prices`,
	// 		data: productPricesPayload,
	// 		headers: {
	// 			"Content-Type": "application/json",
	// 		},
	// 	}).then((data) => {
	// 		console.log(data.data);
	// 	});
	// };

	const SortIcon = ({ column }: { column: ProductSortColumn }) => {
		if (sortColumn !== column)
			return <ArrowUpDown className="w-4 h-4 opacity-50" />;
		return sortDirection === "asc" ? (
			<ArrowUp className="w-4 h-4" />
		) : (
			<ArrowDown className="w-4 h-4" />
		);
	};

	const TableHeadItem = ({
		title,
		column,
	}: {
		title: string;
		column: ProductSortColumn;
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
		<main className="p-4 sm:p-6 no-scrollbar">
			{/* Header */}
			<div className="mb-6">
				<h1 className="text-2xl sm:text-3xl font-bold mb-2">مدیریت گروه قیمت</h1>
				<div className="flex items-center gap-4 text-sm">
					<span className="text-muted-foreground">
						مجموع:{" "}
						<span className="font-bold text-foreground">
							{productPrices.length}
						</span>
					</span>
				</div>
			</div>

			{/* Toolbar */}
			<div className="flex flex-col gap-3 mb-6">
				<div className="flex gap-3">
					<InputFree
						containerClassName="flex-1 min-w-0"
						icon={Search}
						label="جستجوی محصول..."
						value={searchQuery}
						onValueChange={(val) => setSearchQuery(val)}
					/>
					<Select
						value={currencyFilter}
						onValueChange={(value) => {
							setCurrencyFilter(value);
							setCurrentPage(1);
						}}
					>
						<SelectTrigger className="w-[110px] shrink-0">
							<SelectValue placeholder="ارز" />
						</SelectTrigger>
						<SelectContent>
							{currencies?.map((currency) => (
								<SelectItem key={currency.id} value={String(currency.id)}>
									{currency.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex items-center gap-3">
					{currencyFilter && (
						<span className="text-sm text-muted-foreground">
							{getCurrency(currencyFilter)?.name}:{" "}
							<span className="font-medium text-foreground">
								{formatPrice(getCurrency(currencyFilter)?.convertRate as number)} ریال
							</span>
						</span>
					)}
					<Button className="gap-2 mr-auto" onClick={updateProductPrices}>
						<Save className="w-4 h-4" />
						اعمال گروهی تغییر قیمت
					</Button>
				</div>
			</div>

			{/* Mobile Cards */}
			<div className="sm:hidden space-y-3">
				{loading &&
					Array.from({ length: 6 }).map((_, i) => (
						<Card key={i}>
							<CardContent className="p-4 space-y-3">
								<Skeleton className="h-4 w-40" />
								<div className="flex justify-between">
									<Skeleton className="h-3 w-28" />
									<Skeleton className="h-3 w-24" />
								</div>
								<Skeleton className="h-10 w-full rounded-md" />
							</CardContent>
						</Card>
					))}
				{!loading && paginatedProductPrices.length === 0 && (
					<div className="flex justify-center items-center text-lg min-h-[40vh] text-muted-foreground">
						هیچ محصولی یافت نشد.
					</div>
				)}
				{!loading &&
					paginatedProductPrices.map((productPrice, i) => (
						<motion.div
							key={productPrice.id}
							initial={{ opacity: 0, y: 12 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: i * 0.04 }}
						>
							<Card>
								<CardContent className="p-4 space-y-3">
									<p className="font-medium">{productPrice.name}</p>
									<div className="flex items-center justify-between text-sm text-muted-foreground">
										<span>
											قیمت اصلی:{" "}
											<span className="text-foreground font-medium">
												{formatPrice(productPrice.price as number)} {productPrice.currency?.name}
											</span>
										</span>
										<span>
											ریالی:{" "}
											<span className="text-foreground font-medium">
												{formatPrice(productPrice.irrPrice as number)}
											</span>
										</span>
									</div>
									<InputFree
										label="قیمت جدید (ریال)"
										isPriceInput
										value={productPrice.newIrrPrice}
										onValueChange={(value) => {
											const newValue = value ? value : "";
											setProductPrices((prev) => {
												const newProductPrices = [...prev];
												newProductPrices[i] = {
													...newProductPrices[i],
													newIrrPrice: Number(newValue),
												};
												return newProductPrices;
											});
										}}
										icon={DollarSign}
									/>
								</CardContent>
							</Card>
						</motion.div>
					))}
			</div>

			{/* Desktop Table */}
			<Card className="hidden sm:block" data-testid="price-group-table">
				<CardContent className="p-0">
					<Table className="no-scrollbar">
						<TableHeader>
							<TableRow>
								<TableHeadItem title="نام محصول" column="name" />
								<TableHeadItem title="قیمت اصلی" column="price" />
								<TableHeadItem title="قیمت ریالی" column="irrPrice" />
								<TableHeadItem title="قیمت جدید" column="price" />
							</TableRow>
						</TableHeader>
						<TableBody className="no-scrollbar">
							{loading &&
								Array.from({ length: 8 }).map((_, i) => (
									<TableRow key={i}>
										<TableCell><Skeleton className="h-4 w-36" /></TableCell>
										<TableCell><Skeleton className="h-4 w-24" /></TableCell>
										<TableCell><Skeleton className="h-4 w-24" /></TableCell>
										<TableCell><Skeleton className="h-9 w-full rounded-md" /></TableCell>
									</TableRow>
								))}
							{!loading && paginatedProductPrices.length === 0 && (
								<TableRow>
									<TableCell colSpan={100} className="text-center">
										<div className="flex justify-center items-center text-2xl w-full min-h-[50vh]">
											<p>هیچ محصولی یافت نشد.</p>
										</div>
									</TableCell>
								</TableRow>
							)}
							{!loading &&
								paginatedProductPrices?.map((productPrice, i) => (
									<motion.tr
										key={productPrice.id}
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: i * 0.05 }}
										className="group hover:bg-muted/50"
									>
										<TableCell className="font-medium">{productPrice.name}</TableCell>
										<TableCell>
											{formatPrice(productPrice.price as number)} {productPrice.currency?.name}
										</TableCell>
										<TableCell>
											{formatPrice(productPrice.irrPrice as number)}
										</TableCell>
										<TableCell className="font-bold text-primary-rose">
											<InputFree
												label="ریال"
												isPriceInput
												value={productPrice.newIrrPrice}
												onValueChange={(value) => {
													const newValue = value ? value : "";
													// setProductPrices((prev) => [
													// 	...prev.slice(0, i),
													// 	{
													// 		...prev[i],
													// 		newIrrPrice:
													// 			Number(newValue),
													// 	},
													// 	...prev.slice(i + 1),
													// ]);
													setProductPrices((prev) => {
														// Create a new array to avoid direct mutation
														const newProductPrices = [...prev];
														// Update the specific item at index 'i'
														newProductPrices[i] = {
															...newProductPrices[i], // Copy existing properties
															newIrrPrice: Number(newValue), // Update the newIrrPrice
														};
														return newProductPrices; // Return the new array
													});
												}}
												icon={DollarSign}
											/>
										</TableCell>
									</motion.tr>
								))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

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

export default function ProductsAdminPage() {
	return (
		<PermissionGuard permission="product:batch_price">
			<PriceGroupPageContent />
		</PermissionGuard>
	);
}
