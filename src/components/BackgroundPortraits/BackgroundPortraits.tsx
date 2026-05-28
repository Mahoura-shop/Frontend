"use client";

import React from "react";
import { BG_PORTRAITS } from "@/data/bgPortraits";

interface SlotConfig {
	pos: React.CSSProperties;
	w: number;
	h: number;
	opacity: number;
	rotate: number;
	delay: string;
	mobileHidden: boolean;
}

// 20 predefined slots spread around the screen edges.
// Positions are percentage-based so they scale with any viewport.
const SLOTS: SlotConfig[] = [
	// Corner slots — most visible, show on mobile too
	{ pos: { right: "-3%", top: "-4%" },    w: 170, h: 250, opacity: 0.11, rotate: 11,  delay: "0s",      mobileHidden: false },
	{ pos: { left: "-3%",  bottom: "14%" }, w: 158, h: 228, opacity: 0.10, rotate: -9,  delay: "-1.5s",   mobileHidden: false },
	{ pos: { left: "-2%",  top: "-3%" },    w: 152, h: 222, opacity: 0.09, rotate: -6,  delay: "-3s",     mobileHidden: false },
	{ pos: { right: "-2%", bottom: "9%" },  w: 148, h: 215, opacity: 0.09, rotate: 8,   delay: "-4.5s",   mobileHidden: false },
	// Near-edge slots — desktop only
	{ pos: { right: "6%",  top: "9%" },     w: 140, h: 200, opacity: 0.08, rotate: -5,  delay: "-6s",     mobileHidden: true },
	{ pos: { left: "7%",   bottom: "4%" },  w: 135, h: 195, opacity: 0.08, rotate: 4,   delay: "-7.5s",   mobileHidden: true },
	{ pos: { left: "4%",   top: "12%" },    w: 130, h: 190, opacity: 0.07, rotate: -3,  delay: "-9s",     mobileHidden: true },
	{ pos: { right: "8%",  bottom: "17%" }, w: 128, h: 185, opacity: 0.07, rotate: 6,   delay: "-10.5s",  mobileHidden: true },
	// Mid-edge slots
	{ pos: { left: "1%",   top: "30%" },    w: 124, h: 180, opacity: 0.07, rotate: 3,   delay: "-0.8s",   mobileHidden: true },
	{ pos: { left: "10%",  top: "54%" },    w: 120, h: 175, opacity: 0.06, rotate: -7,  delay: "-2.3s",   mobileHidden: true },
	{ pos: { right: "1%",  top: "27%" },    w: 118, h: 172, opacity: 0.07, rotate: -4,  delay: "-5.8s",   mobileHidden: true },
	{ pos: { right: "10%", top: "57%" },    w: 116, h: 168, opacity: 0.06, rotate: 9,   delay: "-8.2s",   mobileHidden: true },
	// Top/bottom center slots
	{ pos: { left: "22%",  top: "-5%" },    w: 130, h: 185, opacity: 0.07, rotate: -2,  delay: "-1.1s",   mobileHidden: true },
	{ pos: { right: "22%", top: "-4%" },    w: 128, h: 182, opacity: 0.07, rotate: 5,   delay: "-3.7s",   mobileHidden: true },
	{ pos: { left: "17%",  bottom: "-4%" }, w: 124, h: 178, opacity: 0.06, rotate: 3,   delay: "-6.4s",   mobileHidden: true },
	{ pos: { right: "17%", bottom: "-3%" }, w: 120, h: 175, opacity: 0.06, rotate: -6,  delay: "-9.1s",   mobileHidden: true },
	// Far-edge slots — partially off-screen, show on mobile too
	{ pos: { left: "-4%",  top: "44%" },    w: 118, h: 170, opacity: 0.06, rotate: 2,   delay: "-11s",    mobileHidden: false },
	{ pos: { right: "-4%", top: "41%" },    w: 116, h: 168, opacity: 0.06, rotate: -3,  delay: "-12.5s",  mobileHidden: false },
	{ pos: { left: "15%",  top: "4%" },     w: 114, h: 164, opacity: 0.06, rotate: 7,   delay: "-2.9s",   mobileHidden: true },
	{ pos: { right: "14%", bottom: "7%" },  w: 112, h: 160, opacity: 0.05, rotate: -8,  delay: "-4.6s",   mobileHidden: true },
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
			style={{ position: mode, inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 1 }}
			aria-hidden="true"
		>
			{SLOTS.slice(0, count).map((slot, i) => {
				const img = BG_PORTRAITS[(i + seed) % BG_PORTRAITS.length];
				return (
					<div
						key={i}
						className={slot.mobileHidden ? "hidden md:block" : undefined}
						style={{
							position: "absolute",
							...slot.pos,
							width: slot.w,
							height: slot.h,
							transform: `rotate(${slot.rotate}deg)`,
						}}
					>
						{/* Inner wrapper carries the float animation so it doesn't override the rotation above */}
						<div
							className="animate-float w-full h-full"
							style={{ animationDelay: slot.delay }}
						>
							<img
								src={img.src}
								alt=""
								draggable={false}
								className="w-full h-full object-contain select-none"
								style={{
									opacity: slot.opacity,
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
