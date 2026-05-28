"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Check, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import CustomToast from "@/components/Custom/CustomToast/CustomToast";
import { useIsMobile } from "@/hooks/use-mobile";
import { postData } from "@/services/services";

interface FormErrors {
	name?: string;
	email?: string;
	subject?: string;
	message?: string;
}

export default function ContactPage() {
	const isMobile = useIsMobile();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});
	const [errors, setErrors] = useState<FormErrors>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [focusedField, setFocusedField] = useState<string | null>(null);

	const validateForm = (): boolean => {
		const newErrors: FormErrors = {};

		if (!formData.name.trim()) {
			newErrors.name = "نام الزامی است";
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!formData.email.trim()) {
			newErrors.email = "ایمیل الزامی است";
		} else if (!emailRegex.test(formData.email)) {
			newErrors.email = "ایمیل معتبر وارد کنید";
		}

		if (!formData.subject.trim()) {
			newErrors.subject = "موضوع الزامی است";
		}

		if (!formData.message.trim()) {
			newErrors.message = "پیام الزامی است";
		} else if (formData.message.trim().length < 10) {
			newErrors.message = "پیام باید حداقل 10 کاراکتر باشد";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		setIsSubmitting(true);
		try {
			await postData({
				endPoint: "/v1/contact",
				data: formData,
			});
			CustomToast(
				"پیام شما با موفقیت ارسال شد. به زودی با شما تماس خواهیم گرفت.",
				"success",
			);
			setSubmitted(true);
			setFormData({ name: "", email: "", subject: "", message: "" });
			setTimeout(() => setSubmitted(false), 3000);
		} catch {
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleFieldChange = (
		field: string,
		value: string,
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field as keyof FormErrors]) {
			setErrors((prev) => ({ ...prev, [field]: undefined }));
		}
	};

	const contactInfo = [
		{
			icon: Phone,
			title: "تلفن",
			value: "۰۲۱-۱۲۳۴۵۶۷۸",
			link: "tel:02112345678",
			ariaLabel: "شماره تلفن",
		},
		{
			icon: MapPin,
			title: "آدرس",
			value: "شیراز، رکن آباد، بلوار تلاش شرقی",
			link: null,
			ariaLabel: "آدرس فیزیکی",
		},
	];

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.2,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.5, ease: "easeOut" },
		},
	};

	const fieldVariants = {
		hidden: { opacity: 0, x: 20 },
		visible: {
			opacity: 1,
			x: 0,
			transition: { duration: 0.4, ease: "easeOut" },
		},
		focus: {
			scale: 1.02,
			transition: { duration: 0.2 },
		},
	};

	return (
		<div className="min-h-screen bg-background">
			{/* Hero Section */}
			<div className="relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-r from-primary-rose/15 via-accent-gold/10 to-secondary-plum/15" />
				<div className="absolute inset-0 backdrop-blur-3xl" />

				<div className="relative py-20 pt-36">
					<div className="container mx-auto px-4">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, ease: "easeOut" }}
							className="text-center max-w-3xl mx-auto"
						>
							<motion.div
								initial={{ scale: 0.95 }}
								animate={{ scale: 1 }}
								transition={{ duration: 0.5, delay: 0.2 }}
							>
								<h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4 md:mb-6">
									تماس با ما
								</h1>
							</motion.div>

							<motion.p
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.5, delay: 0.3 }}
								className="text-lg md:text-xl text-muted-foreground leading-relaxed"
							>
								ما همیشه آماده پاسخگویی به سوالات و نظرات شما
								هستیم. با ما تماس بگیرید و اطلاعات بیشتر دریافت
								کنید.
							</motion.p>
						</motion.div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="container mx-auto px-4 py-12 md:py-20">
				<div className={`grid ${isMobile ? "grid-cols-1" : "lg:grid-cols-5"} gap-8 md:gap-12`}>
					{/* Contact Info */}
					<motion.div
						variants={containerVariants}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, margin: "-100px" }}
						className={isMobile ? "col-span-1" : "lg:col-span-2"}
					>
						<motion.div variants={itemVariants} className="mb-8">
							<h2 className="text-3xl font-bold mb-2">
								اطلاعات تماس
							</h2>
							<div className="w-12 h-1 bg-gradient-to-r from-primary-rose to-accent-gold rounded-full" />
						</motion.div>

						<motion.div
							className="space-y-5"
							variants={containerVariants}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, margin: "-100px" }}
						>
							{contactInfo?.map((info, i) => (
								<motion.div
									key={info.title}
									variants={itemVariants}
									whileHover={{ x: 8 }}
									transition={{ duration: 0.2 }}
								>
									<Card className="hover:shadow-lg transition-shadow duration-300 border-0 bg-card/50 backdrop-blur-sm">
										<CardContent className="p-6">
											<div className="flex items-start gap-4">
												<motion.div
													className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-rose via-accent-gold to-secondary-plum flex items-center justify-center flex-shrink-0 shadow-lg"
													whileHover={{ rotate: 10, scale: 1.05 }}
													transition={{ duration: 0.3 }}
												>
													<info.icon className="w-7 h-7 text-white" />
												</motion.div>
												<div className="flex-1 min-w-0">
													<h3 className="font-bold text-lg mb-1">
														{info.title}
													</h3>
													{info.link ? (
														<a
															href={info.link}
															aria-label={info.ariaLabel}
															className="text-muted-foreground hover:text-primary transition-colors break-words"
														>
															{info.value}
														</a>
													) : (
														<p
															className="text-muted-foreground break-words"
															aria-label={info.ariaLabel}
														>
															{info.value}
														</p>
													)}
												</div>
											</div>
										</CardContent>
									</Card>
								</motion.div>
							))}
						</motion.div>
					</motion.div>

					{/* Contact Form */}
					<motion.div
						initial={{ opacity: 0, x: isMobile ? 0 : 50 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true, margin: "-100px" }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className={isMobile ? "col-span-1" : "lg:col-span-3"}
					>
						<Card className="border-0 bg-card/50 backdrop-blur-sm shadow-xl">
							<CardContent className="p-6 md:p-8">
								<motion.div
									initial={{ opacity: 0 }}
									whileInView={{ opacity: 1 }}
									viewport={{ once: true }}
									transition={{ delay: 0.2 }}
								>
									<h2 className="text-2xl md:text-3xl font-bold mb-2">
										ارسال پیام
									</h2>
									<p className="text-muted-foreground mb-6">
										فرم زیر را پر کنید و ما به زودی با شما
										تماس خواهیم گرفت.
									</p>
								</motion.div>

								<form onSubmit={handleSubmit} className="space-y-5">
									{/* Name Field */}
									<motion.div
										variants={fieldVariants}
										initial="hidden"
										whileInView="visible"
										viewport={{ once: true }}
										transition={{ delay: 0.1 }}
									>
										<Label
											htmlFor="name"
											className="font-semibold"
										>
											نام و نام خانوادگی
										</Label>
										<motion.div
											animate={
												focusedField === "name"
													? "focus"
													: "initial"
											}
											variants={fieldVariants}
										>
											<Input
												id="name"
												value={formData.name}
												onChange={(e) =>
													handleFieldChange(
														"name",
														e.target.value,
													)
												}
												onFocus={() =>
													setFocusedField("name")
												}
												onBlur={() =>
													setFocusedField(null)
												}
												aria-label="نام و نام خانوادگی"
												aria-invalid={
													!!errors.name
												}
												aria-describedby={
													errors.name
														? "name-error"
														: undefined
												}
												className={`transition-all duration-200 ${
													errors.name
														? "border-destructive focus:ring-destructive"
														: ""
												}`}
												placeholder="نام خود را وارد کنید"
											/>
										</motion.div>
										{errors.name && (
											<motion.div
												initial={{
													opacity: 0,
													y: -5,
												}}
												animate={{
													opacity: 1,
													y: 0,
												}}
												id="name-error"
												className="flex items-center gap-1 text-sm text-destructive mt-2"
											>
												<AlertCircle className="w-4 h-4" />
												{errors.name}
											</motion.div>
										)}
									</motion.div>

									{/* Email Field */}
									<motion.div
										variants={fieldVariants}
										initial="hidden"
										whileInView="visible"
										viewport={{ once: true }}
										transition={{ delay: 0.2 }}
									>
										<Label
											htmlFor="email"
											className="font-semibold"
										>
											ایمیل
										</Label>
										<motion.div
											animate={
												focusedField === "email"
													? "focus"
													: "initial"
											}
											variants={fieldVariants}
										>
											<Input
												id="email"
												type="email"
												value={formData.email}
												onChange={(e) =>
													handleFieldChange(
														"email",
														e.target.value,
													)
												}
												onFocus={() =>
													setFocusedField("email")
												}
												onBlur={() =>
													setFocusedField(null)
												}
												aria-label="ایمیل"
												aria-invalid={
													!!errors.email
												}
												aria-describedby={
													errors.email
														? "email-error"
														: undefined
												}
												className={`transition-all duration-200 ${
													errors.email
														? "border-destructive focus:ring-destructive"
														: ""
												}`}
												placeholder="your@email.com"
											/>
										</motion.div>
										{errors.email && (
											<motion.div
												initial={{
													opacity: 0,
													y: -5,
												}}
												animate={{
													opacity: 1,
													y: 0,
												}}
												id="email-error"
												className="flex items-center gap-1 text-sm text-destructive mt-2"
											>
												<AlertCircle className="w-4 h-4" />
												{errors.email}
											</motion.div>
										)}
									</motion.div>

									{/* Subject Field */}
									<motion.div
										variants={fieldVariants}
										initial="hidden"
										whileInView="visible"
										viewport={{ once: true }}
										transition={{ delay: 0.3 }}
									>
										<Label
											htmlFor="subject"
											className="font-semibold"
										>
											موضوع
										</Label>
										<motion.div
											animate={
												focusedField === "subject"
													? "focus"
													: "initial"
											}
											variants={fieldVariants}
										>
											<Input
												id="subject"
												value={formData.subject}
												onChange={(e) =>
													handleFieldChange(
														"subject",
														e.target.value,
													)
												}
												onFocus={() =>
													setFocusedField("subject")
												}
												onBlur={() =>
													setFocusedField(null)
												}
												aria-label="موضوع"
												aria-invalid={
													!!errors.subject
												}
												aria-describedby={
													errors.subject
														? "subject-error"
														: undefined
												}
												className={`transition-all duration-200 ${
													errors.subject
														? "border-destructive focus:ring-destructive"
														: ""
												}`}
												placeholder="موضوع پیام"
											/>
										</motion.div>
										{errors.subject && (
											<motion.div
												initial={{
													opacity: 0,
													y: -5,
												}}
												animate={{
													opacity: 1,
													y: 0,
												}}
												id="subject-error"
												className="flex items-center gap-1 text-sm text-destructive mt-2"
											>
												<AlertCircle className="w-4 h-4" />
												{errors.subject}
											</motion.div>
										)}
									</motion.div>

									{/* Message Field */}
									<motion.div
										variants={fieldVariants}
										initial="hidden"
										whileInView="visible"
										viewport={{ once: true }}
										transition={{ delay: 0.4 }}
									>
										<div className="flex items-center justify-between">
											<Label
												htmlFor="message"
												className="font-semibold"
											>
												پیام
											</Label>
											<span className="text-xs text-muted-foreground">
												{
													formData.message
														.length
												}
											</span>
										</div>
										<motion.textarea
											animate={
												focusedField === "message"
													? "focus"
													: "initial"
											}
											variants={fieldVariants}
											id="message"
											value={formData.message}
											onChange={(e) =>
												handleFieldChange(
													"message",
													e.target.value,
												)
											}
											onFocus={() =>
												setFocusedField("message")
											}
											onBlur={() =>
												setFocusedField(null)
											}
											aria-label="پیام"
											aria-invalid={
												!!errors.message
											}
											aria-describedby={
												errors.message
													? "message-error"
													: undefined
											}
											className={`w-full min-h-[140px] px-3 py-2 rounded-lg border border-input bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200 ${
												errors.message
													? "border-destructive focus:ring-destructive"
													: ""
											}`}
											placeholder="پیام خود را بنویسید..."
										/>
									</motion.div>
									{errors.message && (
										<motion.div
											initial={{ opacity: 0, y: -5 }}
											animate={{ opacity: 1, y: 0 }}
											id="message-error"
											className="flex items-center gap-1 text-sm text-destructive"
										>
											<AlertCircle className="w-4 h-4" />
											{errors.message}
										</motion.div>
									)}

									{/* Submit Button */}
									<motion.div
										variants={fieldVariants}
										initial="hidden"
										whileInView="visible"
										viewport={{ once: true }}
										transition={{ delay: 0.5 }}
										className="pt-2"
									>
										<Button
											type="submit"
											disabled={
												isSubmitting || submitted
											}
											className="w-full gap-2 h-11 text-base font-semibold relative overflow-hidden group"
											variant="luxury"
											aria-busy={isSubmitting}
										>
											<motion.div
												className="flex items-center gap-2"
												animate={
													submitted
														? { scale: 1.05 }
														: { scale: 1 }
												}
											>
												{submitted ? (
													<>
														<Check className="w-5 h-5" />
														ارسال شد
													</>
												) : isSubmitting ? (
													<motion.div
														className="flex gap-1"
														animate={{
															opacity: [
																0.5,
																1,
																0.5,
															],
														}}
														transition={{
															duration: 1.5,
															repeat: Infinity,
														}}
													>
														<span className="inline-block w-1.5 h-1.5 bg-white rounded-full" />
														<span className="inline-block w-1.5 h-1.5 bg-white rounded-full" />
														<span className="inline-block w-1.5 h-1.5 bg-white rounded-full" />
													</motion.div>
												) : (
													<>
														<Send className="w-5 h-5" />
														ارسال پیام
													</>
												)}
											</motion.div>
										</Button>
									</motion.div>
								</form>
							</CardContent>
						</Card>
					</motion.div>
				</div>
			</div>
		</div>
	);
}
