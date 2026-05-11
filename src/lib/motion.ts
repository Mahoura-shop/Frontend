import type { Transition } from "framer-motion";

export const spring = {
	default: { type: "spring", stiffness: 300, damping: 30 } satisfies Transition,
	snappy: { type: "spring", stiffness: 400, damping: 35 } satisfies Transition,
	responsive: { type: "spring", stiffness: 400, damping: 25 } satisfies Transition,
	gentle: { type: "spring", stiffness: 200, damping: 25 } satisfies Transition,
	slow: { type: "spring", stiffness: 50, damping: 20 } satisfies Transition,
	magnetic: { type: "spring", stiffness: 150, damping: 15 } satisfies Transition,
	bottomNav: { type: "spring", stiffness: 260, damping: 28 } satisfies Transition,
} as const;

export const ease = {
	standard: { duration: 0.3, ease: "easeInOut" } satisfies Transition,
	fast: { duration: 0.2, ease: "easeOut" } satisfies Transition,
	enter: { duration: 0.6, ease: "easeOut" } satisfies Transition,
	slow: { duration: 0.9, ease: "easeOut" } satisfies Transition,
} as const;

export const fadeInUp = {
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0 },
} as const;

export const fadeInScale = {
	initial: { opacity: 0, scale: 0.95 },
	animate: { opacity: 1, scale: 1 },
} as const;
