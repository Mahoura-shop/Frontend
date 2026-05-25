// src/apiClient.ts
import axios from "axios";
import type {
	AxiosInstance,
	AxiosResponse,
	InternalAxiosRequestConfig,
} from "axios";
import type {
	DeleteParams,
	GetParams,
	PatchParams,
	PostParams,
	PutParams,
} from "../types/apiTypes";
import CustomToast from "@/components/Custom/CustomToast/CustomToast";

// export const baseURL = "http://192.168.1.115:8080/"; // backend URL
export const baseURL = "http://localhost:8080/"; // backend URL

const apiClient: AxiosInstance = axios.create({
	baseURL,
	timeout: 20000,
	headers: {
		"Content-Type": "application/json",
	},
});

apiClient.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		if (typeof window !== "undefined") {
			const userDataString = localStorage.getItem("user-storage");
			if (userDataString) {
				const userData = JSON.parse(userDataString);
				const accessToken = userData?.state?.accessToken;
				if (accessToken && typeof accessToken === "string") {
					config.headers.Authorization = `Bearer ${accessToken}`;
				}
			}
		}
		return config;
	},
	(error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
	(response: AxiosResponse) => response,
	(error) => {
		if (error?.response?.status === 401 && typeof window !== 'undefined') {
			try {
				const raw = localStorage.getItem('user-storage');
				if (raw) {
					const parsed = JSON.parse(raw);
					parsed.state.accessToken = undefined;
					parsed.state.refreshToken = undefined;
					parsed.state.isAdmin = false;
					localStorage.setItem('user-storage', JSON.stringify(parsed));
				}
			} catch {}
			const isAdminRoute = window.location.pathname.startsWith('/admin');
			window.location.replace(isAdminRoute ? '/admin' : '/signin');
		}
		return Promise.reject(error);
	},
);

// ✅ GET
export const getData = async ({ endPoint, headers, params }: GetParams) => {
	try {
		const response: AxiosResponse = await apiClient.get(endPoint, {
			params,
			headers,
		});
		return response.data;
	} catch (error) {
		console.log("error in getData", (error as any).response?.data);
		if ((error as any).response?.data?.message) {
			CustomToast((error as any).response?.data?.message, "error");
		}
		throw error;
	}
};

// ✅ POST
export const postData = async ({ endPoint, data, headers }: PostParams) => {
	try {
		const response: AxiosResponse = await apiClient.post(endPoint, data, {
			headers,
		});
		return response.data;
	} catch (error) {
		console.log("error in postData", (error as any).response?.data);
		if ((error as any).response?.data?.message) {
			CustomToast((error as any).response?.data?.message, "error");
		}
		throw error;
	}
};

// ✅ POST image/form-data
export const postImageData = async ({ endPoint, data }: PostParams) => {
	try {
		const response: AxiosResponse = await apiClient.post(endPoint, data, {
			headers: { "Content-Type": undefined },
		});
		return response.data;
	} catch (error) {
		console.log("error in postImageData", (error as any).response?.data);
		if ((error as any).response?.data?.message) {
			CustomToast((error as any).response?.data?.message, "error");
		}
		throw error;
	}
};

// ✅ PATCH
export const patchData = async ({ endPoint, data, headers }: PatchParams) => {
	try {
		const response: AxiosResponse = await apiClient.patch(endPoint, data, {
			headers,
		});
		return response.data;
	} catch (error) {
		console.log("error in patchData", (error as any).response?.data);
		if ((error as any).response?.data?.message) {
			CustomToast((error as any).response?.data?.message, "error");
		}
		throw error;
	}
};

// ✅ PUT
export const putData = async ({ endPoint, data }: PutParams) => {
	try {
		const response: AxiosResponse = await apiClient.put(endPoint, data);
		return response.data;
	} catch (error) {
		console.log("error in putData", (error as any).response?.data);
		if ((error as any).response?.data?.message) {
			CustomToast((error as any).response?.data?.message, "error");
		}
		throw error;
	}
};

export const putImageData = async ({ endPoint, data }: PutParams) => {
	try {
		const response: AxiosResponse = await apiClient.put(endPoint, data, {
			headers: { "Content-Type": undefined },
		});
		return response.data;
	} catch (error) {
		console.log("error in putImageData", (error as any).response?.data);
		if ((error as any).response?.data?.message) {
			CustomToast((error as any).response?.data?.message, "error");
		}
		throw error;
	}
};

// ✅ DELETE
export const deleteData = async ({ endPoint, data, headers }: DeleteParams) => {
	try {
		const response: AxiosResponse = await apiClient.delete(endPoint, {
			data,
			headers,
		});
		return response.data;
	} catch (error) {
		console.log("error in deleteData", (error as any).response?.data);
		if ((error as any).response?.data?.message) {
			CustomToast((error as any).response?.data?.message, "error");
		}
		throw error;
	}
};
