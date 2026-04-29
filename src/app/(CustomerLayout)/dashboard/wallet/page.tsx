// src/app/wallet/page.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Wallet,
	Plus,
	TrendingUp,
	TrendingDown,
	CreditCard,
	ArrowUpRight,
	ArrowDownLeft,
	Calendar,
	Filter,
	Download,
	Eye,
	EyeOff,
	Gift,
	DollarSign,
	RefreshCw,
} from "lucide-react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Input from "@/components/Custom/Input/Input";
import Select from "@/components/Custom/Select/Select";
import CustomToast from "@/components/Custom/CustomToast/CustomToast";
import { formatPrice } from "@/utils/formatPrice";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

// Mock wallet data
const MOCK_BALANCE = 2500000; // تومان
const MOCK_PENDING = 150000; // تومان

// Mock transactions
const MOCK_TRANSACTIONS = [
	{
		id: 1,
		type: "deposit",
		amount: 500000,
		description: "واریز به کیف پول",
		date: "۱۴۰۳/۰۲/۲۵",
		time: "۱۴:۳۰",
		status: "completed",
		reference: "TRX-20240225-001",
	},
	{
		id: 2,
		type: "withdrawal",
		amount: 350000,
		description: "پرداخت سفارش #۱۲۳۴",
		date: "۱۴۰۳/۰۲/۲۴",
		time: "۱۰:۱۵",
		status: "completed",
		reference: "TRX-20240224-002",
	},
	{
		id: 3,
		type: "deposit",
		amount: 1200000,
		description: "شارژ کیف پول از کارت بانکی",
		date: "۱۴۰۳/۰۲/۲۳",
		time: "۱۶:۴۵",
		status: "completed",
		reference: "TRX-20240223-003",
	},
	{
		id: 4,
		type: "withdrawal",
		amount: 890000,
		description: "خرید محصول - پالت سایه",
		date: "۱۴۰۳/۰۲/۲۲",
		time: "۱۱:۲۰",
		status: "completed",
		reference: "TRX-20240222-004",
	},
	{
		id: 5,
		type: "refund",
		amount: 450000,
		description: "بازگشت وجه سفارش لغو شده",
		date: "۱۴۰۳/۰۲/۲۱",
		time: "۰۹:۰۰",
		status: "completed",
		reference: "TRX-20240221-005",
	},
	{
		id: 6,
		type: "bonus",
		amount: 100000,
		description: "پاداش خرید",
		date: "۱۴۰۳/۰۲/۲۰",
		time: "۱۸:۳۰",
		status: "completed",
		reference: "TRX-20240220-006",
	},
	{
		id: 7,
		type: "withdrawal",
		amount: 680000,
		description: "پرداخت سفارش #۱۲۳۳",
		date: "۱۴۰۳/۰۲/۱۹",
		time: "۱۵:۱۰",
		status: "pending",
		reference: "TRX-20240219-007",
	},
];

// Validation schema for deposit
const depositSchema = Yup.object({
	amount: Yup.number()
		.min(10000, "حداقل مبلغ واریز ۱۰,۰۰۰ تومان است")
		.max(50000000, "حداکثر مبلغ واریز ۵۰,۰۰۰,۰۰۰ تومان است")
		.required("مبلغ الزامی است"),
	paymentMethod: Yup.string().required("روش پرداخت را انتخاب کنید"),
});

