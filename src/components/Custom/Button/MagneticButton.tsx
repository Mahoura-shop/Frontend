import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { spring } from "@/lib/motion";
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
	const frameRef = useRef<number | null>(null);
	const lastPosRef = useRef({ x: 0, y: 0 });

	const variantClass = variant === "ghost" ? styles.ghostMagnetic : styles.primaryMagnetic;

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			lastPosRef.current = { x: e.clientX, y: e.clientY };

			if (frameRef.current) return;

			frameRef.current = requestAnimationFrame(() => {
				if (!ref.current) {
					frameRef.current = null;
					return;
				}

				const rect = ref.current.getBoundingClientRect();
				const x = (lastPosRef.current.x - rect.left - rect.width / 2) * 0.35;
				const y = (lastPosRef.current.y - rect.top - rect.height / 2) * 0.35;

				setOffset({ x, y });
				frameRef.current = null;
			});
		};

		const handleMouseLeave = () => {
			setOffset({ x: 0, y: 0 });
			if (frameRef.current) {
				cancelAnimationFrame(frameRef.current);
				frameRef.current = null;
			}
		};

		const btn = ref.current;
		if (!btn) return;

		btn.addEventListener("mousemove", handleMouseMove, { passive: true });
		btn.addEventListener("mouseleave", handleMouseLeave);

		return () => {
			btn.removeEventListener("mousemove", handleMouseMove);
			btn.removeEventListener("mouseleave", handleMouseLeave);
			if (frameRef.current) cancelAnimationFrame(frameRef.current);
		};
	}, []);

	return (
		<Link href={href}>
			<motion.a
				ref={ref}
				animate={{ x: offset.x, y: offset.y, scale: offset.x !== 0 ? 1.04 : 1 }}
				transition={spring.magnetic}
				className={`${variantClass} ${className}`}
				{...props}
			>
				{children}
			</motion.a>
		</Link>
	);
}
