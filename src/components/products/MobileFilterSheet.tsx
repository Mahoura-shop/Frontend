"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import FilterPanel, { type FilterPanelProps } from "./FilterPanel";

interface Props extends FilterPanelProps {
	open: boolean;
	onClose: () => void;
}

export default function MobileFilterSheet({ open, onClose, onClear, ...filterProps }: Props) {
	const handleClear = () => {
		onClear();
		onClose();
	};

	return (
		<AnimatePresence>
			{open && (
				<motion.div
					key="filter-backdrop"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
					onClick={onClose}
				>
					<motion.div
						initial={{ y: "100%" }}
						animate={{ y: 0 }}
						exit={{ y: "100%" }}
						transition={{ type: "spring", damping: 30, stiffness: 300 }}
						className="absolute bottom-0 inset-x-0 glass-panel rounded-t-2xl max-h-[85vh] overflow-y-auto"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex justify-center pt-3 pb-1">
							<div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
						</div>
						<div className="p-6">
							<div className="flex items-center justify-between mb-6">
								<div />
								<Button variant="ghost" size="icon" onClick={onClose}>
									<X className="w-5 h-5" />
								</Button>
							</div>
							<FilterPanel {...filterProps} onClear={handleClear} />
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
