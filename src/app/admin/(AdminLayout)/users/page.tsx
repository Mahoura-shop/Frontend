"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
	Search,
	Users,
	ShieldCheck,
	Ban,
	CheckCircle2,
	Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import InputFree from "@/components/Custom/Input/InputFree";
import CustomToast from "@/components/Custom/CustomToast/CustomToast";
import { formatDate } from "@/utils/formatDate";
import {
	getUsers,
	banUser,
	unbanUser,
	changeUserType,
	getAdminUserWallet,
	assignSubAdminRole,
} from "@/services/userService";
import { getRoles } from "@/services/roleService";
import PermissionGuard from "@/components/admin/PermissionGuard";
import { usePermission } from "@/hooks/usePermission";

interface UserItem {
	id: number;
	firstName: string;
	lastName: string;
	phone: string;
	email: string;
	status: string;
	type: string;
	isAdmin: boolean;
	roleID?: number | null;
	roleName?: string;
}

interface Role {
	id: number;
	name: string;
}

interface WalletTransaction {
	id: number;
	amount: number;
	type: number;
	createdAt: string;
}

interface UserWallet {
	balance: number;
	transactions: WalletTransaction[];
}

const TYPE_LABELS: Record<string, string> = {
	regular: "مشتری",
	shopkeeper: "فروشنده",
	fellow: "همکار",
	admin: "مدیر",
};

const TYPE_TO_NUMERIC: Record<string, number> = {
	regular: 2,
	shopkeeper: 4,
	fellow: 5,
	admin: 6,
};

const TYPE_OPTIONS = [
	{ value: "regular", label: "مشتری" },
	{ value: "shopkeeper", label: "فروشنده" },
	{ value: "fellow", label: "همکار" },
	{ value: "admin", label: "مدیر" },
];

