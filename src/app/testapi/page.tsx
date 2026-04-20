"use client";
import Button from "@/components/Custom/Button/Button";
import { getData, postData } from "@/services/services";
import useUserStore from "@/store/userStore/userStore";

export default function Page() {
	const Phone = "+989164911308";
	const { setAccessToken } = useUserStore();
	const callApi = () => {
		postData({
			endPoint: `/v1/auth`,
			data: { Phone },
		}).then((data) => {
			console.log("callApi", data);
		});
	};
	const callApi2 = () => {
		postData({
			endPoint: `/v1/auth/verify`,
			data: { Phone, OTP: "111111" },
		}).then((data) => {
			console.log("callApi2", data);
			setAccessToken(data.data.accessToken);
		});
	};
	const callApi3 = () => {
		getData({
			endPoint: `/v1/wallet`,
		}).then((data) => {
			console.log("callApi3", data);
		});
	};
	const callApi4 = () => {
		postData({
			endPoint: `/v1/wallet/deposit`,
			data: { amount: 10 },
		}).then((data) => {
			console.log("callApi4", data);
		});
	};
	const callApi5 = () => {
		postData({
			endPoint: `/v1/wallet/withdraw`,
			data: { amount: 10 },
		}).then((data) => {
			console.log("callApi5", data);
		});
	};
	const callApi6 = () => {
		postData({
			endPoint: `/v1/cart/1/add`,
		}).then((data) => {
			console.log("callApi6", data);
		});
	};
	const callApi7 = () => {
		postData({
			endPoint: `/v1/cart/2/add`,
		}).then((data) => {
			console.log("callApi7", data);
		});
	};
	const callApi8 = () => {
		postData({
			endPoint: `/v1/cart/1/remove`,
		}).then((data) => {
			console.log("callApi8", data);
		});
	};
	const callApi9 = () => {
		postData({
			endPoint: `/v1/cart/2/remove`,
		}).then((data) => {
			console.log("callApi9", data);
		});
	};
	const callApi10 = () => {
		getData({
			endPoint: `/v1/product`,
		}).then((data) => {
			console.log("callApi10", data);
		});
	};
	const callApi11 = () => {
		postData({
			endPoint: `/v1/order`,
		}).then((data) => {
			console.log("callApi11", data);
		});
	};
	const callApi12 = () => {
		getData({
			endPoint: `/v1/cart`,
		}).then((data) => {
			console.log("callApi12", data);
		});
	};
	return (
		<div className="flex flex-col gap-2 place-items-center place-content-center text-center bg-gray-800 h-screen w-screen">
			<div className="flex gap-2">
				<Button onClick={() => callApi()}>Send OTP</Button>
				<Button onClick={() => callApi2()}>Auth</Button>
				<Button onClick={() => callApi3()}>test api</Button>
			</div>
			<div className="flex gap-2">
				<Button onClick={() => callApi4()}>Deposit 10</Button>
				<Button onClick={() => callApi5()}>Withdraw 10</Button>
			</div>
			<div className="flex gap-2">
				<Button onClick={() => callApi6()}>
					Add product 1 to cart
				</Button>
				<Button onClick={() => callApi7()}>
					Add product 2 to cart
				</Button>
				<Button onClick={() => callApi8()}>
					Remove product 1 to cart
				</Button>
				<Button onClick={() => callApi9()}>
					Remove product 2 to cart
				</Button>
				<Button onClick={() => callApi12()}>
					Get cart
				</Button>
			</div>
			<div className="flex gap-2">
				<Button onClick={() => callApi10()}>Get products</Button>
			</div>
			<div className="flex gap-2">
				<Button onClick={() => callApi11()}>Order</Button>
			</div>
		</div>
	);
}
