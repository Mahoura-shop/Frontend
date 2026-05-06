import React, {
	useState,
	useEffect,
	useRef,
	ReactNode,
	HTMLAttributes,
} from "react";

interface MagnetProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	padding?: number;
	disabled?: boolean;
	magnetStrength?: number;
	activeTransition?: string;
	inactiveTransition?: string;
	wrapperClassName?: string;
	innerClassName?: string;
}

const Magnet: React.FC<MagnetProps> = ({
	children,
	padding = 10,
	disabled = false,
	magnetStrength = 2,
	activeTransition = "transform 0.3s ease-out",
	inactiveTransition = "transform 0.5s ease-in-out",
	wrapperClassName = "",
	innerClassName = "",
	...props
}) => {
	const [isActive, setIsActive] = useState<boolean>(false);
	const [position, setPosition] = useState<{ x: number; y: number }>({
		x: 0,
		y: 0,
	});
	const magnetRef = useRef<HTMLDivElement>(null);
	const frameRef = useRef<number | null>(null);
	const lastPosRef = useRef({ x: 0, y: 0 });

	useEffect(() => {
		if (disabled) {
			setPosition({ x: 0, y: 0 });
			return;
		}

		const handleMouseMove = (e: MouseEvent) => {
			lastPosRef.current = { x: e.clientX, y: e.clientY };

			if (frameRef.current) return;

			frameRef.current = requestAnimationFrame(() => {
				if (!magnetRef.current) {
					frameRef.current = null;
					return;
				}

				const { left, top, width, height } =
					magnetRef.current.getBoundingClientRect();
				const centerX = left + width / 2;
				const centerY = top + height / 2;

				const distX = Math.abs(centerX - lastPosRef.current.x);
				const distY = Math.abs(centerY - lastPosRef.current.y);

				if (distX < width / 2 + padding && distY < height / 2 + padding) {
					setIsActive(true);
					const offsetX = (lastPosRef.current.x - centerX) / magnetStrength;
					const offsetY = (lastPosRef.current.y - centerY) / magnetStrength;
					setPosition({ x: offsetX, y: offsetY });
				} else {
					setIsActive(false);
					setPosition({ x: 0, y: 0 });
				}
				frameRef.current = null;
			});
		};

		window.addEventListener("mousemove", handleMouseMove, { passive: true });
		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			if (frameRef.current) cancelAnimationFrame(frameRef.current);
		};
	}, [padding, disabled, magnetStrength]);

	const transitionStyle = isActive ? activeTransition : inactiveTransition;

	return (
		<div
			ref={magnetRef}
			className={wrapperClassName}
			style={{ position: "relative", display: "inline-block" }}
			{...props}
		>
			<div
				className={innerClassName}
				style={{
					transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
					transition: transitionStyle,
					willChange: "transform",
				}}
			>
				{children}
			</div>
		</div>
	);
};

export default Magnet;
