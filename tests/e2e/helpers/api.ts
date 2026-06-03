export const E2E_API = process.env.E2E_API_URL;
export const E2E_ADMIN_PHONE = process.env.E2E_ADMIN_PHONE ?? "";
export const E2E_CUSTOMER_PHONE = process.env.E2E_CUSTOMER_PHONE ?? "";

export const apiState = {
	page: null as any,
};

async function getLiveToken(): Promise<string> {
	if (!apiState.page) return "";
	try {
		return await apiState.page.evaluate(() => {
			const rawStorage = localStorage.getItem("user-storage");
			if (!rawStorage) return "";

			try {
				const parsed = JSON.parse(rawStorage);
				return parsed?.state?.accessToken || "";
			} catch (e) {
				return "";
			}
		});
	} catch (err) {
		return "";
	}
}

export async function apiPost(path: string, body: unknown, token?: string) {
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
	};
	const resolvedToken = token ?? (await getLiveToken());
	if (resolvedToken) {
		headers["Authorization"] = `Bearer ${resolvedToken}`;
	}
	const res = await fetch(`${E2E_API}${path}`, {
		method: "POST",
		headers,
		body: JSON.stringify(body),
	});
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`POST ${path} → ${res.status}: ${text}`);
	}
	return res.json();
}

export async function apiGet(path: string, token?: string) {
	const headers: Record<string, string> = {};
	const resolvedToken = token ?? (await getLiveToken());
	if (resolvedToken) {
		headers["Authorization"] = `Bearer ${resolvedToken}`;
	}
	const res = await fetch(`${E2E_API}${path}`, { headers });
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`GET ${path} → ${res.status}: ${text}`);
	}
	return res.json();
}

export async function apiPatch(path: string, body: unknown, token?: string) {
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
	};
	const resolvedToken = token ?? (await getLiveToken());
	if (resolvedToken) {
		headers["Authorization"] = `Bearer ${resolvedToken}`;
	}
	const res = await fetch(`${E2E_API}${path}`, {
		method: "PATCH",
		headers,
		body: JSON.stringify(body),
	});
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`PATCH ${path} → ${res.status}: ${text}`);
	}
	return res.json();
}

export async function apiPut(path: string, body: unknown, token?: string) {
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
	};
	const resolvedToken = token ?? (await getLiveToken());
	if (resolvedToken) {
		headers["Authorization"] = `Bearer ${resolvedToken}`;
	}
	const res = await fetch(`${E2E_API}${path}`, {
		method: "PUT",
		headers,
		body: JSON.stringify(body),
	});
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`PUT ${path} → ${res.status}: ${text}`);
	}
	return res.json();
}

export async function apiDelete(path: string, token?: string) {
	const headers: Record<string, string> = {};
	const resolvedToken = token ?? (await getLiveToken());
	if (resolvedToken) {
		headers["Authorization"] = `Bearer ${resolvedToken}`;
	}
	const res = await fetch(`${E2E_API}${path}`, { method: "DELETE", headers });
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`DELETE ${path} → ${res.status}: ${text}`);
	}
	return res.json();
}
