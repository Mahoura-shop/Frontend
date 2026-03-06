import { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import Button from "@/components/Custom/Button/Button";
import { getCurrencies } from "@/services/currency";
import { formatPrice } from "@/utils/formatPrice";

export default function CurrencyConvertRatesDialog() {
	const [open, setOpen] = useState<boolean>(false);
	const [currencies, setCurrencies] = useState<Currency[]>([]);
	const fetchCurrencies = () => {
		getCurrencies().then((data) => setCurrencies(data?.data));
	};
	useEffect(() => {
		fetchCurrencies();
	}, []);
	return (
		<Dialog
			open={open}
			onOpenChange={(val) => {
				setOpen(val);
			}}
		>
			<DialogTrigger>
				<Button variant="secondary">مشاهده نرخ ارزها</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>نرخ ارزها</DialogTitle>
				</DialogHeader>
				{currencies?.map((currency, index) => (
					<p key={index}>
						{currency.name}: {formatPrice(currency.convertRate)} ریال
					</p>
				))}
			</DialogContent>
		</Dialog>
	);
}