function AdminUsersPageContent() {
	const canEditRole = usePermission("users:edit_role");
	const canBan = usePermission("users:ban");
	const canUnban = usePermission("users:unban");
	const canWallet = usePermission("users:wallet");
	const [users, setUsers] = useState<UserItem[] | null>(null);
	const [roles, setRoles] = useState<Role[]>([]);
	const [search, setSearch] = useState("");
	const [roleDialog, setRoleDialog] = useState<{
		open: boolean;
		user: UserItem | null;
	}>({ open: false, user: null });
	const [newType, setNewType] = useState("");
	const [selectedRoleID, setSelectedRoleID] = useState("");
	const [actionLoading, setActionLoading] = useState(false);
	const [walletDialog, setWalletDialog] = useState<{
		open: boolean;
		user: UserItem | null;
		wallet: UserWallet | null;
		loading: boolean;
	}>({ open: false, user: null, wallet: null, loading: false });

	const fetchUsers = useCallback(() => {
		getUsers()
			.then((res) => setUsers(res?.data ?? []))
			.catch(() => setUsers([]));
	}, []);

	useEffect(() => {
		fetchUsers();
		getRoles().then((res) => setRoles(res?.data ?? []));
	}, [fetchUsers]);

	const filtered = (users ?? []).filter((u) => {
		const q = search.toLowerCase();
		return (
			u.phone?.includes(q) ||
			u.firstName?.toLowerCase().includes(q) ||
			u.lastName?.toLowerCase().includes(q)
		);
	});

	const handleBan = async (user: UserItem) => {
		setActionLoading(true);
		try {
			await banUser(user.id);
			setUsers(
				(prev) =>
					prev?.map((u) =>
						u.id === user.id ? { ...u, status: "لیست سیاه" } : u,
					) ?? prev,
			);
			CustomToast("کاربر مسدود شد", "success");
		} finally {
			setActionLoading(false);
		}
	};

	const handleUnban = async (user: UserItem) => {
		setActionLoading(true);
		try {
			await unbanUser(user.id);
			setUsers(
				(prev) =>
					prev?.map((u) =>
						u.id === user.id ? { ...u, status: "فعال" } : u,
					) ?? prev,
			);
			CustomToast("رفع مسدودیت شد", "success");
		} finally {
			setActionLoading(false);
		}
	};

	const handleChangeRole = async () => {
		if (!roleDialog.user || !newType) return;
		setActionLoading(true);
		try {
			await changeUserType(roleDialog.user.id, TYPE_TO_NUMERIC[newType]);
			let assignedRoleID: number | null = null;
			let assignedRoleName = "";
			if (newType === "admin" && selectedRoleID) {
				const x = await assignSubAdminRole(
					roleDialog.user.id,
					Number(selectedRoleID),
				);
				console.log("x", x);
				assignedRoleID = Number(selectedRoleID);
				assignedRoleName =
					roles.find((r) => r.id === assignedRoleID)?.name ?? "";
			}
			setUsers(
				(prev) =>
					prev?.map((u) =>
						u.id === roleDialog.user!.id
							? {
									...u,
									type: newType,
									isAdmin: newType === "admin",
									roleID: assignedRoleID,
									roleName: assignedRoleName,
								}
							: u,
					) ?? prev,
			);
			CustomToast("نقش کاربر تغییر کرد", "success");
			setRoleDialog({ open: false, user: null });
			setNewType("");
			setSelectedRoleID("");
		} finally {
			setActionLoading(false);
		}
	};

	const openWalletDialog = async (user: UserItem) => {
		setWalletDialog({ open: true, user, wallet: null, loading: true });
		try {
			const res = await getAdminUserWallet(user.id);
			setWalletDialog((prev) => ({
				...prev,
				wallet: res?.data ?? null,
				loading: false,
			}));
		} catch {
			setWalletDialog((prev) => ({ ...prev, loading: false }));
		}
	};

	return (
		<main className="p-4 sm:p-6">
			<div className="mb-6">
				<h1 className="text-2xl sm:text-3xl font-bold mb-2">مدیریت کاربران</h1>
				<div className="flex items-center gap-4 text-sm">
					<span className="text-muted-foreground">
						مجموع:{" "}
						<span className="font-bold text-foreground">
							{users?.length ?? "—"}
						</span>
					</span>
				</div>
			</div>

			<div className="flex items-center justify-between mb-6 flex-wrap gap-4">
				<div className="relative flex-1 max-w-md">
					<Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
					<InputFree
						label="جستجو (نام یا شماره)..."
						value={search}
						onValueChange={setSearch}
						inputClassName="pr-10"
						data-testid="user-search"
					/>
				</div>
			</div>

			{/* Mobile Cards */}
			<div className="sm:hidden space-y-3">
				{users === null && Array.from({ length: 6 }).map((_, i) => (
					<Card key={i}>
						<CardContent className="p-4 space-y-3">
							<div className="flex justify-between">
								<Skeleton className="h-4 w-32" />
								<Skeleton className="h-5 w-14 rounded-full" />
							</div>
							<div className="flex justify-between">
								<Skeleton className="h-3 w-28" />
								<Skeleton className="h-5 w-20 rounded-full" />
							</div>
							<div className="flex justify-end gap-2">
								<Skeleton className="h-8 w-20 rounded-md" />
								<Skeleton className="h-8 w-20 rounded-md" />
							</div>
						</CardContent>
					</Card>
				))}
				{users?.length === 0 && (
					<div className="flex flex-col items-center gap-2 text-muted-foreground py-12">
						<Users className="w-10 h-10" />
						<span>کاربری یافت نشد</span>
					</div>
				)}
				{filtered.map((user, i) => {
					const isBanned = user.status === "لیست سیاه"
					const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || "بدون نام"
					return (
						<motion.div key={user.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
							<Card>
								<CardContent className="p-4">
									<div className="flex items-start justify-between gap-2 mb-2">
										<p className="font-medium">{fullName}</p>
										<Badge variant={isBanned ? "destructive" : "available"} className="text-xs shrink-0">
											{isBanned ? "مسدود" : "فعال"}
										</Badge>
									</div>
									<div className="flex items-center justify-between mb-3">
										<p className="text-sm text-muted-foreground" dir="ltr">{user.phone}</p>
										<div className="flex flex-col items-end gap-0.5">
											<Badge variant={user.isAdmin ? "outline" : "secondary"} className={user.isAdmin ? "text-xs border-amber-500 text-amber-600 w-fit" : "text-xs w-fit"}>
												{user.isAdmin && <ShieldCheck className="w-3 h-3 ml-1" />}
												{TYPE_LABELS[user.type] ?? user.type}
											</Badge>
											{user.isAdmin && <span className="text-xs text-muted-foreground">{user.roleName || "دسترسی کامل"}</span>}
										</div>
									</div>
									<div className="flex justify-end gap-2 flex-wrap">
										{canEditRole && (
											<Button data-testid={`change-role-${user.id}`} variant="outline" size="sm" onClick={() => { setRoleDialog({ open: true, user }); setNewType(user.type); setSelectedRoleID("") }} className="text-xs gap-1">
												<ShieldCheck className="w-3 h-3" />تغییر نقش
											</Button>
										)}
										{isBanned
											? canUnban && (
												<Button data-testid={`unban-${user.id}`} variant="outline" size="sm" onClick={() => handleUnban(user)} disabled={actionLoading} className="text-xs gap-1 border-green-500 text-green-600 hover:bg-green-50">
													<CheckCircle2 className="w-3 h-3" />رفع مسدودیت
												</Button>
											)
											: canBan && (
												<Button data-testid={`ban-${user.id}`} variant="outline" size="sm" onClick={() => handleBan(user)} disabled={actionLoading} className="text-xs gap-1 border-destructive text-destructive hover:bg-destructive/10">
													<Ban className="w-3 h-3" />مسدود
												</Button>
											)}
										{canWallet && (
											<Button variant="ghost" size="sm" onClick={() => openWalletDialog(user)} className="text-xs gap-1">
												<Wallet className="w-3 h-3" />کیف پول
											</Button>
										)}
									</div>
								</CardContent>
							</Card>
						</motion.div>
					)
				})}
			</div>

			{/* Desktop Table */}
			<Card className="hidden sm:block">
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>نام</TableHead>
								<TableHead>شماره تماس</TableHead>
								<TableHead>نوع حساب</TableHead>
								<TableHead>وضعیت</TableHead>
								<TableHead className="text-center">عملیات</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{users === null && Array.from({ length: 7 }).map((_, i) => (
								<TableRow key={i}>
									<TableCell><Skeleton className="h-4 w-28" /></TableCell>
									<TableCell><Skeleton className="h-4 w-28" /></TableCell>
									<TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
									<TableCell><Skeleton className="h-5 w-14 rounded-full" /></TableCell>
									<TableCell>
										<div className="flex items-center justify-center gap-2">
											<Skeleton className="h-8 w-20 rounded-md" />
											<Skeleton className="h-8 w-20 rounded-md" />
											<Skeleton className="h-8 w-16 rounded-md" />
										</div>
									</TableCell>
								</TableRow>
							))}
							{users?.length === 0 && (
								<TableRow>
									<TableCell colSpan={5} className="text-center py-12">
										<div className="flex flex-col items-center gap-2 text-muted-foreground">
											<Users className="w-10 h-10" />
											<span>کاربری یافت نشد</span>
										</div>
									</TableCell>
								</TableRow>
							)}
							{filtered.map((user, i) => {
								const isBanned = user.status === "لیست سیاه"
								const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || "بدون نام"
								return (
									<motion.tr key={user.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className="group hover:bg-muted/50 border-b">
										<TableCell className="font-medium">{fullName}</TableCell>
										<TableCell className="text-sm text-muted-foreground" dir="ltr">{user.phone}</TableCell>
										<TableCell>
											<div className="flex flex-col gap-1">
												<Badge variant={user.isAdmin ? "outline" : "secondary"} className={user.isAdmin ? "text-xs border-amber-500 text-amber-600 w-fit" : "text-xs w-fit"}>
													{user.isAdmin && <ShieldCheck className="w-3 h-3 ml-1" />}
													{TYPE_LABELS[user.type] ?? user.type}
												</Badge>
												{user.isAdmin && <span className="text-xs text-muted-foreground">{user.roleName || "دسترسی کامل"}</span>}
											</div>
										</TableCell>
										<TableCell>
											<Badge variant={isBanned ? "destructive" : "available"} className="text-xs">
												{isBanned ? "مسدود" : "فعال"}
											</Badge>
										</TableCell>
										<TableCell>
											<div className="flex items-center justify-center gap-2">
												{canEditRole && (
													<Button data-testid={`change-role-${user.id}`} variant="outline" size="sm" onClick={() => { setRoleDialog({ open: true, user }); setNewType(user.type); setSelectedRoleID("") }} className="text-xs gap-1">
														<ShieldCheck className="w-3 h-3" />تغییر نقش
													</Button>
												)}
												{isBanned
													? canUnban && (
														<Button data-testid={`unban-${user.id}`} variant="outline" size="sm" onClick={() => handleUnban(user)} disabled={actionLoading} className="text-xs gap-1 border-green-500 text-green-600 hover:bg-green-50">
															<CheckCircle2 className="w-3 h-3" />رفع مسدودیت
														</Button>
													)
													: canBan && (
														<Button data-testid={`ban-${user.id}`} variant="outline" size="sm" onClick={() => handleBan(user)} disabled={actionLoading} className="text-xs gap-1 border-destructive text-destructive hover:bg-destructive/10">
															<Ban className="w-3 h-3" />مسدود
														</Button>
													)}
												{canWallet && (
													<Button variant="ghost" size="sm" onClick={() => openWalletDialog(user)} className="text-xs gap-1">
														<Wallet className="w-3 h-3" />کیف پول
													</Button>
												)}
											</div>
										</TableCell>
									</motion.tr>
								)
							})}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			{/* Role Dialog */}
			<Dialog
				open={roleDialog.open}
				onOpenChange={(open) =>
					setRoleDialog({ open, user: open ? roleDialog.user : null })
				}
			>
				<DialogContent className="max-w-sm">
					<DialogHeader>
						<DialogTitle>تغییر نقش کاربر</DialogTitle>
					</DialogHeader>
					<div className="space-y-4 py-2 rtl">
						<p className="text-sm text-muted-foreground">
							{roleDialog.user?.firstName}{" "}
							{roleDialog.user?.lastName} {roleDialog.user?.phone}
						</p>
						<Select
							value={newType}
							onValueChange={(v) => {
								setNewType(v);
								setSelectedRoleID("");
							}}
						>
							<SelectTrigger data-testid="user-type-select">
								<SelectValue placeholder="انتخاب نوع حساب" />
							</SelectTrigger>
							<SelectContent>
								{TYPE_OPTIONS.map((opt) => (
									<SelectItem
										key={opt.value}
										value={opt.value}
									>
										{opt.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						{newType === "admin" && roles.length > 0 && (
							<div className="space-y-1">
								<p className="text-xs text-muted-foreground">
									نقش مدیریتی (اختیاری — بدون نقش = دسترسی
									کامل)
								</p>
								<Select
									value={selectedRoleID}
									onValueChange={setSelectedRoleID}
								>
									<SelectTrigger>
										<SelectValue placeholder="انتخاب نقش" />
									</SelectTrigger>
									<SelectContent>
										{roles.map((r) => (
											<SelectItem
												key={r.id}
												value={String(r.id)}
											>
												{r.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						)}
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() =>
								setRoleDialog({ open: false, user: null })
							}
						>
							انصراف
						</Button>
						<Button
							data-testid="confirm-role-change"
							onClick={handleChangeRole}
							disabled={actionLoading || !newType}
						>
							تایید
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Wallet Dialog */}
			<Dialog
				open={walletDialog.open}
				onOpenChange={(open) =>
					setWalletDialog({
						open,
						user: open ? walletDialog.user : null,
						wallet: null,
						loading: false,
					})
				}
			>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>
							کیف پول — {walletDialog.user?.firstName}{" "}
							{walletDialog.user?.lastName}
						</DialogTitle>
					</DialogHeader>
					{walletDialog.loading ? (
						<p className="text-sm text-muted-foreground py-4 text-center">
							در حال بارگذاری...
						</p>
					) : walletDialog.wallet ? (
						<div className="space-y-4">
							<div className="rounded-lg bg-muted px-4 py-3 flex items-center justify-between">
								<span className="text-sm text-muted-foreground">
									موجودی
								</span>
								<span className="font-bold text-lg">
									{new Intl.NumberFormat("fa-IR").format(
										walletDialog.wallet.balance,
									)}{" "}
									ریال
								</span>
							</div>
							<div>
								<p className="text-sm font-medium mb-2">
									تراکنش‌ها
								</p>
								{walletDialog.wallet.transactions.length ===
								0 ? (
									<p className="text-xs text-muted-foreground">
										تراکنشی ثبت نشده
									</p>
								) : (
									<div className="space-y-2 max-h-64 overflow-y-auto">
										{walletDialog.wallet.transactions.map(
											(t) => (
												<div
													key={t.id}
													className="flex items-center justify-between text-xs bg-background border rounded p-2"
												>
													<span className="text-muted-foreground">
														{formatDate(
															t.createdAt,
														)}
													</span>
													<span
														className={
															t.type === 1
																? "text-green-600"
																: "text-destructive"
														}
													>
														{t.type === 1
															? "+"
															: "-"}
														{new Intl.NumberFormat(
															"fa-IR",
														).format(t.amount)}{" "}
														ریال
													</span>
												</div>
											),
										)}
									</div>
								)}
							</div>
						</div>
					) : (
						<p className="text-sm text-muted-foreground py-4 text-center">
							اطلاعاتی یافت نشد
						</p>
					)}
				</DialogContent>
			</Dialog>
		</main>
	);
}

export default function AdminUsersPage() {
	return (
		<PermissionGuard permission="users:see">
			<AdminUsersPageContent />
		</PermissionGuard>
	);
}
