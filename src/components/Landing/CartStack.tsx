import React, { useState } from "react";
import { motion, TargetAndTransition } from "framer-motion";

// --- Types ---
interface CardData {
	id: number;
	emoji: string;
	badge: string;
	name: string;
	price: string;
	gradient: string;
	borderColor: string;
}

interface SlotVariants {
	idle: TargetAndTransition;
	hover: TargetAndTransition;
}

interface CardItemProps extends CardData {
	initial: TargetAndTransition;
	animate: TargetAndTransition;
	transition: object;
	zIndex: number;
}

// --- Component Data ---
const PRODUCTS: CardData[] = [
	{
		id: 3,
		emoji: "🌿",
		badge: "مراقبت پوست",
		name: "ماسک صورت سبز",
		price: "۹۵,۰۰۰",
		gradient: "linear-gradient(160deg, #2a1f2e, #1a1218)",
		borderColor: "rgba(107,78,113,.3)",
	},
	{
		id: 2,
		emoji: "💄",
		badge: "آرایش صورت",
		name: "رژلب مات ولوت",
		price: "۱۸۰,۰۰۰",
		gradient: "linear-gradient(160deg, #281e1a, #1a1210)",
		borderColor: "rgba(212,165,165,.2)",
	},
	{
		id: 1,
		emoji: "✨",
		badge: "ویژه ماهورا",
		name: "سرم روشن‌کننده Capture",
		price: "۴۵۰,۰۰۰ تومان",
		gradient: "linear-gradient(160deg, #2e2420, #1c1410)",
		borderColor: "rgba(201,168,117,.15)",
	},
];

// --- Animation Variants ---
// width/height/bottom live in idle so they always animate on slot change
const cardVariants: Record<string, SlotVariants> = {
	card3: {
		idle: { x: "-50%", rotate: -8, y: 12, bottom: -12, width: 240, height: 320 },
		hover: { x: "calc(-50% - 100px)", rotate: -14, y: -50 },
	},
	card2: {
		idle: { x: "-50%", rotate: -3, y: 6, bottom: -6, width: 260, height: 360 },
		hover: { x: "calc(-50% + 100px)", rotate: 10, y: -50 },
	},
	card1: {
		idle: { x: "-50%", rotate: 0, y: 0, scale: 1, bottom: 0, width: 280, height: 400 },
		hover: { x: "-50%", rotate: -2, y: -30, scale: 1.03 },
	},
};

const SLOT_CONFIGS = [
	{ cardKey: "card3", zIndex: 1 },
	{ cardKey: "card2", zIndex: 2 },
	{ cardKey: "card1", zIndex: 3 },
];

// Staggered on swap: back departs first, new front pops in last with bounce
const SLOT_TRANSITIONS = [
	{ type: "spring" as const, stiffness: 380, damping: 32, delay: 0 },
	{ type: "spring" as const, stiffness: 290, damping: 26, delay: 0.05 },
	{ type: "spring" as const, stiffness: 250, damping: 14, delay: 0.1 },
];

const DEFAULT_TRANSITION = {
	type: "spring" as const,
	stiffness: 260,
	damping: 20,
	mass: 1,
};

// --- Main Component ---
const CardStack: React.FC = () => {
	const [rotation, setRotation] = useState(0);
	const [isHovered, setIsHovered] = useState(false);
	const [isTransitioning, setIsTransitioning] = useState(false);

	const orderedProducts = [
		PRODUCTS[(rotation + 2) % 3],
		PRODUCTS[(rotation + 1) % 3],
		PRODUCTS[rotation % 3],
	];

	const handleClick = () => {
		if (isTransitioning) return;
		setIsTransitioning(true);
		setRotation((r) => (r + 1) % 3);
		setTimeout(() => setIsTransitioning(false), 700);
	};

	return (
		<section className="relative w-full h-[600px] flex items-end justify-center overflow-visible py-20">
			<motion.div
				className="relative w-[280px] h-full cursor-pointer"
				onHoverStart={() => setIsHovered(true)}
				onHoverEnd={() => setIsHovered(false)}
				onClick={handleClick}
			>
				{orderedProducts.map((product, index) => {
					const slot = SLOT_CONFIGS[index];
					const variantSet = cardVariants[slot.cardKey];
					// Merge idle into hover so width/height/bottom always animate correctly
					const animateTarget = isHovered
						? { ...variantSet.idle, ...variantSet.hover }
						: variantSet.idle;
					const transition = isTransitioning
						? SLOT_TRANSITIONS[index]
						: DEFAULT_TRANSITION;

					return (
						<CardItem
							key={product.id}
							{...product}
							initial={variantSet.idle}
							animate={animateTarget}
							transition={transition}
							zIndex={slot.zIndex}
						/>
					);
				})}
			</motion.div>
		</section>
	);
};

// --- Sub-Component ---
const CardItem: React.FC<CardItemProps> = ({
	initial,
	animate,
	transition,
	zIndex,
	emoji,
	badge,
	name,
	price,
	gradient,
	borderColor,
}) => {
	return (
		<motion.div
			initial={initial}
			animate={animate}
			transition={transition}
			className="absolute left-1/2 rounded-[24px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5),0_8px_24px_rgba(0,0,0,0.3)]"
			style={{
				background: gradient,
				border: `1px solid ${borderColor}`,
				zIndex,
				bottom: 0,
			}}
		>
			<div className="relative w-full h-full flex flex-col items-center justify-center p-6 gap-3 text-white">
				{/* Card Glow Effect */}
				<div
					className="absolute inset-0 opacity-40 pointer-events-none"
					style={{
						background:
							"radial-gradient(ellipse 60%_40% at 50% 30%, rgba(201,168,117,0.35), transparent)",
					}}
				/>

				{/* Content */}
				<span className="text-5xl drop-shadow-xl z-10 select-none mb-2">
					{emoji}
				</span>

				<span className="text-[10px] font-bold tracking-widest uppercase py-1 px-3 rounded-full bg-white/10 border border-white/10 text-white/60 z-10">
					{badge}
				</span>

				<h3 className="text-[15px] font-bold text-center z-10 leading-relaxed max-w-[80%]">
					{name}
				</h3>

				<div className="w-10 h-[1px] bg-white/10 z-10 my-1" />

				<span className="text-xl font-extrabold text-[#c9a875] z-10 tracking-tighter">
					{price}
				</span>
			</div>
		</motion.div>
	);
};

export default CardStack;
