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
import { Input } from "@/components/ui/input";
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
import Loading from "@/components/Loading/Loading";
import { Formik, Form } from "formik";
import { updateProductPriceSchema } from "@/schemas/ProductSchemas";

type ProductSortColumn = "name" | "price" | "irrPrice" | "newPrice" | null;
type SortDirection = "asc" | "desc";

export default function ProductsAdminPage() {
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
			productPrices: filteredProductPrices.map((productPrice) => ({
				id: productPrice.id,
				irrPrice: productPrice.newIrrPrice,
			})),
		};
		console.log("productPricesPayload", productPricesPayload);
		patchData({
			endPoint: `/v1/product/prices`,
			data: productPricesPayload,
		}).then((data) => {
			console.log(data);
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
		<main className="p-6 no-scrollbar">
			{/* Header with Counts */}
			<div className="mb-6">
				<h1 className="text-3xl font-bold mb-2">مدیریت محصولات</h1>
				<div className="flex items-center gap-4 text-sm">
					<span className="text-muted-foreground">
						مجموع:{" "}
						<span className="font-bold text-foreground">
							{productPrices.length}
						</span>
					</span>
					{/* <span className="text-muted-foreground">
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
					</span> */}
				</div>
			</div>

			{/* Toolbar */}
			<div className="flex items-center justify-between mb-6 flex-wrap gap-4">
				<div className="flex items-center gap-4 flex-1 flex-wrap">
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
					<Select
						value={currencyFilter}
						onValueChange={(value) => {
							setCurrencyFilter(value);
							setCurrentPage(1);
						}}
					>
						<SelectTrigger className="w-[120px]">
							<SelectValue placeholder="ارز" />
						</SelectTrigger>
						<SelectContent>
							{currencies.map((currency) => (
								<SelectItem
									key={currency.id}
									value={String(currency.id)}
								>
									{currency.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{currencyFilter && (
						<Button variant="ghost">
							{getCurrency(currencyFilter)?.name}:{" "}
							{formatPrice(
								getCurrency(currencyFilter)
									?.convertRate as number,
							)}{" "}
							ریال
						</Button>
					)}
					<Button className="gap-2" onClick={updateProductPrices}>
						<Save className="w-4 h-4" />
						<p>اعمال گروهی تغییر قیمت</p>
					</Button>
				</div>
				{/* <UpdateProductDialog
					fetchProducts={fetchProducts}
					mode="create"
					categories={categories}
					brands={brands}
				/> */}
				{/* <Button className="gap-2">
					<Plus className="w-4 h-4" />
					افزودن محصول
				</Button> */}
			</div>

			{/* Table */}
			{/* <Formik
				initialValues={productPrices}
				validationSchema={updateProductPriceSchema}
				onSubmit={updateProducts}
			> */}
			<Card>
				<CardContent className="p-0">
					<Table className="no-scrollbar">
						<TableHeader>
							<TableRow>
								<TableHeadItem
									title="نام محصول"
									column="name"
								/>
								<TableHeadItem
									title="قیمت اصلی"
									column="price"
								/>
								<TableHeadItem
									title="قیمت ریالی"
									column="irrPrice"
								/>
								<TableHeadItem
									title="قیمت جدید"
									column="price"
								/>
							</TableRow>
						</TableHeader>
						<TableBody className="no-scrollbar">
							{paginatedProductPrices.length === 0 && (
								<TableRow>
									<TableCell
										colSpan={100}
										className="text-center"
									>
										<div className="flex justify-center items-center text-2xl w-full min-h-[50vh]">
											{loading ? (
												<Loading size={8} />
											) : (
												<p>هیچ محصولی یافت نشد.</p>
											)}
										</div>
									</TableCell>
								</TableRow>
							)}
							{paginatedProductPrices.map((productPrice, i) => (
								<motion.tr
									key={productPrice.id}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: i * 0.05 }}
									className="group hover:bg-muted/50"
								>
									<TableCell className="font-medium">
										{productPrice.name}
									</TableCell>
									<TableCell>
										{formatPrice(
											productPrice.price as number,
										)}{" "}
										{productPrice.currency?.name}
									</TableCell>
									<TableCell>
										{formatPrice(
											productPrice.irrPrice as number,
										)}
									</TableCell>
									<TableCell className="font-bold text-primary-rose">
										<InputFree
											label=""
											type="number"
											value={productPrice.newIrrPrice}
											onValueChange={(value) => {
												const newValue = value
													? value
													: "";
												setProductPrices((prev) => [
													...prev.slice(0, i),
													{
														...prev[i],
														newIrrPrice:
															Number(newValue),
													},
													...prev.slice(i + 1, -1),
												]);
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
			{/* </Formik> */}

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
