"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Loader, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import InputFree from "@/components/Custom/Input/InputFree";
import CustomToast from "@/components/Custom/CustomToast/CustomToast";
import useUserStore from "@/store/userStore/userStore";
import { sendOTP, verifyOTP } from "@/services/authService";

const toE164 = (phone: string) =>
	phone.startsWith("0") ? "+98" + phone.slice(1) : phone;

export default function SignIn() {
	const [step, setStep] = useState<"phone" | "otp">("phone");
	const [phone, setPhone] = useState("");
	const [otp, setOtp] = useState(["", "", "", "", "", ""]);
	const [isLoading, setIsLoading] = useState(false);
	const [resendTimer, setResendTimer] = useState(0);
	const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
	const { setAccessToken, setRefreshToken, setFirstName, setLastName } = useUserStore();
	const router = useRouter();

	useEffect(() => {
		if (resendTimer <= 0) return;
		const id = setTimeout(() => setResendTimer((t) => t - 1), 1000);
		return () => clearTimeout(id);
	}, [resendTimer]);

	const handleSendOTP = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!phone) return;
		setIsLoading(true);
		try {
			await sendOTP(toE164(phone));
			CustomToast("کد تایید ارسال شد", "success");
			setStep("otp");
			setResendTimer(60);
			setTimeout(() => otpRefs.current[0]?.focus(), 100);
		} finally {
			setIsLoading(false);
		}
	};

	const handleVerifyOTP = async (e: React.FormEvent) => {
		e.preventDefault();
		const code = otp.join("");
		if (code.length < 6) return;
		setIsLoading(true);
		try {
			const data = await verifyOTP(toE164(phone), code);
			setAccessToken(data?.data?.accessToken);
			setRefreshToken(data?.data?.refreshToken);
			setFirstName(data?.data?.firstName ?? "");
			setLastName(data?.data?.lastName ?? "");
			CustomToast("خوش آمدید!", "success");
			router.push("/");
		} finally {
			setIsLoading(false);
		}
	};

	const handleOtpChange = (index: number, value: string) => {
		if (!/^\d?$/.test(value)) return;
		const next = [...otp];
		next[index] = value;
		setOtp(next);
		if (value && index < 5) otpRefs.current[index + 1]?.focus();
	};

	const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
		if (e.key === "Backspace" && !otp[index] && index > 0) {
			otpRefs.current[index - 1]?.focus();
		}
	};

	const handleResend = async () => {
		if (resendTimer > 0) return;
		setIsLoading(true);
		try {
			await sendOTP(toE164(phone));
			CustomToast("کد جدید ارسال شد", "success");
			setOtp(["", "", "", "", "", ""]);
			setResendTimer(60);
			otpRefs.current[0]?.focus();
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-secondary-plum via-primary-rose/20 to-accent-gold/30">
			{/* Background particles */}
			<div className="absolute inset-0 opacity-20">
				{[...Array(15)].map((_, i) => (
					<motion.div
						key={i}
						className="absolute w-3 h-3 bg-white rounded-full"
						initial={{
							x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
							y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1000),
						}}
						animate={{ y: [0, -50, 0], opacity: [0.2, 0.5, 0.2] }}
						transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
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
					{/* Left panel */}
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
							<p className="text-xl mb-8 opacity-90">زیبایی لوکس ایرانی</p>

							<div className="space-y-4">
								{["محصولات لوکس", "تحویل سریع", "ضمانت اصالت", "پشتیبانی ۲۴/۷"].map((item, i) => (
									<motion.div
										key={item}
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: 0.5 + i * 0.1 }}
										className="flex items-center gap-3"
									>
										<div className="w-2 h-2 bg-accent-gold rounded-full animate-pulse" />
										<span className="opacity-90">{item}</span>
									</motion.div>
								))}
							</div>

							<motion.div
								className="mt-12 flex items-center gap-2 text-accent-gold"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 1 }}
							>
								<Sparkles className="w-5 h-5" />
								<span className="text-sm">ورود آسان با شماره موبایل</span>
							</motion.div>
						</motion.div>
					</div>

					{/* Right panel */}
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
										{step === "phone" ? "ورود / ثبت‌نام" : "تایید شماره"}
									</CardTitle>
									<CardDescription className="text-center">
										{step === "phone"
											? "شماره موبایل خود را وارد کنید"
											: `کد ارسال شده به ${phone} را وارد کنید`}
									</CardDescription>
								</motion.div>
							</CardHeader>

							<CardContent>
								<AnimatePresence mode="wait">
									{step === "phone" ? (
										<motion.form
											key="phone-form"
											initial={{ opacity: 0, x: 30 }}
											animate={{ opacity: 1, x: 0 }}
											exit={{ opacity: 0, x: -30 }}
											transition={{ duration: 0.25 }}
											onSubmit={handleSendOTP}
											className="space-y-6"
										>
											<InputFree
												label="شماره موبایل"
												icon={Phone}
												value={phone}
												onValueChange={setPhone}
											/>

											<Button
												type="submit"
												className="w-full h-12 text-lg bg-gradient-to-r from-secondary-plum to-primary-rose hover:opacity-90 transition-opacity"
												disabled={isLoading || !phone}
											>
												{isLoading ? (
													<><Loader className="w-5 h-5 animate-spin ml-2" />در حال ارسال...</>
												) : (
													"دریافت کد تایید"
												)}
											</Button>
										</motion.form>
									) : (
										<motion.form
											key="otp-form"
											initial={{ opacity: 0, x: 30 }}
											animate={{ opacity: 1, x: 0 }}
											exit={{ opacity: 0, x: -30 }}
											transition={{ duration: 0.25 }}
											onSubmit={handleVerifyOTP}
											className="space-y-6"
										>
											{/* 6-box OTP input */}
											<div className="flex justify-center gap-3" dir="ltr">
												{otp.map((digit, i) => (
													<input
														key={i}
														ref={(el) => { otpRefs.current[i] = el; }}
														type="text"
														inputMode="numeric"
														maxLength={1}
														value={digit}
														onChange={(e) => handleOtpChange(i, e.target.value)}
														onKeyDown={(e) => handleOtpKeyDown(i, e)}
														className="w-12 h-14 text-center text-xl font-bold border-2 rounded-xl focus:border-secondary-plum focus:outline-none transition-colors dark:bg-gray-800 dark:border-gray-600 dark:text-white"
													/>
												))}
											</div>

											<Button
												type="submit"
												className="w-full h-12 text-lg bg-gradient-to-r from-secondary-plum to-primary-rose hover:opacity-90 transition-opacity"
												disabled={isLoading || otp.join("").length < 6}
											>
												{isLoading ? (
													<><Loader className="w-5 h-5 animate-spin ml-2" />در حال بررسی...</>
												) : (
													"تایید و ورود"
												)}
											</Button>

											<div className="text-center text-sm text-muted-foreground space-y-2">
												<button
													type="button"
													onClick={handleResend}
													disabled={resendTimer > 0}
													className="text-secondary-plum disabled:text-muted-foreground disabled:cursor-not-allowed hover:underline transition-colors"
												>
													{resendTimer > 0 ? `ارسال مجدد (${resendTimer}ثانیه)` : "ارسال مجدد کد"}
												</button>
												<div>
													<button
														type="button"
														onClick={() => { setStep("phone"); setOtp(["", "", "", "", "", ""]); }}
														className="text-muted-foreground hover:text-foreground transition-colors"
													>
														تغییر شماره
													</button>
												</div>
											</div>
										</motion.form>
									)}
								</AnimatePresence>
							</CardContent>
						</Card>
					</motion.div>
				</div>
			</motion.div>
		</div>
	);
}
