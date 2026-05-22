"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Loader, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import InputFree from "@/components/Custom/Input/InputFree";
import CustomToast from "@/components/Custom/CustomToast/CustomToast";
import useUserStore from "@/store/userStore/userStore";
import { sendOTP, verifyOTP } from "@/services/authService";
import { patchData } from "@/services/services";

const spring = { type: "spring", stiffness: 400, damping: 30 };
const stepVariants = {
	enter: { opacity: 0, scale: 0.96, filter: "blur(4px)" },
	center: { opacity: 1, scale: 1, filter: "blur(0px)" },
	exit: { opacity: 0, scale: 1.03, filter: "blur(4px)" },
};

export default function SignIn() {
	const [step, setStep] = useState<"phone" | "otp" | "name">("phone");
	const [phone, setPhone] = useState("");
	const [otp, setOtp] = useState(["", "", "", "", "", ""]);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [resendTimer, setResendTimer] = useState(0);
	const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
	const { setAccessToken, setRefreshToken, setFirstName: storeSetFirstName, setLastName: storeSetLastName, setIsAdmin, setUserType, setPermissions } = useUserStore();
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
			await sendOTP(phone);
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
			const data = await verifyOTP(phone, code);
			setAccessToken(data?.data?.accessToken);
			setRefreshToken(data?.data?.refreshToken);
			storeSetFirstName(data?.data?.firstName ?? "");
			storeSetLastName(data?.data?.lastName ?? "");
			setIsAdmin(data?.data?.isAdmin ?? false);
			setUserType(data?.data?.type ?? "regular");
			setPermissions(data?.data?.permissions ?? []);
			CustomToast("خوش آمدید!", "success");

			const returnedFirstName = data?.data?.firstName ?? "";
			const returnedLastName = data?.data?.lastName ?? "";

			if (!returnedFirstName || !returnedLastName) {
				setStep("name");
			} else {
				router.push(data?.data?.isAdmin ? "/admin/dashboard" : "/");
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleCompleteName = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!firstName.trim() || !lastName.trim()) {
			CustomToast("نام و نام خانوادگی را وارد کنید", "error");
			return;
		}

		setIsLoading(true);
		try {
			await patchData({
				endPoint: "/v1/profile",
				data: { firstName, lastName },
			});

			storeSetFirstName(firstName);
			storeSetLastName(lastName);
			CustomToast("پروفایل شما تکمیل شد", "success");

			const isAdmin = useUserStore.getState().isAdmin;
			router.push(isAdmin ? "/admin/dashboard" : "/");
		} catch (error) {
			CustomToast("خطایی در ذخیره اطلاعات رخ داد", "error");
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const fillOtp = (code: string) => {
		const digits = code.replace(/\D/g, "").slice(0, 6).split("");
		if (digits.length === 0) return;
		const next = ["", "", "", "", "", ""];
		digits.forEach((d, i) => { next[i] = d; });
		setOtp(next);
		const lastFilled = Math.min(digits.length, 5);
		otpRefs.current[lastFilled]?.focus();
	};

	const handleOtpChange = (index: number, value: string) => {
		if (value.length > 1) { fillOtp(value); return; }
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

	const handleOtpPaste = (e: React.ClipboardEvent) => {
		e.preventDefault();
		fillOtp(e.clipboardData.getData("text"));
	};

	useEffect(() => {
		if (step !== "otp") return;
		setTimeout(() => otpRefs.current[0]?.focus(), 50);
		if (!("OTPCredential" in window)) return;
		const ac = new AbortController();
		(navigator.credentials as any)
			.get({ otp: { transport: ["sms"] }, signal: ac.signal })
			.then((cred: any) => { if (cred?.code) fillOtp(cred.code); })
			.catch(() => {});
		return () => ac.abort();
	}, [step]);

	useEffect(() => {
		if (otp.every((d) => d !== "") && !isLoading) {
			handleVerifyOTP({ preventDefault: () => {} } as React.FormEvent);
		}
	}, [otp]);

	const handleResend = async () => {
		if (resendTimer > 0) return;
		setIsLoading(true);
		try {
			await sendOTP(phone);
			CustomToast("کد جدید ارسال شد", "success");
			setOtp(["", "", "", "", "", ""]);
			setResendTimer(60);
			otpRefs.current[0]?.focus();
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex flex-col md:items-center md:justify-center relative overflow-hidden bg-[#1a0f1e]">

			{/* Ambient orbs */}
			<motion.div
				className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] md:w-[45vw] md:h-[45vw] rounded-full opacity-30"
				style={{ background: "radial-gradient(circle, #6B4E71 0%, transparent 70%)" }}
				animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
				transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
			/>
			<motion.div
				className="absolute bottom-[-15%] right-[-10%] w-[65vw] h-[65vw] md:w-[40vw] md:h-[40vw] rounded-full opacity-25"
				style={{ background: "radial-gradient(circle, #D4A5A5 0%, transparent 70%)" }}
				animate={{ x: [0, -25, 0], y: [0, 25, 0] }}
				transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
			/>
			<motion.div
				className="absolute top-[40%] right-[10%] w-[40vw] h-[40vw] md:w-[25vw] md:h-[25vw] rounded-full opacity-20"
				style={{ background: "radial-gradient(circle, #C9A875 0%, transparent 70%)" }}
				animate={{ x: [0, 15, 0], y: [0, -30, 0] }}
				transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
			/>

			{/* Mobile brand header */}
			<div className="md:hidden relative z-10 flex flex-col items-center pt-16 pb-10 px-6">
				<motion.div
					initial={{ opacity: 0, y: -16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
					className="flex flex-col items-center"
				>
					<div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-5 backdrop-blur-sm">
						<Sparkles className="w-7 h-7 text-accent-gold" />
					</div>
					<h1 className="text-3xl font-bold text-white tracking-wide mb-2">Mahoura</h1>
					<p className="text-white/60 text-sm">زیبایی لوکس ایرانی</p>
				</motion.div>
			</div>

			{/* Main card wrapper */}
			<motion.div
				initial={{ opacity: 0, y: 60, scale: 0.97 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				transition={{ duration: 0.65, ease: [0.34, 1.56, 0.64, 1], delay: 0.15 }}
				className="w-full md:max-w-5xl md:mx-4 relative z-10 flex-1 md:flex-none"
			>
				<div className="grid md:grid-cols-2 gap-0 md:rounded-2xl overflow-hidden md:shadow-[0_32px_80px_rgba(0,0,0,0.6)] h-full md:h-auto">

					{/* Left panel — desktop only */}
					<div className="hidden md:flex bg-gradient-to-br from-[#2d1a33] via-[#3d2244] to-[#4a2a55] p-14 flex-col justify-between text-white relative overflow-hidden">
						<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(107,78,113,0.5),transparent_60%)]" />
						<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(201,168,117,0.15),transparent_60%)]" />

						<motion.div
							initial={{ opacity: 0, x: -24 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.4, duration: 0.6 }}
							className="relative z-10"
						>
							<div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mb-8">
								<Sparkles className="w-6 h-6 text-accent-gold" />
							</div>
							<h1 className="text-5xl font-bold mb-3 tracking-tight">Mahoura</h1>
							<p className="text-white/60 text-lg">زیبایی لوکس ایرانی</p>
						</motion.div>

						<div className="relative z-10 space-y-3">
							{["محصولات لوکس", "تحویل سریع", "ضمانت اصالت", "پشتیبانی ۲۴/۷"].map((item, i) => (
								<motion.div
									key={item}
									initial={{ opacity: 0, x: -16 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.6 + i * 0.1 }}
									className="flex items-center gap-3 text-white/75"
								>
									<div className="w-1.5 h-1.5 bg-accent-gold rounded-full shrink-0 animate-pulse-glow" />
									<span className="text-sm">{item}</span>
								</motion.div>
							))}
						</div>

						<motion.p
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 1.1 }}
							className="relative z-10 text-xs text-white/30"
						>
							ورود آسان با شماره موبایل
						</motion.p>
					</div>

					{/* Right panel — form */}
					<div className="bg-white/[0.06] md:bg-white backdrop-blur-2xl md:backdrop-blur-none dark:bg-gray-900/80 md:dark:bg-gray-900 rounded-t-[2rem] md:rounded-none px-7 pt-9 pb-10 sm:px-10 sm:pt-11 sm:pb-12 md:px-14 md:py-16">

						<AnimatePresence mode="wait">
							{step === "name" ? (
								<motion.div
									key="name-step"
									variants={stepVariants}
									initial="enter"
									animate="center"
									exit="exit"
									transition={{ duration: 0.28, ease: "easeOut" }}
								>
									{/* Step header */}
									<div className="mb-9">
										<motion.h2
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.1 }}
											className="text-2xl sm:text-3xl font-bold text-foreground mb-2"
										>
											تکمیل پروفایل
										</motion.h2>
										<motion.p
											initial={{ opacity: 0, y: 8 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.18 }}
											className="text-muted-foreground text-sm sm:text-base"
										>
											نام و نام خانوادگی خود را وارد کنید
										</motion.p>
									</div>

									<form onSubmit={handleCompleteName} className="space-y-4">
										<motion.div
											initial={{ opacity: 0, y: 12 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.22 }}
										>
											<InputFree
												label="نام"
												placeholder="نام شما"
												value={firstName}
												onValueChange={setFirstName}
												disabled={isLoading}
											/>
										</motion.div>

										<motion.div
											initial={{ opacity: 0, y: 12 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.3 }}
										>
											<InputFree
												label="نام خانوادگی"
												placeholder="نام خانوادگی شما"
												value={lastName}
												onValueChange={setLastName}
												disabled={isLoading}
											/>
										</motion.div>

										<motion.div
											initial={{ opacity: 0, y: 12 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.38 }}
										>
											<Button
												type="submit"
												disabled={isLoading || !firstName.trim() || !lastName.trim()}
												className="relative w-full h-12 sm:h-13 text-base font-semibold overflow-hidden bg-gradient-to-r from-secondary-plum to-primary-rose border-0 hover:opacity-95 active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
											>
												<span className="absolute inset-0 shimmer opacity-20 pointer-events-none" />
												{isLoading ? (
													<span className="flex items-center gap-2">
														<Loader className="w-4 h-4 animate-spin" />
														در حال ذخیره...
													</span>
												) : (
													<span className="flex items-center gap-2">
														تایید و ورود
														<ChevronRight className="w-4 h-4" />
													</span>
												)}
											</Button>
										</motion.div>
									</form>
								</motion.div>
							) : step === "phone" ? (
								<motion.div
									key="phone-step"
									variants={stepVariants}
									initial="enter"
									animate="center"
									exit="exit"
									transition={{ duration: 0.28, ease: "easeOut" }}
								>
									{/* Step header */}
									<div className="mb-9">
										<motion.h2
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.1 }}
											className="text-2xl sm:text-3xl font-bold text-foreground mb-2"
										>
											ورود / ثبت‌نام
										</motion.h2>
										<motion.p
											initial={{ opacity: 0, y: 8 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.18 }}
											className="text-muted-foreground text-sm sm:text-base"
										>
											شماره موبایل خود را وارد کنید
										</motion.p>
									</div>

									<form onSubmit={handleSendOTP} className="space-y-6">
										<motion.div
											initial={{ opacity: 0, y: 12 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.22 }}
										>
											<InputFree
												label="شماره موبایل"
												icon={Phone}
												value={phone}
												autoFocus
												onValueChange={setPhone}
											/>
										</motion.div>

										<motion.div
											initial={{ opacity: 0, y: 12 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.3 }}
										>
											<Button
												type="submit"
												disabled={isLoading || !phone}
												className="relative w-full h-12 sm:h-13 text-base font-semibold overflow-hidden bg-gradient-to-r from-secondary-plum to-primary-rose border-0 hover:opacity-95 active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
											>
												<span className="absolute inset-0 shimmer opacity-20 pointer-events-none" />
												{isLoading ? (
													<span className="flex items-center gap-2">
														<Loader className="w-4 h-4 animate-spin" />
														در حال ارسال...
													</span>
												) : (
													<span className="flex items-center gap-2">
														دریافت کد تایید
														<ChevronRight className="w-4 h-4" />
													</span>
												)}
											</Button>
										</motion.div>
									</form>
								</motion.div>
							) : (
								<motion.div
									key="otp-step"
									variants={stepVariants}
									initial="enter"
									animate="center"
									exit="exit"
									transition={{ duration: 0.28, ease: "easeOut" }}
								>
									{/* Step header */}
									<div className="mb-9">
										<motion.h2
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.1 }}
											className="text-2xl sm:text-3xl font-bold text-foreground mb-2"
										>
											تایید شماره
										</motion.h2>
										<motion.p
											initial={{ opacity: 0, y: 8 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.18 }}
											className="text-muted-foreground text-sm sm:text-base"
										>
											کد ارسال شده به{" "}
											<span className="font-medium text-foreground" dir="ltr">{phone}</span>{" "}
											را وارد کنید
										</motion.p>
									</div>

									<form onSubmit={handleVerifyOTP} className="space-y-7">
										{/* OTP boxes */}
										<motion.div
											className="flex justify-center gap-2 sm:gap-3"
											dir="ltr"
											initial={{ opacity: 0, y: 12 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.22 }}
										>
											{otp.map((digit, i) => (
												<motion.input
													key={i}
													ref={(el) => { otpRefs.current[i] = el; }}
													type="text"
													inputMode="numeric"
													maxLength={1}
													autoComplete={i === 0 ? "one-time-code" : "off"}
													value={digit}
													onChange={(e) => handleOtpChange(i, e.target.value)}
													onKeyDown={(e) => handleOtpKeyDown(i, e)}
													onPaste={i === 0 ? handleOtpPaste : undefined}
													animate={digit ? { scale: [1, 1.08, 1] } : { scale: 1 }}
													transition={spring}
													autoFocus={i === 0}
													className={[
														"w-11 h-13 sm:w-13 sm:h-15 text-center text-lg sm:text-xl font-bold rounded-xl border-2 outline-none transition-all duration-200",
														"focus:ring-2 focus:ring-secondary-plum/30",
														digit
															? "border-secondary-plum bg-secondary-plum text-white shadow-[0_0_16px_rgba(107,78,113,0.35)]"
															: "border-border bg-background text-foreground focus:border-secondary-plum dark:bg-gray-800 dark:border-gray-600 dark:text-white",
													].join(" ")}
												/>
											))}
										</motion.div>

										<motion.div
											initial={{ opacity: 0, y: 12 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.3 }}
										>
											<Button
												type="submit"
												disabled={isLoading || otp.join("").length < 6}
												className="relative w-full h-12 sm:h-13 text-base font-semibold overflow-hidden bg-gradient-to-r from-secondary-plum to-primary-rose border-0 hover:opacity-95 active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
											>
												<span className="absolute inset-0 shimmer opacity-20 pointer-events-none" />
												{isLoading ? (
													<span className="flex items-center gap-2">
														<Loader className="w-4 h-4 animate-spin" />
														در حال بررسی...
													</span>
												) : (
													"تایید و ورود"
												)}
											</Button>
										</motion.div>

										<motion.div
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ delay: 0.38 }}
											className="flex flex-col items-center gap-3 pt-1"
										>
											<button
												type="button"
												onClick={handleResend}
												disabled={resendTimer > 0}
												className="text-sm text-secondary-plum disabled:text-muted-foreground disabled:cursor-not-allowed hover:underline transition-colors"
											>
												{resendTimer > 0
													? `ارسال مجدد پس از ${resendTimer} ثانیه`
													: "ارسال مجدد کد"}
											</button>
											<button
												type="button"
												onClick={() => { setStep("phone"); setOtp(["", "", "", "", "", ""]); }}
												className="text-xs text-muted-foreground hover:text-foreground transition-colors"
											>
												تغییر شماره
											</button>
										</motion.div>
									</form>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</div>
			</motion.div>
		</div>
	);
}
