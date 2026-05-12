'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useUserStore from '@/store/userStore/userStore';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
	const { accessToken, _hasHydrated } = useUserStore();
	const router = useRouter();

	useEffect(() => {
		if (!_hasHydrated) return;
		if (!accessToken) {
			router.replace('/signin');
		}
	}, [accessToken, _hasHydrated, router]);

	if (!_hasHydrated) return null;
	if (!accessToken) return null;

	return <>{children}</>;
}
