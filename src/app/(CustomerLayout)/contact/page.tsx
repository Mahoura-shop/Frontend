"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import CustomToast from "@/components/Custom/CustomToast/CustomToast";

export default function ContactPage() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		CustomToast(
			"پیام شما با موفقیت ارسال شد. به زودی با شما تماس خواهیم گرفت.",
			"success",
		);
		setFormData({ name: "", email: "", subject: "", message: "" });
	};

	const contactInfo = [
		{
			icon: Phone,
			title: "تلفن",
			value: "۰۲۱-۱۲۳۴۵۶۷۸",
			link: "tel:02112345678",
		},
		// {
		// 	icon: Mail,
		// 	title: "ایمیل",
		// 	value: "info@mahoura.com",
		// 	link: "mailto:info@mahoura.com",
		// },
		{
			icon: MapPin,
			title: "آدرس",
			value: "شیراز، رکن آباد، بلوار تلاش شرقی",
			link: null,
		},
	];

	return (
		<div className="min-h-screen bg-background">
			<Navbar />
			<div className="">
				<div className="bg-gradient-to-r from-primary-rose/20 via-accent-gold/10 to-secondary-plum/20 py-24">
					<div className="container mx-auto px-4">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							className="text-center max-w-3xl mx-auto"
						>
							<h1 className="text-5xl md:text-6xl font-bold gradient-text mb-6">
								تماس با ما
							</h1>
							<p className="text-xl text-muted-foreground">
								ما همیشه آماده پاسخگویی به سوالات و نظرات شما
								هستیم
							</p>
						</motion.div>
					</div>
				</div>

				<div className="container mx-auto px-4 py-16">
					<div className="grid lg:grid-cols-2 gap-12">
						<motion.div
							initial={{ opacity: 0, x: -50 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							className="space-y-8"
						>
							<div>
								<h2 className="text-3xl font-bold mb-6">
									اطلاعات تماس
								</h2>
							</div>
							<div className="space-y-6">
								{contactInfo.map((info, i) => (
									<motion.div
										key={info.title}
										initial={{ opacity: 0, x: -20 }}
										whileInView={{ opacity: 1, x: 0 }}
										viewport={{ once: true }}
										transition={{ delay: i * 0.1 }}
									>
										<Card>
											<CardContent className="p-6">
												<div className="flex items-start gap-4">
													<div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-rose to-accent-gold flex items-center justify-center flex-shrink-0">
														<info.icon className="w-6 h-6 text-white" />
													</div>
													<div>
														<h3 className="font-bold mb-1">
															{info.title}
														</h3>
														{info.link ? (
															<a
																href={info.link}
																className="text-muted-foreground hover:text-primary transition-colors"
															>
																{info.value}
															</a>
														) : (
															<p className="text-muted-foreground">
																{info.value}
															</p>
														)}
													</div>
												</div>
											</CardContent>
										</Card>
									</motion.div>
								))}
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: 50 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
						>
							<Card>
								<CardContent className="p-8">
									<h2 className="text-2xl font-bold mb-6">
										ارسال پیام
									</h2>
									<form
										onSubmit={handleSubmit}
										className="space-y-6"
									>
										<div className="space-y-2">
											<Label htmlFor="name">
												نام و نام خانوادگی
											</Label>
											<Input
												id="name"
												value={formData.name}
												onChange={(e) =>
													setFormData({
														...formData,
														name: e.target.value,
													})
												}
												required
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="email">ایمیل</Label>
											<Input
												id="email"
												type="email"
												value={formData.email}
												onChange={(e) =>
													setFormData({
														...formData,
														email: e.target.value,
													})
												}
												required
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="subject">
												موضوع
											</Label>
											<Input
												id="subject"
												value={formData.subject}
												onChange={(e) =>
													setFormData({
														...formData,
														subject: e.target.value,
													})
												}
												required
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="message">
												پیام
											</Label>
											<textarea
												id="message"
												value={formData.message}
												onChange={(e) =>
													setFormData({
														...formData,
														message: e.target.value,
													})
												}
												required
												className="w-full min-h-[150px] px-3 py-2 rounded-md border border-input bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
											/>
										</div>
										<Button
											type="submit"
											className="w-full gap-2"
											variant="luxury"
										>
											<Send className="w-4 h-4" />
											ارسال پیام
										</Button>
									</form>
								</CardContent>
							</Card>
						</motion.div>
					</div>
				</div>
			</div>
		</div>
	);
}
