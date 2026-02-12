"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Shield, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		// Simulate API call
		setTimeout(() => {
			if (email === "admin@mahoura.com" && password === "admin123") {
				router.push("/admin/dashboard");
			} else {
				setError("ایمیل یا رمز عبور اشتباه است");
				setIsLoading(false);
			}
		}, 1500);
	};

	return (
		<div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-secondary-plum via-primary-rose/20 to-accent-gold/30">
			{/* Animated Background Particles */}
			<div className="absolute inset-0 opacity-20">
				{[...Array(15)].map((_, i) => (
					<motion.div
						key={i}
						className="absolute w-3 h-3 bg-white rounded-full"
						initial={{
							x:
								Math.random() *
								(typeof window !== "undefined"
									? window.innerWidth
									: 1000),
							y:
								Math.random() *
								(typeof window !== "undefined"
									? window.innerHeight
									: 1000),
						}}
						animate={{
							y: [0, -50, 0],
							opacity: [0.2, 0.5, 0.2],
						}}
						transition={{
							duration: 4 + Math.random() * 2,
							repeat: Infinity,
							delay: Math.random() * 2,
						}}
					/>
				))}
			</div>

			<motion.div
				initial={{ opacity: 0, y: 50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="w-full max-w-5xl mx-4 relative z-10"
			>
				<div className="grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-2xl">
					{/* Left Side - Branding */}
					<div className="bg-gradient-to-br from-secondary-plum to-primary-rose p-12 flex flex-col justify-center text-white relative overflow-hidden">
						<div className="absolute inset-0 opacity-10">
							<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI0ZGRiIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-20" />
						</div>

						<motion.div
							initial={{ opacity: 0, x: -30 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.3 }}
						>
							<h1 className="text-5xl font-bold mb-4">Mahoura</h1>
							<p className="text-xl mb-8 opacity-90">
								پنل مدیریت محصولات
							</p>

							<div className="space-y-4">
								{[
									"مدیریت محصولات",
									"مدیریت دسته‌بندی‌ها",
									"مدیریت برندها",
									"آمار و گزارشات",
								].map((feature, i) => (
									<motion.div
										key={feature}
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: 0.5 + i * 0.1 }}
										className="flex items-center gap-3"
									>
										<div className="w-2 h-2 bg-accent-gold rounded-full animate-pulse" />
										<span className="opacity-90">
											{feature}
										</span>
									</motion.div>
								))}
							</div>

							{/* <motion.div
								className="mt-12 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20"
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 1 }}
							>
								<div className="flex items-center gap-2 text-sm">
									<Shield className="w-5 h-5 text-accent-gold" />
									<span>ورود امن با رمزنگاری SSL</span>
								</div>
							</motion.div> */}
						</motion.div>
					</div>

					{/* Right Side - Login Form */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2 }}
						className="bg-white dark:bg-gray-900 p-12"
					>
						<Card className="border-0 shadow-none">
							<CardHeader className="space-y-1 pb-8">
								<motion.div
									initial={{ scale: 0.8, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									transition={{ delay: 0.4 }}
								>
									<CardTitle className="text-3xl font-bold text-center mb-2">
										ورود مدیریت
									</CardTitle>
									<CardDescription className="text-center">
										برای دسترسی به پنل مدیریت وارد شوید
									</CardDescription>
								</motion.div>
							</CardHeader>

							<CardContent>
								<form
									onSubmit={handleSubmit}
									className="space-y-6"
								>
									<motion.div
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.5 }}
										className="space-y-2"
									>
										<label className="text-sm font-medium">
											ایمیل
										</label>
										<div className="relative">
											<Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
											<Input
												type="email"
												placeholder="admin@mahoura.com"
												value={email}
												onChange={(e) =>
													setEmail(e.target.value)
												}
												className="pr-10 h-12"
												required
											/>
										</div>
									</motion.div>

									<motion.div
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.6 }}
										className="space-y-2"
									>
										<label className="text-sm font-medium">
											رمز عبور
										</label>
										<div className="relative">
											<Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
											<Input
												type={
													showPassword
														? "text"
														: "password"
												}
												placeholder="••••••••"
												value={password}
												onChange={(e) =>
													setPassword(e.target.value)
												}
												className="pr-10 pl-10 h-12"
												required
											/>
											<button
												type="button"
												onClick={() =>
													setShowPassword(
														!showPassword,
													)
												}
												className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
											>
												{showPassword ? (
													<EyeOff className="w-5 h-5" />
												) : (
													<Eye className="w-5 h-5" />
												)}
											</button>
										</div>
									</motion.div>

									{error && (
										<motion.div
											initial={{ opacity: 0, x: -10 }}
											animate={{ opacity: 1, x: 0 }}
											className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg"
										>
											{error}
										</motion.div>
									)}

									<motion.div
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.7 }}
									>
										<Button
											type="submit"
											className="w-full h-12 text-lg bg-gradient-to-r from-secondary-plum to-primary-rose hover:opacity-90 transition-opacity"
											disabled={isLoading}
										>
											{isLoading ? (
												<>
													<Loader className="w-5 h-5 animate-spin ml-2" />
													در حال ورود...
												</>
											) : (
												"ورود به پنل"
											)}
										</Button>
									</motion.div>

									{/* <motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 0.8 }}
										className="text-center"
									>
										<a
											href="#"
											className="text-sm text-muted-foreground hover:text-primary transition-colors"
										>
											رمز عبور خود را فراموش کرده‌اید؟
										</a>
									</motion.div> */}
								</form>

								{/* <motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 1 }}
									className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center text-sm text-muted-foreground"
								>
									<p className="mb-1">برای تست:</p>
									<p className="font-mono">
										admin@mahoura.com / admin123
									</p>
								</motion.div> */}
							</CardContent>
						</Card>
					</motion.div>
				</div>
			</motion.div>
		</div>
	);
}
