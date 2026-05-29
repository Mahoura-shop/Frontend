"use client";

import React from "react";
import { BG_PORTRAITS } from "@/data/bgPortraits";
import { cn } from "@/lib/utils";

interface SlotConfig {
	pos: React.CSSProperties;
	w: number;
	h: number;
	opacity: number;
	rotate: number;
	delay: string;
	mobileHidden: boolean;
}

// Slots 0-7: corner/edge positions — safe in ANY container height (used by sections).
//   Alternates top-left, top-right, bottom-left, bottom-right so count=4 always
//   gives one image per corner with no vertical overlap possible.
// Slots 8-19: mid-page positions — only for layout-level tall containers (count ≥ 8).
const SLOTS: SlotConfig[] = [
	// 4 far corners — count=4 guarantees one per corner, never overlap
	{ pos: { left:  "4%", top:    "6%" }, w: 165, h: 238, opacity: 0.11, rotate:  8,  delay:  "0s",    mobileHidden: false },
	{ pos: { right: "4%", top:    "7%" }, w: 162, h: 234, opacity: 0.11, rotate: -10, delay: "-3.2s",  mobileHidden: false },
	{ pos: { left:  "3%", bottom: "5%" }, w: 158, h: 228, opacity: 0.11, rotate:  -7, delay: "-6.5s",  mobileHidden: false },
	{ pos: { right: "3%", bottom: "6%" }, w: 155, h: 224, opacity: 0.11, rotate:   9, delay: "-9.8s",  mobileHidden: false },

	// 4 inner top/bottom — same top/bottom row as corners but inset horizontally
	//   Horizontal gap from far corners is large enough (≥ 130px) at any width
	{ pos: { left:  "18%", top:    "-4%" }, w: 140, h: 202, opacity: 0.09, rotate:  -4, delay: "-1.6s",  mobileHidden: true },
	{ pos: { right: "16%", top:    "-5%" }, w: 138, h: 198, opacity: 0.09, rotate:   6, delay: "-5.1s",  mobileHidden: true },
	{ pos: { left:  "20%", bottom: "-4%" }, w: 136, h: 196, opacity: 0.09, rotate:   4, delay: "-8.3s",  mobileHidden: true },
	{ pos: { right: "18%", bottom: "-3%" }, w: 134, h: 192, opacity: 0.09, rotate:  -8, delay: "-11.7s", mobileHidden: true },

	// Mid-page zones — layout-level only (container must be tall, ≥ 1500px)
	// Zone A  ~22-34% of page height
	{ pos: { left:  "-4%", top: "22%" }, w: 155, h: 224, opacity: 0.10, rotate:   3, delay: "-2.4s",  mobileHidden: false },
	{ pos: { right: "-4%", top: "24%" }, w: 152, h: 220, opacity: 0.10, rotate:  -5, delay: "-7.6s",  mobileHidden: false },
	{ pos: { left:  "18%", top: "34%" }, w: 132, h: 192, opacity: 0.08, rotate:   7, delay: "-4.3s",  mobileHidden: true  },
	{ pos: { right: "16%", top: "36%" }, w: 130, h: 188, opacity: 0.08, rotate:  -3, delay: "-10.9s", mobileHidden: true  },

	// Zone B  ~52-64% of page height
	{ pos: { left:  "-3%", top: "52%" }, w: 150, h: 218, opacity: 0.10, rotate:  -9, delay: "-0.8s",  mobileHidden: false },
	{ pos: { right: "-3%", top: "54%" }, w: 148, h: 214, opacity: 0.10, rotate:   6, delay: "-6.1s",  mobileHidden: false },
	{ pos: { left:  "20%", top: "64%" }, w: 128, h: 185, opacity: 0.08, rotate:   4, delay: "-3.5s",  mobileHidden: true  },
	{ pos: { right: "18%", top: "75%" }, w: 126, h: 182, opacity: 0.08, rotate:  -7, delay: "-9.2s",  mobileHidden: true  },

	// Zone C  ~78-88% of page height
	{ pos: { left:  "-4%", top: "78%" }, w: 152, h: 220, opacity: 0.10, rotate:   5, delay: "-1.9s",  mobileHidden: false },
	{ pos: { right: "-4%", top: "80%" }, w: 150, h: 216, opacity: 0.10, rotate:  -4, delay: "-7.3s",  mobileHidden: false },
	{ pos: { left:  "22%", top: "88%" }, w: 128, h: 186, opacity: 0.08, rotate:  -6, delay: "-4.7s",  mobileHidden: true  },
	{ pos: { right: "20%", top: "86%" }, w: 125, h: 182, opacity: 0.08, rotate:   8, delay: "-12.1s", mobileHidden: true  },
];

interface Props {
	count?: number;
	seed?: number;
	mode?: "fixed" | "absolute";
}

export default function BackgroundPortraits({ count = 6, seed = 0, mode = "absolute" }: Props) {
	if (!BG_PORTRAITS.length) return null;

	return (
		<div
			style={{ position: mode, inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}
			aria-hidden="true"
		>
			{SLOTS.slice(0, count).map((slot, i) => {
				const img = BG_PORTRAITS[(i + seed * 7) % BG_PORTRAITS.length];
				return (
					<div
						key={i}
						className={cn(slot.mobileHidden ? "hidden md:block" : undefined)}
						style={{
							position: "absolute",
							...slot.pos,
							translate: `${(seed + i) % 2 && "-"}${seed}%`,
							width: slot.w * 1.7,
							height: slot.h,
							transform: `rotate(${slot.rotate}deg)`,
						}}
					>
						{/* Inner wrapper carries the float animation so it doesn't override the rotation above */}
						<div
							className="animate-float-subtle w-full h-full"
							style={{ animationDelay: slot.delay }}
						>
							<img
								src={img.src}
								alt=""
								draggable={false}
								className="w-full h-full object-contain select-none mix-blend-multiply dark:invert dark:mix-blend-screen opacity-80 dark:opacity-70"
								style={{
									opacity: slot.opacity * 2,
									pointerEvents: "none",
									userSelect: "none",
								}}
							/>
						</div>
					</div>
				);
			})}
		</div>
	);
}
