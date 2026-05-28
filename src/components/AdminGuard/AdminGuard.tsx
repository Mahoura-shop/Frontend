'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useUserStore from '@/store/useUserStore';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
	const { accessToken, isAdmin, _hasHydrated } = useUserStore();
	const router = useRouter();

	useEffect(() => {
		if (!_hasHydrated) return;
		if (!accessToken || !isAdmin) {
			router.replace('/signin');
		}
	}, [accessToken, isAdmin, _hasHydrated, router]);

	if (!_hasHydrated) return null;
	if (!accessToken || !isAdmin) return null;

	return <>{children}</>;
}
