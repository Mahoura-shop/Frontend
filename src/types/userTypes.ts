interface UserState {
	username?: string;
	accessToken?: string;
	refreshToken?: string;
	firstName?: string;
	lastName?: string;
	isAdmin?: boolean;
	userType?: string;
	_hasHydrated?: boolean;
	setUsername: (username: string) => void;
	setAccessToken: (accessToken: string) => void;
	setRefreshToken: (refreshToken: string) => void;
	setFirstName: (firstName: string) => void;
	setLastName: (lastName: string) => void;
	setIsAdmin: (value: boolean) => void;
	setUserType: (type: string) => void;
	logout: () => void;
}
