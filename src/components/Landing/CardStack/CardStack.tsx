import React, { useState, useEffect } from "react";
import { motion, TargetAndTransition } from "framer-motion";

// --- Types ---
interface CardData {
	id: number;
	emoji: string;
	badge: string;
	name: string;
	price: string;
	// gradient: string;
	// borderColor: string;
	hue: number;
}

interface SlotVariants {
	idle: TargetAndTransition;
	hover: TargetAndTransition;
}

interface CardItemProps extends CardData {
	// Make initial optional if you want, or just ensure it's passed
	initial?: TargetAndTransition;
	animate: any; // Using any here briefly to handle the complex dynamic object
	transition: any;
	zIndex: number;
}

// --- Component Data ---
// const PRODUCTS: CardData[] = [
// 	{
// 		id: 3,
// 		emoji: "🌿",
// 		badge: "مراقبت پوست",
// 		name: "ماسک صورت سبز",
// 		price: "۹۵,۰۰۰",
// 		gradient: "linear-gradient(160deg, #2a1f2e, #1a1218)",
// 		borderColor: "rgba(107,78,113,.3)",
// 	},
// 	{
// 		id: 2,
// 		emoji: "💄",
// 		badge: "آرایش صورت",
// 		name: "رژلب مات ولوت",
// 		price: "۱۸۰,۰۰۰",
// 		gradient: "linear-gradient(160deg, #281e1a, #1a1210)",
// 		borderColor: "rgba(212,165,165,.2)",
// 	},
// 	{
// 		id: 1,
// 		emoji: "✨",
// 		badge: "ویژه ماهورا",
// 		name: "سرم روشن‌کننده",
// 		price: "۴۵۰,۰۰۰ ریال",
// 		gradient: "linear-gradient(160deg, #2e2420, #1c1410)",
// 		borderColor: "rgba(201,168,117,.15)",
// 	},
// ];

const PRODUCTS: CardData[] = [
	{
		id: 3,
		emoji: "🌿",
		badge: "مراقبت پوست",
		name: "ماسک صورت سبز",
		price: "۹۵,۰۰۰",
		hue: 0,
		// hue: 142, // Green hue
	},
	{
		id: 2,
		emoji: "💄",
		badge: "آرایش صورت",
		name: "رژلب مات ولوت",
		price: "۱۸۰,۰۰۰",
		hue: 283,
		// hue: 350, // Pink/Red hue
	},
	{
		id: 1,
		emoji: "✨",
		badge: "ویژه ماهورا",
		name: "سرم روشن‌کننده",
		price: "۴۵۰,۰۰۰ ریال",
		hue: 38,
		// hue: 35, // Gold/Orange hue
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

const CardStack: React.FC = () => {
	const [rotation, setRotation] = useState(0);
	const [isHovered, setIsHovered] = useState(false);
	const [isTransitioning, setIsTransitioning] = useState(false);

	const orderedProducts = [
		PRODUCTS[(rotation + 2) % 3],
		PRODUCTS[(rotation + 1) % 3],
		PRODUCTS[rotation % 3],
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

// --- Main Component ---
const CardItem: React.FC<CardItemProps> = ({
	initial,
	animate,
	transition,
	// We can ignore the zIndex prop here and let Framer Motion handle it via 'animate'
	emoji,
	badge,
	name,
	price,
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
				// Do NOT set a static zIndex here; animateTarget.zIndex handles it
				transitionProperty: "background-color, border-color",
				transitionDuration: "500ms",
				background: `linear-gradient(160deg, 
                    hsl(${hue} var(--card-saturation) var(--card-bg-l-top)), 
                    hsl(${hue} var(--card-saturation) var(--card-bg-l-bottom)))`,
				borderColor: `hsl(${hue} 40% 50% / var(--card-border-opacity))`,
			}}
		>
			{/* Content... */}
		</motion.div>
	);
};

export default CardStack;
