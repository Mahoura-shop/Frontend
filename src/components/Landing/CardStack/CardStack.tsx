import React, { useState, useEffect } from "react";
import { motion, TargetAndTransition } from "framer-motion";
import portrait from "@/assets/landing/7385752.jpeg";
import woman1 from "@/assets/landing/woman1.jpeg";
import woman2 from "@/assets/landing/woman2.jpeg";
// --- Types ---
interface CardData {
	id: number;
	label: string;
	title: string;
	description: string;
	hue: number;
	hex: string;
}

interface SlotVariants {
	idle: TargetAndTransition;
	hover: TargetAndTransition;
}

interface CardItemProps extends CardData {
	initial?: TargetAndTransition;
	animate: any;
	transition: any;
}

// --- Component Data ---
const CARDS: CardData[] = [
	{
		id: 3,
		label: "زیبایی شما",
		title: "درخشش هر روز",
		description: "پوستی شاداب و اعتمادی که هر روز همراه توست",
		hue: 142,
		hex: "#111A14",
	},
	{
		id: 2,
		label: "پوست درخشان",
		title: "آبرسانی عمیق",
		description: "رطوبت پایدار ۲۴ ساعته برای پوستی شاداب و جوان",
		hue: 340,
		hex: "#16111A",
	},
	{
		id: 1,
		label: "ویژه ماهورا",
		title: "زیبایی لوکس",
		description: "تجربه‌ای بی‌نظیر از مراقبت پوست با برترین برندهای جهانی",
		hue: 38,
		hex: "#1A1711",
	},
];

// --- Animation Variants ---
// width/height/bottom live in idle so they always animate on slot change
const cardVariants: Record<string, SlotVariants> = {
	card3: {
		idle: {
			x: "-50%",
			rotate: -8,
			y: 12,
			bottom: -12,
			width: 260,
			height: 320,
		},
		hover: { x: "calc(-50% - 100px)", rotate: -14, y: -50 },
	},
	card2: {
		idle: {
			x: "-50%",
			rotate: -5,
			y: 6,
			bottom: -6,
			width: 260,
			height: 360,
		},
		hover: { x: "calc(-50% + 100px)", rotate: 10, y: -50 },
	},
	card1: {
		idle: {
			x: "-50%",
			rotate: 0,
			y: 0,
			scale: 1,
			bottom: 0,
			width: 260,
			height: 400,
		},
		hover: { x: "-50%", rotate: 0, y: -30 },
	},
};

const SLOT_CONFIGS = [
	{ cardKey: "card3", zIndex: 1 },
	{ cardKey: "card2", zIndex: 2 },
	{ cardKey: "card1", zIndex: 3 },
];
const x = 20;
const y = 400;
const m = 0;
// Snappy rotation: all cards animate in sync, no delay
const SLOT_TRANSITIONS = [
	{ type: "spring" as const, stiffness: y, damping: x, delay: m },
	{ type: "spring" as const, stiffness: y, damping: x, delay: m },
	{ type: "spring" as const, stiffness: y, damping: x, delay: m },
];

// --- Card Icons ---
const cardIcons: Record<number, (hue: number) => React.ReactNode> = {
	3: (_hue) => (
		<img
			src={portrait.src}
			alt=""
			className="w-[88%] max-h-full object-contain mix-blend-multiply dark:invert dark:mix-blend-screen opacity-80 dark:opacity-70"
		/>
	),
	2: (_hue) => (
		<img
			src={woman2.src}
			alt=""
			className="w-[88%] max-h-full object-contain mix-blend-multiply dark:invert dark:mix-blend-screen opacity-80 dark:opacity-70"
		/>
	),
	1: (_hue) => (
		<img
			src={woman1.src}
			alt=""
			className="w-[88%] max-h-full object-contain mix-blend-multiply dark:invert dark:mix-blend-screen opacity-80 dark:opacity-70"
		/>
	),
};

