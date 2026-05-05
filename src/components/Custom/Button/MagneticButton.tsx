import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import styles from "./MagneticButton.module.css";

export default function MagneticButton({
	children,
	href = "#",
	variant = "primary",
	className = "",
	...props
}: {
	children: React.ReactNode;
	href?: string;
	variant?: "primary" | "ghost";
	className?: string;
	[key: string]: any;
}) {
	const ref = useRef<HTMLAnchorElement>(null);
	const [offset, setOffset] = useState({ x: 0, y: 0 });

	const variantClass = variant === "ghost" ? styles.ghostMagnetic : styles.primaryMagnetic;

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (!ref.current) return;

			const rect = ref.current.getBoundingClientRect();
			const x = (e.clientX - rect.left - rect.width / 2) * 0.35;
			const y = (e.clientY - rect.top - rect.height / 2) * 0.35;

			setOffset({ x, y });
		};

		const handleMouseLeave = () => {
			setOffset({ x: 0, y: 0 });
		};

		const btn = ref.current;
		if (!btn) return;

		btn.addEventListener("mousemove", handleMouseMove);
		btn.addEventListener("mouseleave", handleMouseLeave);

		return () => {
			btn.removeEventListener("mousemove", handleMouseMove);
			btn.removeEventListener("mouseleave", handleMouseLeave);
		};
	}, []);

	return (
		<Link href={href}>
			<motion.a
				ref={ref}
				animate={{ x: offset.x, y: offset.y, scale: offset.x !== 0 ? 1.04 : 1 }}
				transition={{ type: "spring", stiffness: 150, damping: 15 }}
				className={`${variantClass} ${className}`}
				{...props}
			>
				{children}
			</motion.a>
		</Link>
	);
}
