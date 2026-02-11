"use client";

import CustomToast from "@/components/Custom/CustomToast/CustomToast";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { deleteData } from "@/services/services";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export default function DeleteProductDialog({
	id,
	fetchProducts,
}: {
	id: number;
	fetchProducts: () => void;
}) {
	const [open, setOpen] = useState<boolean>(false);
	const handleDelete = (id: number) => {
		deleteData({ endPoint: `/v1/product/${id}` }).then(() => {
			fetchProducts();
		});
		CustomToast("محصول با موفقیت حذف شد", "success");
	};
	return (
		<Dialog open={open} onOpenChange={(value: boolean) => setOpen(value)}>
			<DialogTrigger>
				<Button
					size="icon"
					variant="secondary"
					className="h-8 w-8 text-red-500 hover:bg-background/80"
				>
					<Trash2 className="w-4 h-4" />
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-xl pb-4">
				<DialogHeader>
					<DialogTitle>حذف محصول</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					آیا از حذف این محصول مطمئن هستید؟
				</DialogDescription>
				<DialogFooter>
					<div className="flex gap-4">
						<Button onClick={() => setOpen(false)}>انصراف</Button>
						<Button
                            className="bg-red-600 hover:bg-red-600/80 text-white"
							// variant="destructive"
							onClick={() => handleDelete(id)}
						>
							حذف
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