const CardStack: React.FC = () => {
	const [rotation, setRotation] = useState(0);
	const [isHovered, setIsHovered] = useState(false);
	const [isTransitioning, setIsTransitioning] = useState(false);

	const orderedProducts = [
		CARDS[(rotation + 2) % 3],
		CARDS[(rotation + 1) % 3],
		CARDS[rotation % 3],
	];
	useEffect(() => {
		if (!isHovered) return;

		const interval = setInterval(() => {
			setIsTransitioning(true);

			// Step 1: Start the slow fly-out
			setTimeout(() => {
				// Step 2: Swap the actual data positions
				setRotation((r) => (r + 1) % 3);
				setIsTransitioning(false);
			}, 200); // Increased from 600ms for a smoother "arc"
		}, 2000); // Slightly longer pause between cards

		return () => clearInterval(interval);
	}, [isHovered]);
	return (
		<section className="relative w-full h-[600px] flex items-end justify-center overflow-visible py-20">
			<motion.div
				className="relative w-[280px] h-full"
				onHoverStart={() => setIsHovered(true)}
				onHoverEnd={() => setIsHovered(false)}
			>
				{orderedProducts.map((product, index) => {
					const slot = SLOT_CONFIGS[index];
					const variantSet = cardVariants[slot.cardKey];

					// index 2 is the "Top" card in your current orderedProducts logic
					const isTopMovingToBack = isTransitioning && index === 2;

					const animateTarget = {
						...variantSet.idle,
						...(isHovered ? variantSet.hover : {}),
						x: isTopMovingToBack
							? "-220%"
							: isHovered
								? variantSet.hover.x
								: variantSet.idle.x,
						y: isTopMovingToBack
							? -60
							: isHovered
								? variantSet.hover.y
								: variantSet.idle.y,
						rotate: isTopMovingToBack
							? -25
							: isHovered
								? variantSet.hover.rotate
								: variantSet.idle.rotate,
						scale: isTopMovingToBack ? 0.85 : 1,
						zIndex: isTopMovingToBack ? 0 : slot.zIndex,
					};

					// --- OPTIMIZED TRANSITION ---
					const sharedSpring = {
						type: "spring",
						stiffness: isTopMovingToBack ? 20 : 100,
						damping: isTopMovingToBack ? 15 : 20,
						mass: isTopMovingToBack ? 0.8 : 1,
					};

					return (
						<CardItem
							key={product.id}
							{...product}
							initial={variantSet.idle}
							animate={animateTarget}
							hue={product.hue}
							hex={product.hex}
							transition={{
								// Apply the spring to everything simultaneously
								...sharedSpring,
								// Only zIndex gets a specific override to delay the "behind" flip
								zIndex: {
									delay: isTopMovingToBack ? 0.4 : 0,
									duration: 0,
								},
							}}
						/>
					);
				})}
				{/* {orderedProducts.map((product, index) => {
					const slot = SLOT_CONFIGS[index];
					const variantSet = cardVariants[slot.cardKey];
					const isTopMovingToBack = isTransitioning && (index === 2);

					const animateTarget = {
						...variantSet.idle,
						...(isHovered ? variantSet.hover : {}),
						// --- LEFT EXIT LOGIC ---
						// Change "140%" to "-140%" to move to the left
						x: isTopMovingToBack
							? "-220%"
							: isHovered
								? variantSet.hover.x
								: variantSet.idle.x,
						y: isTopMovingToBack
							? -60
							: isHovered
								? variantSet.hover.y
								: variantSet.idle.y,
						// Flip the rotation to -25 so it tilts "outward" to the left
						rotate: isTopMovingToBack
							? -25
							: isHovered
								? variantSet.hover.rotate
								: variantSet.idle.rotate,
						scale: isTopMovingToBack ? 0.85 : 1,
						zIndex: isTopMovingToBack ? 0 : slot.zIndex,
					};

					return (
						<CardItem
							key={product.id}
							{...product}
							initial={variantSet.idle}
							animate={animateTarget}
							transition={
								isTopMovingToBack
									? {
											default: {
												type: "spring",
												stiffness: 40,
												damping: 15,
											},
											// Using your preferred 0.5s delay for the zIndex flip
											zIndex: { delay: 0.9, duration: 0 },
										}
									: {
											type: "spring",
											stiffness: 100,
											damping: 20,
										}
							}
						/>
					);
				})} */}
				{/* {orderedProducts.map((product, index) => {
					const slot = SLOT_CONFIGS[index];
					const variantSet = cardVariants[slot.cardKey];
					const isTopMovingToBack = isTransitioning && index === 2;
					const animateTarget = {
						...variantSet.idle,
						...(isHovered ? variantSet.hover : {}),
						x: isTopMovingToBack
							? "140%"
							: isHovered
								? variantSet.hover.x
								: variantSet.idle.x,
						y: isTopMovingToBack
							? -60
							: isHovered
								? variantSet.hover.y
								: variantSet.idle.y,
						rotate: isTopMovingToBack
							? 25
							: isHovered
								? variantSet.hover.rotate
								: variantSet.idle.rotate,
						scale: isTopMovingToBack ? 0.85 : 1,
						// We move zIndex into the animate object so we can control its transition
						zIndex: isTopMovingToBack ? 0 : slot.zIndex,
					};
					// const animateTarget = {
					// 	...variantSet.idle,
					// 	...(isHovered ? variantSet.hover : {}),
					// 	// FLY OUT LOGIC
					// 	x: isTopMovingToBack
					// 		? "140%"
					// 		: isHovered
					// 			? variantSet.hover.x
					// 			: variantSet.idle.x,
					// 	y: isTopMovingToBack
					// 		? -60
					// 		: isHovered
					// 			? variantSet.hover.y
					// 			: variantSet.idle.y,
					// 	rotate: isTopMovingToBack
					// 		? 25
					// 		: isHovered
					// 			? variantSet.hover.rotate
					// 			: variantSet.idle.rotate,
					// 	scale: isTopMovingToBack ? 0.85 : 1,
					// };
					return (
						<CardItem
							key={product.id}
							{...product}
							initial={variantSet.idle}
							animate={animateTarget}
							// IMPORTANT: Remove the static zIndex prop if it's fighting the animation
							transition={
								isTopMovingToBack
									? {
											// Movement transition
											default: {
												type: "spring",
												stiffness: 40,
												damping: 15,
											},
											// Delay the zIndex flip so it stays on top for 200ms
											// while it's moving to the side
											zIndex: { delay: 0.5, duration: 0 },
										}
									: {
											type: "spring",
											stiffness: 100,
											damping: 20,
										}
							}
						/>
					);
					return (
						<CardItem
							key={product.id}
							{...product}
							initial={variantSet.idle}
							animate={animateTarget}
							zIndex={isTopMovingToBack ? 0 : slot.zIndex}
							transition={
								isTopMovingToBack
									? {
											type: "spring",
											stiffness: 40, // Lower stiffness = slower movement
											damping: 15, // Higher damping = less oscillation/harshness
											mass: 0.8,
										}
									: {
											type: "spring",
											stiffness: 100, // Smooth movement for the cards sliding up
											damping: 20,
										}
							}
						/>
					);
				})} */}
			</motion.div>
		</section>
	);
};

