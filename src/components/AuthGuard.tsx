'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useUserStore from '@/store/userStore/userStore';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
	const { accessToken } = useUserStore();
	const router = useRouter();

	useEffect(() => {
		if (!accessToken) {
			router.replace('/signin');
		}
	}, [accessToken, router]);

	if (!accessToken) return null;

	return <>{children}</>;
}
