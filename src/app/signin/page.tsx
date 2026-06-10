"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Phone, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import InputFree from "@/components/Custom/Input/InputFree";
import CustomToast from "@/components/Custom/CustomToast/CustomToast";
import useUserStore from "@/store/useUserStore";
import { sendOTP, verifyOTP } from "@/services/authService";
import { patchData } from "@/services/services";
import BackgroundPortraits from "@/components/BackgroundPortraits/BackgroundPortraits";

const spring = { duration: 0.35, ease: [0.22, 1, 0.36, 1] };
const stepVariants = {
	enter: { opacity: 0, scale: 0.96 },
	center: { opacity: 1, scale: 1 },
	exit: { opacity: 0, scale: 1.03 },
};

export default function SignIn() {
	const [step, setStep] = useState<"phone" | "otp" | "name">("phone");
	const [phone, setPhone] = useState("");
	const [otp, setOtp] = useState(["", "", "", "", "", ""]);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [phoneError, setPhoneError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [resendTimer, setResendTimer] = useState(0);
	const [stepAnnouncement, setStepAnnouncement] = useState("");
	const shouldReduceMotion = useReducedMotion();
	const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
	const {
		setAccessToken,
		setRefreshToken,
		setFirstName: storeSetFirstName,
		setLastName: storeSetLastName,
		setIsAdmin,
		setUserType,
		setPermissions,
	} = useUserStore();
	const router = useRouter();

	useEffect(() => {
		if (resendTimer <= 0) return;
		const id = setTimeout(() => setResendTimer((t) => t - 1), 1000);
		return () => clearTimeout(id);
	}, [resendTimer]);

	useEffect(() => {
		const labels: Record<typeof step, string> = {
			phone: "ورود یا ثبت‌نام: شماره موبایل خود را وارد کنید",
			otp: "تایید شماره: کد ارسال شده را وارد کنید",
			name: "تکمیل پروفایل: نام و نام خانوادگی خود را وارد کنید",
		};
		setStepAnnouncement(labels[step]);
	}, [step]);

	const normalizePhone = (p: string) =>
		p.replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - "۰".charCodeAt(0)));

	const isValidPhone = (p: string) => /^09[0-9]{9}$/.test(normalizePhone(p));

	const handleSendOTP = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!phone) return;
		if (!isValidPhone(phone)) {
			setPhoneError("شماره موبایل باید با ۰۹ شروع شده و ۱۱ رقم باشد");
			return;
		}
		setPhoneError("");
		setIsLoading(true);
		try {
			await sendOTP(phone);
			CustomToast("کد تایید ارسال شد", "success");
			setStep("otp");
			setResendTimer(60);
			setTimeout(() => otpRefs.current[0]?.focus(), 100);
		} catch {
			CustomToast("خطا در ارسال کد. لطفا دوباره امتحان کنید", "error");
		} finally {
			setIsLoading(false);
		}
	};

	const handleVerifyOTP = useCallback(
		async (e: React.FormEvent) => {
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
			} catch {
				CustomToast(
					"کد وارد شده اشتباه است. لطفا دوباره امتحان کنید",
					"error",
				);
			} finally {
				setIsLoading(false);
			}
		},
		[
			otp,
			phone,
			setAccessToken,
			setRefreshToken,
			storeSetFirstName,
			storeSetLastName,
			setIsAdmin,
			setUserType,
			setPermissions,
			router,
		],
	);

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
		} catch {
			CustomToast("خطایی در ذخیره اطلاعات رخ داد", "error");
		} finally {
			setIsLoading(false);
		}
	};

	const fillOtp = (code: string) => {
		const digits = code.replace(/\D/g, "").slice(0, 6).split("");
		if (digits.length === 0) return;
		const next = ["", "", "", "", "", ""];
		digits.forEach((d, i) => {
			next[i] = d;
		});
		setOtp(next);
		const lastFilled = Math.min(digits.length, 5);
		otpRefs.current[lastFilled]?.focus();
	};

	const handleOtpChange = (index: number, value: string) => {
		if (value.length > 1) {
			fillOtp(value);
			return;
		}
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
			.then((cred: any) => {
				if (cred?.code) fillOtp(cred.code);
			})
			.catch(() => {});
		return () => ac.abort();
	}, [step]);

	useEffect(() => {
		if (otp.every((d) => d !== "") && !isLoading) {
			handleVerifyOTP({ preventDefault: () => {} } as React.FormEvent);
		}
	}, [otp, handleVerifyOTP]);

	const handleResend = async () => {
		if (resendTimer > 0) return;
		setIsLoading(true);
		try {
			await sendOTP(phone);
			CustomToast("کد جدید ارسال شد", "success");
			setOtp(["", "", "", "", "", ""]);
			setResendTimer(60);
			otpRefs.current[0]?.focus();
		} catch {
			CustomToast(
				"خطا در ارسال مجدد کد. لطفا دوباره امتحان کنید",
				"error",
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div
			className="min-h-[100dvh] flex flex-col md:items-center md:justify-center relative overflow-x-hidden overflow-y-auto bg-[#1a0f1e]"
			style={{
				backgroundImage:
					"radial-gradient(ellipse 90% 60% at 0% 100%, oklch(20% 0.035 312) 0%, transparent 55%)",
			}}
		>
			<BackgroundPortraits mode="absolute" count={10} seed={12} />
			<div
				role="status"
				aria-live="polite"
				aria-atomic="true"
				className="sr-only"
			>
				{stepAnnouncement}
			</div>

			{/* Mobile brand header */}
			<div className="md:hidden relative z-10 flex flex-col items-center pt-12 pb-8 px-6 landscape:pt-4 landscape:pb-4">
				<motion.div
					initial={{ opacity: 0, y: -16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
					className="flex flex-col items-center"
				>
					<h1 className="text-4xl landscape:text-2xl font-black text-white tracking-tight mb-2 landscape:mb-1">
						Mahoura
					</h1>
					<p className="text-white/40 text-xs tracking-[0.2em] uppercase">
						زیبایی لوکس ایرانی
					</p>
				</motion.div>
			</div>

			{/* Main card wrapper */}
			<motion.div
				initial={{ opacity: 0, y: 40, scale: 0.97 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				transition={{
					duration: 0.5,
					ease: [0.25, 1, 0.5, 1],
					delay: 0.1,
				}}
				className="w-full md:max-w-5xl md:mx-4 relative z-10 flex-1 md:flex-none"
			>
				<div className="grid md:grid-cols-2 px-4 lg:px-0 gap-0 md:rounded-2xl overflow-hidden md:shadow-[0_32px_80px_rgba(0,0,0,0.6)] h-full md:h-auto">
					{/* Left panel — desktop only */}
					<div className="hidden md:flex bg-[oklch(13%_0.025_320)] p-14 flex-col justify-between text-white overflow-hidden">
						<motion.div
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{
								delay: 0.3,
								duration: 0.55,
								ease: [0.25, 1, 0.5, 1],
							}}
						>
							{/* <p className="text-xs font-medium tracking-[0.22em] uppercase text-white/35 mb-10">
								زیبایی لوکس ایرانی
							</p> */}
							<h1 className="text-[clamp(4.5rem,8vw,7rem)] font-black leading-[0.88] tracking-tight">
								Mahoura
							</h1>
						</motion.div>

						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.75, duration: 0.5 }}
						>
							<p className="text-sm text-white/45 leading-loose">
								محصولات لوکس اصل.
								<br />
								تحویل سریع.
								<br />
								پشتیبانی دائم.
							</p>
						</motion.div>
					</div>

					{/* Right panel — form */}
					<div
						className="bg-white dark:bg-[oklch(14%_0.025_320)] rounded-t-[2rem] landscape:rounded-t-none rounded-b-[2rem] landscape:rounded-b-none md:rounded-none px-7 pt-9 pb-10 sm:px-10 sm:pt-11 sm:pb-12 md:px-14 md:py-16 flex flex-col justify-center md:block"
						style={{
							paddingBottom:
								"max(2.5rem, env(safe-area-inset-bottom))",
						}}
					>
						<AnimatePresence mode="wait">
							{step === "name" ? (
								<motion.div
									key="name-step"
									variants={stepVariants}
									initial="enter"
									animate="center"
									exit="exit"
									transition={{
										duration: 0.28,
										ease: "easeOut",
									}}
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

									<form
										onSubmit={handleCompleteName}
										className="space-y-4"
									>
										<motion.div
											initial={{ opacity: 0, y: 12 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.22 }}
										>
											<InputFree
												data-testid="firstname"
												label="نام"
												// autoFocus
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
												data-testid="lastname"
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
												data-testid="submit3"
												disabled={
													isLoading ||
													!firstName.trim() ||
													!lastName.trim()
												}
												className="w-full h-12 text-base text-white font-semibold bg-secondary-plum hover:bg-secondary-plum/90 active:scale-[0.98] transition-all duration-200 disabled:opacity-40"
											>
												{isLoading ? (
													<span className="flex items-center gap-2">
														<Loader
															className="w-4 h-4 animate-spin"
															aria-hidden="true"
														/>
														در حال ذخیره...
													</span>
												) : (
													"تایید و ورود"
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
									transition={{
										duration: 0.28,
										ease: "easeOut",
									}}
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

									<form
										onSubmit={handleSendOTP}
										className="space-y-6"
									>
										<motion.div
											initial={{ opacity: 0, y: 12 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.22 }}
										>
											<InputFree
												data-testid="phone"
												label="شماره موبایل"
												icon={Phone}
												value={phone}
												autoFocus
												autoComplete="tel"
												maxLength={11}
												onlyDigits
												onValueChange={(v) => {
													setPhone(v);
													setPhoneError("");
												}}
											/>
											{phoneError && (
												<p className="mt-1.5 text-xs text-red-500 text-right">
													{phoneError}
												</p>
											)}
										</motion.div>

										<motion.div
											initial={{ opacity: 0, y: 12 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.3 }}
										>
											<Button
												type="submit"
												data-testid="submit1"
												disabled={
													isLoading ||
													!phone ||
													!isValidPhone(phone)
												}
												className="w-full h-12 text-base text-white font-semibold bg-secondary-plum hover:bg-secondary-plum/90 active:scale-[0.98] transition-all duration-200 disabled:opacity-40"
											>
												{isLoading ? (
													<span className="flex items-center gap-2">
														<Loader
															className="w-4 h-4 animate-spin"
															aria-hidden="true"
														/>
														در حال ارسال...
													</span>
												) : (
													"دریافت کد تایید"
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
									transition={{
										duration: 0.28,
										ease: "easeOut",
									}}
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
											<span
												className="font-medium text-foreground"
												dir="ltr"
											>
												{phone}
											</span>{" "}
											را وارد کنید
										</motion.p>
									</div>

									<form
										onSubmit={handleVerifyOTP}
										className="space-y-7"
									>
										{/* OTP boxes */}
										<motion.div
											role="group"
											aria-label="کد تایید ۶ رقمی"
											className="flex justify-center gap-2 sm:gap-3"
											dir="ltr"
											initial={{ opacity: 0, y: 12 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.22 }}
										>
											{otp.map((digit, i) => (
												<motion.input
													key={i}
													ref={(el) => {
														otpRefs.current[i] = el;
													}}
													type="text"
													inputMode="numeric"
													maxLength={1}
													data-testid={`otp-${i}`}
													aria-label={`رقم ${i + 1} از 6`}
													autoComplete={
														i === 0
															? "one-time-code"
															: "off"
													}
													value={digit}
													onChange={(e) =>
														handleOtpChange(
															i,
															e.target.value,
														)
													}
													onKeyDown={(e) =>
														handleOtpKeyDown(i, e)
													}
													onPaste={
														i === 0
															? handleOtpPaste
															: undefined
													}
													animate={
														shouldReduceMotion
															? {}
															: digit
																? {
																		scale: [
																			1,
																			1.08,
																			1,
																		],
																	}
																: { scale: 1 }
													}
													transition={spring}
													autoFocus={i === 0}
													className={[
														"w-10 h-12 sm:w-12 sm:h-14 text-center text-base sm:text-xl font-bold rounded-xl border-2 outline-none transition-all duration-200",
														"focus:ring-2 focus:ring-secondary-plum/30",
														digit
															? "border-secondary-plum bg-secondary-plum text-white shadow-[0_0_16px_rgba(107,78,113,0.35)]"
															: "border-border bg-background text-foreground focus:border-secondary-plum dark:bg-card dark:border-border dark:text-foreground",
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
												data-testid="submit2"
												disabled={
													isLoading ||
													otp.join("").length < 6
												}
												className="w-full h-12 text-base text-white font-semibold bg-secondary-plum hover:bg-secondary-plum/90 active:scale-[0.98] transition-all duration-200 disabled:opacity-40"
											>
												{isLoading ? (
													<span className="flex items-center gap-2">
														<Loader
															className="w-4 h-4 animate-spin"
															aria-hidden="true"
														/>
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
												className="min-h-[44px] px-3 text-sm text-secondary-plum disabled:text-muted-foreground disabled:cursor-not-allowed hover:underline transition-colors"
											>
												{resendTimer > 0
													? `ارسال مجدد پس از ${resendTimer} ثانیه`
													: "ارسال مجدد کد"}
											</button>
											<button
												type="button"
												onClick={() => {
													setStep("phone");
													setOtp([
														"",
														"",
														"",
														"",
														"",
														"",
													]);
												}}
												className="min-h-[44px] px-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
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
