'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useUserStore from '@/store/useUserStore';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
	const { accessToken, _hasHydrated } = useUserStore();
	const router = useRouter();

	useEffect(() => {
		if (!_hasHydrated) return;
		if (!accessToken) {
			router.replace('/signin');
		}
	}, [accessToken, _hasHydrated, router]);

	if (!_hasHydrated) return (
		<div className="min-h-[60vh] flex items-center justify-center">
			<div className="w-8 h-8 rounded-full border-4 border-primary-rose border-t-transparent animate-spin" />
		</div>
	);
	if (!accessToken) return null;

	return <>{children}</>;
}
