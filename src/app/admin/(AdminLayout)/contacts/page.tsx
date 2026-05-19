"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { getData } from "@/services/services";
import PermissionGuard from "@/components/admin/PermissionGuard";

interface ContactMessage {
	id: number;
	name: string;
	email: string;
	subject: string;
	message: string;
	createdAt: string;
}

function AdminContactsPageContent() {
	const [messages, setMessages] = useState<ContactMessage[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [selected, setSelected] = useState<ContactMessage | null>(null);

	useEffect(() => {
		getData({ endPoint: "/v1/admin/contact-messages" })
			.then((res) => {
				setMessages(res?.data ?? []);
			})
			.catch(() => {})
			.finally(() => setLoading(false));
	}, []);

	const filtered = search
		? messages.filter(
				(m) =>
					m.name?.toLowerCase().includes(search?.toLowerCase()) ||
					m.email?.toLowerCase().includes(search?.toLowerCase()) ||
					m.subject?.toLowerCase().includes(search?.toLowerCase()),
			)
		: messages;

	return (
		<main className="p-6">
			<div className="mb-8">
				<h1 className="text-3xl font-bold mb-2">پیام‌های تماس</h1>
				<p className="text-muted-foreground">
					پیام‌هایی که کاربران از طریق فرم تماس ارسال کرده‌اند
				</p>
			</div>

			<div className="flex items-center gap-3 mb-6">
				<div className="relative flex-1 max-w-sm">
					<Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
					<Input
						placeholder="جستجو در نام، ایمیل یا موضوع..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="pr-9"
					/>
				</div>
				<span className="text-sm text-muted-foreground">
					{filtered.length} پیام
				</span>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="lg:col-span-2"
				>
					<Card>
						<CardContent className="p-0">
							{loading ? (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>نام</TableHead>
											<TableHead>ایمیل</TableHead>
											<TableHead>موضوع</TableHead>
											<TableHead>تاریخ</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{Array.from({ length: 6 }).map((_, i) => (
											<TableRow key={i}>
												<TableCell><Skeleton className="h-4 w-24" /></TableCell>
												<TableCell><Skeleton className="h-4 w-32" /></TableCell>
												<TableCell><Skeleton className="h-4 w-40" /></TableCell>
												<TableCell><Skeleton className="h-4 w-20" /></TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							) : filtered.length === 0 ? (
								<div className="p-8 text-center text-muted-foreground">
									پیامی یافت نشد
								</div>
							) : (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>نام</TableHead>
											<TableHead>ایمیل</TableHead>
											<TableHead>موضوع</TableHead>
											<TableHead>تاریخ</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{filtered.map((msg) => (
											<TableRow
												key={msg.id}
												className={`cursor-pointer transition-colors ${selected?.id === msg.id ? "bg-muted" : "hover:bg-muted/50"}`}
												onClick={() =>
													setSelected(
														selected?.id === msg.id
															? null
															: msg,
													)
												}
											>
												<TableCell className="font-medium">
													{msg.name}
												</TableCell>
												<TableCell className="text-muted-foreground">
													{msg.email}
												</TableCell>
												<TableCell>
													{msg.subject}
												</TableCell>
												<TableCell className="text-muted-foreground text-sm">
													{new Date(
														msg.createdAt,
													).toLocaleDateString(
														"fa-IR",
													)}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							)}
						</CardContent>
					</Card>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
				>
					{selected ? (
						<Card>
							<CardHeader>
								<div className="flex items-center gap-2">
									<Mail className="w-5 h-5 text-primary-rose" />
									<CardTitle className="text-lg">
										{selected.subject}
									</CardTitle>
								</div>
								<div className="space-y-1 text-sm text-muted-foreground">
									<p>{selected.name}</p>
									<p>{selected.email}</p>
									<p>
										{new Date(
											selected.createdAt,
										).toLocaleString("fa-IR")}
									</p>
								</div>
							</CardHeader>
							<CardContent>
								<p className="text-sm leading-relaxed whitespace-pre-wrap">
									{selected.message}
								</p>
							</CardContent>
						</Card>
					) : (
						<Card className="border-dashed">
							<CardContent className="p-8 text-center text-muted-foreground">
								<Mail className="w-10 h-10 mx-auto mb-3 opacity-30" />
								<p>روی یک پیام کلیک کنید تا متن آن را ببینید</p>
							</CardContent>
						</Card>
					)}
				</motion.div>
			</div>
		</main>
	);
}

export default function AdminContactsPage() {
	return (
		<PermissionGuard permission="contact:see">
			<AdminContactsPageContent />
		</PermissionGuard>
	);
}
