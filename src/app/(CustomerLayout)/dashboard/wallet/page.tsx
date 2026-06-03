"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Wallet,
	Plus,
	TrendingUp,
	ArrowUpRight,
	ArrowDownLeft,
	Filter,
	Eye,
	EyeOff,
	RefreshCw,
	DollarSign,
} from "lucide-react";
import SelectFree from "@/components/Custom/Select/SelectFree";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Input from "@/components/Custom/Input/Input";
import CustomToast from "@/components/Custom/CustomToast/CustomToast";
import { formatPrice } from "@/utils/formatPrice";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { getWalletBalance, depositWallet, getWalletHistory } from "@/services/walletService";

interface Transaction {
	id: number;
	amount: number;
	type: number;
	createdAt: string;
}

const depositSchema = Yup.object({
	amount: Yup.number()
		.min(10000, "حداقل مبلغ واریز ۱۰٬۰۰۰ ریال است")
		.max(50000000, "حداکثر مبلغ واریز ۵۰٬۰۰۰٬۰۰۰ ریال است")
		.required("مبلغ الزامی است"),
});

export default function WalletPage() {
	const [balance, setBalance] = useState<number | null>(null);
	const [showBalance, setShowBalance] = useState(true);
	const [filterType, setFilterType] = useState("all");
	const [depositDialogOpen, setDepositDialogOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [txLoading, setTxLoading] = useState(true);
	const isMobile = useIsMobile();

	useEffect(() => {
		getWalletBalance()
			.then((res) => setBalance(res?.data?.balance ?? 0))
			.catch(() => setBalance(0));

		getWalletHistory()
			.then((res) => setTransactions(res?.data ?? []))
			.catch(() => setTransactions([]))
			.finally(() => setTxLoading(false));
	}, []);

	const getTransactionIcon = (type: number) => {
		if (type === 1) return <ArrowDownLeft className="w-5 h-5 text-green-600" />;
		if (type === 2) return <ArrowUpRight className="w-5 h-5 text-red-600" />;
		return <RefreshCw className="w-5 h-5 text-blue-600" />;
	};

	const getTransactionTypeName = (type: number) => {
		if (type === 1) return "واریز";
		if (type === 2) return "برداشت";
		return "تراکنش";
	};

	const filteredTransactions =
		filterType === "all"
			? transactions
			: transactions.filter((t) => {
					if (filterType === "deposit") return t.type === 1;
					if (filterType === "withdrawal") return t.type === 2;
					return true;
			  });

	const handleDeposit = async (values: { amount: string }) => {
		setLoading(true);
		try {
			const res = await depositWallet(Number(values.amount));
			const newBalance = res?.data?.balance ?? balance;
			setBalance(newBalance);
			const history = await getWalletHistory();
			setTransactions(history?.data ?? []);
			CustomToast("کیف پول با موفقیت شارژ شد", "success");
			setDepositDialogOpen(false);
		} catch {
			CustomToast("شارژ کیف پول با خطا مواجه شد", "error");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-8">
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
					{/* Balance Card */}
					<div className="lg:col-span-3 grid md:grid-cols-2 gap-6">
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
											onClick={() => setShowBalance(!showBalance)}
										>
											{showBalance ? (
												<Eye className="w-5 h-5" />
											) : (
												<EyeOff className="w-5 h-5" />
											)}
										</Button>
									</div>
									<div className="space-y-2">
										<p className="text-3xl font-bold gradient-text" data-testid="wallet-balance">
											{showBalance
												? balance === null
													? "..."
													: formatPrice(balance)
												: "••••••"}
										</p>
										<p className="text-sm text-muted-foreground">ریال</p>
									</div>
								</CardContent>
							</Card>
						</motion.div>

						{/* Total transactions summary */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
						>
							<Card className="border-2">
								<CardContent className="p-6">
									<div className="flex items-center gap-3 mb-4">
										<div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
											<TrendingUp className="w-6 h-6 text-green-600" />
										</div>
										<div>
											<p className="text-sm text-muted-foreground">
												تعداد تراکنش‌ها
											</p>
											<p className="text-xs text-muted-foreground">
												کل
											</p>
										</div>
									</div>
									<div className="space-y-2">
										<p className="text-2xl font-bold text-green-600">
											{transactions.length}
										</p>
										<p className="text-sm text-muted-foreground">تراکنش</p>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					</div>

					{/* Deposit Button */}
					<div className="lg:col-span-3">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3 }}
						>
							{isMobile ? (
								<Drawer
									open={depositDialogOpen}
									onOpenChange={setDepositDialogOpen}
								>
									<DrawerTrigger asChild>
										<Button variant="luxury" className="gap-2 h-14 w-full md:w-auto" size="lg">
											<Plus className="w-5 h-5" />
											شارژ کیف پول
										</Button>
									</DrawerTrigger>
									<DrawerContent className="max-h-[90vh]">
										<DrawerHeader>
											<DrawerTitle>شارژ کیف پول</DrawerTitle>
										</DrawerHeader>
										<div className="overflow-y-auto overscroll-contain px-4 pb-6">
											<Formik
												initialValues={{ amount: "" }}
												validationSchema={depositSchema}
												onSubmit={handleDeposit}
											>
												{() => (
													<Form className="space-y-4">
														<Input
															name="amount"
															type="text"
															isPriceInput
															icon={DollarSign}
															label="مبلغ (ریال)"
															placeholder="۱۰۰,۰۰۰"
														/>
														<div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
															<p className="text-sm text-blue-700 dark:text-blue-400">
																حداقل مبلغ شارژ: ۱۰٬۰۰۰ ریال
																<br />
																حداکثر مبلغ شارژ: ۵۰٬۰۰۰٬۰۰۰ ریال
															</p>
														</div>
														<div className="flex gap-4">
															<Button
																type="button"
																variant="outline"
																className="flex-1"
																onClick={() => setDepositDialogOpen(false)}
															>
																انصراف
															</Button>
															<Button
																type="submit"
																variant="luxury"
																className="flex-1"
																disabled={loading}
															>
																{loading ? "در حال پردازش..." : "پرداخت"}
															</Button>
														</div>
													</Form>
												)}
											</Formik>
										</div>
									</DrawerContent>
								</Drawer>
							) : (
								<Dialog
									open={depositDialogOpen}
									onOpenChange={setDepositDialogOpen}
								>
									<DialogTrigger asChild>
										<Button variant="luxury" className="gap-2 h-14 w-full md:w-auto" size="lg" data-testid="open-deposit">
											<Plus className="w-5 h-5" />
											شارژ کیف پول
										</Button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>شارژ کیف پول</DialogTitle>
										</DialogHeader>
										<Formik
											initialValues={{ amount: "" }}
											validationSchema={depositSchema}
											onSubmit={handleDeposit}
										>
											{() => (
												<Form className="space-y-4">
													<Input
														name="amount"
														type="text"
														isPriceInput
														icon={DollarSign}
														label="مبلغ (ریال)"
														placeholder="۱۰۰,۰۰۰"
														data-testid="deposit-amount"
													/>
													<div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
														<p className="text-sm text-blue-700 dark:text-blue-400">
															حداقل مبلغ شارژ: ۱۰٬۰۰۰ ریال
															<br />
															حداکثر مبلغ شارژ: ۵۰٬۰۰۰٬۰۰۰ ریال
														</p>
													</div>
													<div className="flex gap-4">
														<Button
															type="button"
															variant="outline"
															className="flex-1"
															onClick={() => setDepositDialogOpen(false)}
														>
															انصراف
														</Button>
														<Button
															type="submit"
															variant="luxury"
															className="flex-1"
															disabled={loading}
															data-testid="submit-deposit"
														>
															{loading ? "در حال پردازش..." : "پرداخت"}
														</Button>
													</div>
												</Form>
											)}
										</Formik>
									</DialogContent>
								</Dialog>
							)}
						</motion.div>
					</div>

					{/* Transactions */}
					<div className="lg:col-span-3">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.4 }}
						>
							<Card>
								<div className="bg-gradient-to-r from-primary-rose/10 via-accent-gold/10 to-secondary-plum/10 p-4 border-b">
									<div className="flex items-center justify-between">
										<h2 className="text-xl font-bold flex items-center gap-2">
											<TrendingUp className="w-5 h-5" />
											تاریخچه تراکنش‌ها
										</h2>
										<SelectFree
										label="فیلتر"
										icon={Filter}
										value={filterType}
										onValueChange={setFilterType}
										options={[
											{ value: "all", label: "همه" },
											{ value: "deposit", label: "واریز" },
											{ value: "withdrawal", label: "برداشت" },
										]}
										className="w-36"
									/>
									</div>
								</div>

								<CardContent className="p-0">
									<div className="divide-y">
										{txLoading ? (
											Array.from({ length: 4 }).map((_, i) => (
												<div key={i} className="p-4">
													<div className="flex items-center gap-4">
														<Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
														<div className="flex-1 space-y-2">
															<Skeleton className="h-5 w-16 rounded-full" />
															<Skeleton className="h-3 w-24" />
														</div>
														<div className="space-y-1 text-left">
															<Skeleton className="h-6 w-24" />
															<Skeleton className="h-3 w-8 ms-auto" />
														</div>
													</div>
												</div>
											))
										) : (
										<AnimatePresence mode="popLayout">
											{filteredTransactions.map((transaction, index) => (
												<motion.div
													key={transaction.id}
													layout
													initial={{ opacity: 0, x: -20 }}
													animate={{ opacity: 1, x: 0 }}
													exit={{ opacity: 0, x: 20 }}
													transition={{ delay: index * 0.05 }}
													className="p-4 hover:bg-muted/50 transition-colors"
												>
													<div className="flex items-center gap-4">
														<div className="flex-shrink-0">
															<div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
																{getTransactionIcon(transaction.type)}
															</div>
														</div>

														<div className="flex-1 min-w-0">
															<div className="flex items-center gap-2 mb-1">
																<Badge
																	variant={transaction.type === 1 ? "available" : "outOfStock"}
																	className="text-xs"
																>
																	{getTransactionTypeName(transaction.type)}
																</Badge>
															</div>
															<p className="text-sm text-muted-foreground">
																{new Date(transaction.createdAt).toLocaleDateString("fa-IR")}
															</p>
														</div>

														<div className="text-left">
															<p
																className={`text-xl font-bold ${
																	transaction.type === 2 ? "text-red-600" : "text-green-600"
																}`}
															>
																{transaction.type === 2 ? "-" : "+"}
																{formatPrice(transaction.amount)}
															</p>
															<p className="text-xs text-muted-foreground mt-1">ریال</p>
														</div>
													</div>
												</motion.div>
											))}
										</AnimatePresence>
										)}
									</div>

									{!txLoading && filteredTransactions.length === 0 && (
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
