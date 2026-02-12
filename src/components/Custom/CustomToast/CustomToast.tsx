import { toast } from "sonner";
export default function CustomToast(
	message: string,
	mode?: "success" | "error" | "warning" | "info" | undefined,
) {
	function Toast(message: string) {
		return (
			<div data-test="sonner-toast" className="font-vazirmatn">
				{message}
			</div>
		);
	}
	const commonOptions = {};
	if (mode === "success") return toast.success(Toast(message), commonOptions);
	else if (mode === "error")
		return toast.error(Toast(message), commonOptions);
	else if (mode === "warning")
		return toast.warning(Toast(message), commonOptions);
	else if (mode === "info") return toast.info(Toast(message), commonOptions);
	else return toast(Toast(message));
}