export default function WalletPage() {
	const [showBalance, setShowBalance] = useState(true);
	const [filterType, setFilterType] = useState("all");
	const [depositDialogOpen, setDepositDialogOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const getTransactionIcon = (type: string) => {
		switch (type) {
			case "deposit":
				return <ArrowDownLeft className="w-5 h-5 text-green-600" />;
			case "withdrawal":
				return <ArrowUpRight className="w-5 h-5 text-red-600" />;
			case "refund":
				return <RefreshCw className="w-5 h-5 text-blue-600" />;
			case "bonus":
				return <Gift className="w-5 h-5 text-amber-600" />;
			default:
				return <DollarSign className="w-5 h-5" />;
		}
	};

	const getTransactionTypeName = (type: string) => {
		switch (type) {
			case "deposit":
				return "واریز";
			case "withdrawal":
				return "برداشت";
			case "refund":
				return "بازگشت وجه";
			case "bonus":
				return "پاداش";
			default:
				return type;
		}
	};

	const filteredTransactions =
		filterType === "all"
			? MOCK_TRANSACTIONS
			: MOCK_TRANSACTIONS.filter((t) => t.type === filterType);

	const handleDeposit = async (values: {
		amount: string;
		paymentMethod: string;
	}) => {
		setLoading(true);

		// Mock API call
		console.log("Deposit:", values);

		await new Promise((resolve) => setTimeout(resolve, 2000));

		setLoading(false);
		CustomToast("درخواست شارژ کیف پول ثبت شد", "success");
		setDepositDialogOpen(false);
	};

	return (
		<div className="min-h-screen bg-background">

			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-8"
				>
					<h1 className="text-4xl font-bold gradient-text mb-2">
						کیف پول
					</h1>
					<p className="text-muted-foreground">
						مدیریت موجودی و تراکنش‌های مالی
					</p>
				</motion.div>

				<div className="grid lg:grid-cols-3 gap-6">
					{/* Balance Cards */}
					<div className="lg:col-span-3 grid md:grid-cols-3 gap-6">
						{/* Main Balance */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.1 }}
						>
							<Card className="relative overflow-hidden border-2">
								<div className="absolute inset-0 bg-gradient-to-br from-primary-rose/20 via-accent-gold/20 to-secondary-plum/20" />
								<CardContent className="relative p-6">
									<div className="flex items-center justify-between mb-4">
										<div className="flex items-center gap-2">
											<div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-rose to-accent-gold flex items-center justify-center">
												<Wallet className="w-6 h-6 text-white" />
											</div>
											<div>
												<p className="text-sm text-muted-foreground">
													موجودی کیف پول
												</p>
												<p className="text-xs text-muted-foreground">
													قابل استفاده
												</p>
											</div>
										</div>
										<Button
											variant="ghost"
											size="icon"
											onClick={() =>
												setShowBalance(!showBalance)
											}
										>
											{showBalance ? (
												<Eye className="w-5 h-5" />
											) : (
												<EyeOff className="w-5 h-5" />
											)}
										</Button>
									</div>
									<div className="space-y-2">
										<p className="text-3xl font-bold gradient-text">
											{showBalance
												? formatPrice(MOCK_BALANCE)
												: "••••••"}
										</p>
										<p className="text-sm text-muted-foreground">
											تومان
										</p>
									</div>
								</CardContent>
							</Card>
						</motion.div>

						{/* Pending Balance */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
						>
							<Card className="border-2">
								<CardContent className="p-6">
									<div className="flex items-center gap-3 mb-4">
										<div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
											<Calendar className="w-6 h-6 text-amber-600" />
										</div>
										<div>
											<p className="text-sm text-muted-foreground">
												موجودی در انتظار
											</p>
											<p className="text-xs text-muted-foreground">
												در حال پردازش
											</p>
										</div>
									</div>
									<div className="space-y-2">
										<p className="text-2xl font-bold text-amber-600">
											{showBalance
												? formatPrice(MOCK_PENDING)
												: "••••••"}
										</p>
										<p className="text-sm text-muted-foreground">
											تومان
										</p>
									</div>
								</CardContent>
							</Card>
						</motion.div>

						{/* Total Balance */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3 }}
						>
							<Card className="border-2">
								<CardContent className="p-6">
									<div className="flex items-center gap-3 mb-4">
										<div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
											<TrendingUp className="w-6 h-6 text-green-600" />
										</div>
										<div>
											<p className="text-sm text-muted-foreground">
												مجموع موجودی
											</p>
											<p className="text-xs text-muted-foreground">
												کل دارایی
											</p>
										</div>
									</div>
									<div className="space-y-2">
										<p className="text-2xl font-bold text-green-600">
											{showBalance
												? formatPrice(
														MOCK_BALANCE +
															MOCK_PENDING,
													)
												: "••••••"}
										</p>
										<p className="text-sm text-muted-foreground">
											تومان
										</p>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					</div>

					{/* Quick Actions */}
					<div className="lg:col-span-3">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.4 }}
							className="grid md:grid-cols-2 gap-4"
						>
							{/* Deposit Button */}
							<Dialog
								open={depositDialogOpen}
								onOpenChange={setDepositDialogOpen}
							>
								<DialogTrigger asChild>
									<Button
										variant="luxury"
										className="gap-2 h-14"
										size="lg"
									>
										<Plus className="w-5 h-5" />
										شارژ کیف پول
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>شارژ کیف پول</DialogTitle>
									</DialogHeader>

									<Formik
										initialValues={{
											amount: "",
											paymentMethod: "",
										}}
										validationSchema={depositSchema}
										onSubmit={handleDeposit}
									>
										{({ values }) => (
											<Form className="space-y-4">
												<Input
													name="amount"
													type="number"
													icon={DollarSign}
													label="مبلغ (تومان)"
													placeholder="۱۰۰,۰۰۰"
												/>

												<Select
													name="paymentMethod"
													label="روش پرداخت"
													icon={CreditCard}
													options={[
														{
															value: "",
															label: "انتخاب روش پرداخت",
														},
														{
															value: "online",
															label: "پرداخت آنلاین",
														},
														{
															value: "card",
															label: "کارت به کارت",
														},
														{
															value: "pos",
															label: "دستگاه کارتخوان",
														},
													]}
												/>

												<div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
													<p className="text-sm text-blue-700 dark:text-blue-400">
														حداقل مبلغ شارژ: ۱۰,۰۰۰
														تومان
														<br />
														حداکثر مبلغ شارژ:
														۵۰,۰۰۰,۰۰۰ تومان
													</p>
												</div>

												<div className="flex gap-4">
													<Button
														type="button"
														variant="outline"
														className="flex-1"
														onClick={() =>
															setDepositDialogOpen(
																false,
															)
														}
													>
														انصراف
													</Button>
													<Button
														type="submit"
														variant="luxury"
														className="flex-1"
														disabled={loading}
													>
														{loading
															? "در حال پردازش..."
															: "پرداخت"}
													</Button>
												</div>
											</Form>
										)}
									</Formik>
								</DialogContent>
							</Dialog>

							{/* Export Button */}
							<Button
								variant="outline"
								className="gap-2 h-14"
								size="lg"
							>
								<Download className="w-5 h-5" />
								دریافت گزارش تراکنش‌ها
							</Button>
						</motion.div>
					</div>

					{/* Transactions */}
					<div className="lg:col-span-3">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.5 }}
						>
							<Card>
								<div className="bg-gradient-to-r from-primary-rose/10 via-accent-gold/10 to-secondary-plum/10 p-4 border-b">
									<div className="flex items-center justify-between">
										<h2 className="text-xl font-bold flex items-center gap-2">
											<TrendingUp className="w-5 h-5" />
											تاریخچه تراکنش‌ها
										</h2>
										<div className="flex items-center gap-2">
											<Filter className="w-4 h-4 text-muted-foreground" />
											<select
												value={filterType}
												onChange={(e) =>
													setFilterType(
														e.target.value,
													)
												}
												className="px-3 py-1 border rounded-lg text-sm focus:border-primary-rose focus:outline-none"
											>
												<option value="all">همه</option>
												<option value="deposit">
													واریز
												</option>
												<option value="withdrawal">
													برداشت
												</option>
												<option value="refund">
													بازگشت وجه
												</option>
												<option value="bonus">
													پاداش
												</option>
											</select>
										</div>
									</div>
								</div>

								<CardContent className="p-0">
									<div className="divide-y">
										<AnimatePresence mode="popLayout">
											{filteredTransactions.map(
												(transaction, index) => (
													<motion.div
														key={transaction.id}
														layout
														initial={{
															opacity: 0,
															x: -20,
														}}
														animate={{
															opacity: 1,
															x: 0,
														}}
														exit={{
															opacity: 0,
															x: 20,
														}}
														transition={{
															delay: index * 0.05,
														}}
														className="p-4 hover:bg-muted/50 transition-colors"
													>
														<div className="flex items-center gap-4">
															{/* Icon */}
															<div className="flex-shrink-0">
																<div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
																	{getTransactionIcon(
																		transaction.type,
																	)}
																</div>
															</div>

															{/* Details */}
															<div className="flex-1 min-w-0">
																<div className="flex items-center gap-2 mb-1">
																	<p className="font-semibold truncate">
																		{
																			transaction.description
																		}
																	</p>
																	<Badge
																		variant={
																			transaction.type ===
																				"deposit" ||
																			transaction.type ===
																				"refund" ||
																			transaction.type ===
																				"bonus"
																				? "available"
																				: "outOfStock"
																		}
																		className="text-xs"
																	>
																		{getTransactionTypeName(
																			transaction.type,
																		)}
																	</Badge>
																</div>
																<p className="text-sm text-muted-foreground">
																	{
																		transaction.date
																	}{" "}
																	-{" "}
																	{
																		transaction.time
																	}
																</p>
																<p className="text-xs text-muted-foreground mt-1">
																	شماره
																	پیگیری:{" "}
																	{
																		transaction.reference
																	}
																</p>
															</div>

															{/* Amount & Status */}
															<div className="text-left">
																<p
																	className={`text-xl font-bold ${
																		transaction.type ===
																		"withdrawal"
																			? "text-red-600"
																			: "text-green-600"
																	}`}
																>
																	{transaction.type ===
																	"withdrawal"
																		? "-"
																		: "+"}
																	{formatPrice(
																		transaction.amount,
																	)}
																</p>
																<p className="text-xs text-muted-foreground mt-1">
																	تومان
																</p>
																{transaction.status ===
																	"pending" && (
																	<Badge
																		variant="outOfStock"
																		className="mt-2 text-xs"
																	>
																		در
																		انتظار
																	</Badge>
																)}
															</div>
														</div>
													</motion.div>
												),
											)}
										</AnimatePresence>
									</div>

									{filteredTransactions.length === 0 && (
										<div className="p-12 text-center">
											<div className="w-20 h-20 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
												<Wallet className="w-10 h-10 text-muted-foreground" />
											</div>
											<p className="text-muted-foreground">
												تراکنشی یافت نشد
											</p>
										</div>
									)}
								</CardContent>
							</Card>
						</motion.div>
					</div>
				</div>
			</div>
		</div>
	);
}