// --- Card Item ---
const CardItem: React.FC<CardItemProps> = ({
	initial,
	animate,
	transition,
	id,
	label,
	title,
	description,
	hue,
}) => {
	return (
		<motion.div
			initial={initial}
			animate={animate}
			transition={transition}
			className="absolute left-1/2 rounded-[24px] cursor-pointer overflow-hidden border-[1px] shadow-2xl"
			style={{
				bottom: 0,
				transitionProperty: "background-color, border-color",
				transitionDuration: "500ms",
				background: `linear-gradient(160deg,
                    hsl(${hue} var(--card-saturation) var(--card-bg-l-top)),
                    hsl(${hue} var(--card-saturation) var(--card-bg-l-bottom)))`,
				borderColor: `hsl(${hue} 40% 50% / var(--card-border-opacity))`,
			}}
		>
			<div className="relative w-full h-full flex flex-col p-5" dir="rtl">
				{/* Label */}
				<div className="flex items-center gap-2">
					<div
						className="w-4 h-px"
						style={{ backgroundColor: `hsl(${hue} 55% 60% / 0.7)` }}
					/>
					<span
						className="text-[10px] font-bold tracking-widest"
						style={{ color: `hsl(${hue} 55% 62% / 0.85)` }}
					>
						{label}
					</span>
				</div>

				{/* SVG illustration */}
				<div className="flex-1 min-h-0 flex items-center justify-center overflow-hidden">
					{cardIcons[id]?.(hue)}
				</div>

				{/* Title + description */}
				<div className="space-y-2">
					<h3 className="text-base font-bold text-foreground leading-tight">
						{title}
					</h3>
					<p className="text-[11px] leading-relaxed opacity-60 text-foreground">
						{description}
					</p>
				</div>
			</div>
		</motion.div>
	);
};

export default CardStack;
