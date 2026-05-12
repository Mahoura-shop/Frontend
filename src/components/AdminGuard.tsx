'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useUserStore from '@/store/userStore/userStore';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
	const { accessToken, isAdmin } = useUserStore();
	const router = useRouter();

	useEffect(() => {
		if (!accessToken || !isAdmin) {
			router.replace('/signin');
		}
	}, [accessToken, isAdmin, router]);

	if (!accessToken || !isAdmin) return null;

	return <>{children}</>;
}
