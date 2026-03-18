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
		// const token = getTokenFromStore();
		// if (token) config.headers.Authorization = `Bearer ${token}`;
		return config;
	},
	(error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
	(response: AxiosResponse) => response,
	(error) => {
		// console.error(error);
		return Promise.reject(error);
	}
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
		// throw error;
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
		// throw error;
	}
};

// ✅ POST image/form-data
export const postImageData = async ({ endPoint, data }: PostParams) => {
	try {
		const response: AxiosResponse = await apiClient.post(endPoint, data, {
			headers: { "Content-Type": "multipart/form-data" },
		});
		return response.data;
	} catch (error) {
		console.log("error in postImageData", (error as any).response?.data);
		// throw error;
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
		// throw error;
	}
};

// ✅ PUT
export const putData = async ({ endPoint, data }: PutParams) => {
	try {
		const response: AxiosResponse = await apiClient.put(endPoint, data);
		return response.data;
	} catch (error) {
		console.log("error in putData", (error as any).response?.data);
		// throw error;
	}
};

export const putImageData = async ({ endPoint, data }: PutParams) => {
	try {
		const response: AxiosResponse = await apiClient.put(endPoint, data, {
			headers: { "Content-Type": "multipart/form-data" },
		});
		return response.data;
	} catch (error) {
		console.log("error in putImageData", (error as any).response?.data);
		// throw error;
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
		// throw error;
	}
};
