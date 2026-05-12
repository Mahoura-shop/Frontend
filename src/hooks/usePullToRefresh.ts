import { useEffect, useRef, useState } from "react";

export function usePullToRefresh(onRefresh: () => void | Promise<void>, threshold = 80) {
	const [pulling, setPulling] = useState(false);
	const [pullY, setPullY] = useState(0);
	const [refreshing, setRefreshing] = useState(false);
	const startY = useRef<number | null>(null);

	useEffect(() => {
		const el = document.documentElement;

		const onTouchStart = (e: TouchEvent) => {
			if (el.scrollTop > 0) return;
			startY.current = e.touches[0].clientY;
		};

		const onTouchMove = (e: TouchEvent) => {
			if (startY.current === null) return;
			const delta = e.touches[0].clientY - startY.current;
			if (delta <= 0) { startY.current = null; return; }
			setPulling(true);
			setPullY(Math.min(delta * 0.45, threshold));
		};

		const onTouchEnd = async () => {
			if (!pulling) return;
			if (pullY >= threshold) {
				setRefreshing(true);
				try { await onRefresh(); } finally { setRefreshing(false); }
			}
			setPulling(false);
			setPullY(0);
			startY.current = null;
		};

		window.addEventListener("touchstart", onTouchStart, { passive: true });
		window.addEventListener("touchmove", onTouchMove, { passive: true });
		window.addEventListener("touchend", onTouchEnd);
		return () => {
			window.removeEventListener("touchstart", onTouchStart);
			window.removeEventListener("touchmove", onTouchMove);
			window.removeEventListener("touchend", onTouchEnd);
		};
	}, [onRefresh, pulling, pullY, threshold]);

	return { pulling, pullY, refreshing };
}
