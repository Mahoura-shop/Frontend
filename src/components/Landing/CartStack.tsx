import React from "react";
import { motion, Variants } from "framer-motion";

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

interface CardItemProps extends CardData {
	variants: Variants;
	zIndex: number;
	width: number;
	height: number;
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
const cardVariants: Record<string, Variants> = {
	card3: {
		idle: { x: "-50%", rotate: -8, y: 12, bottom: -12 },
		hover: { x: "calc(-50% - 100px)", rotate: -14, y: -50 },
	},
	card2: {
		idle: { x: "-50%", rotate: -3, y: 6, bottom: -6 },
		hover: { x: "calc(-50% + 100px)", rotate: 10, y: -50 },
	},
	card1: {
		idle: { x: "-50%", rotate: 0, y: 0, scale: 1 },
		hover: { x: "-50%", rotate: -2, y: -30, scale: 1.03 },
	},
};

// --- Main Component ---
const CardStack: React.FC = () => {
	return (
		<section className="relative w-full h-[600px] flex items-end justify-center overflow-visible py-20">
			{/* Container that triggers the hover state for all children */}
			<motion.div
				className="relative w-[280px] h-full cursor-pointer"
				initial="idle"
				whileHover="hover"
			>
				{PRODUCTS.map((product, index) => {
					// Logic to assign correct variant and dimensions based on order
					const cardKey = `card${product.id}`;
					const zIndex = 3 - index; // Card 1 is top (3), Card 3 is bottom (1)

					// Match the HTML dimensions
					const dimensions =
						product.id === 1
							? { w: 280, h: 400 }
							: product.id === 2
								? { w: 260, h: 360 }
								: { w: 240, h: 320 };

					return (
						<CardItem
							key={product.id}
							{...product}
							variants={cardVariants[cardKey]}
							zIndex={
								product.id === 1 ? 3 : product.id === 2 ? 2 : 1
							}
							width={dimensions.w}
							height={dimensions.h}
						/>
					);
				})}
			</motion.div>
		</section>
	);
};

// --- Sub-Component ---
const CardItem: React.FC<CardItemProps> = ({
	variants,
	zIndex,
	width,
	height,
	emoji,
	badge,
	name,
	price,
	gradient,
	borderColor,
}) => {
	return (
		<motion.div
			variants={variants}
			transition={{
				type: "spring",
				stiffness: 260,
				damping: 20,
				mass: 1,
			}}
			className="absolute left-1/2 rounded-[24px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5),0_8px_24px_rgba(0,0,0,0.3)]"
			style={{
				width: `${width}px`,
				height: `${height}px`,
				background: gradient,
				border: `1px solid ${borderColor}`,
				zIndex: zIndex,
				bottom: 0, // Cards align to the bottom of the parent motion.div
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
