"use client";

import { usePermission } from "@/hooks/usePermission";
import AccessDenied from "./AccessDenied";

export default function PermissionGuard({
	permission,
	children,
}: {
	permission: string;
	children: React.ReactNode;
}) {
	const allowed = usePermission(permission);
	return allowed ? <>{children}</> : <AccessDenied />;
}
