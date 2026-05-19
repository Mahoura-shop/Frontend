import useUserStore from "@/store/userStore/userStore";

export function usePermission(permission: string): boolean {
	const { isAdmin, permissions, _hasHydrated } = useUserStore();
	if (!_hasHydrated) return true;
	if (!isAdmin) return false;
	if (!permissions || permissions.length === 0) return true;
	return permissions.includes(permission);
}

export function useHasAnyPermission(perms: string[]): boolean {
	const { isAdmin, permissions, _hasHydrated } = useUserStore();
	if (!_hasHydrated) return true;
	if (!isAdmin) return false;
	if (!permissions || permissions.length === 0) return true;
	return perms.some((p) => permissions.includes(p));
}
