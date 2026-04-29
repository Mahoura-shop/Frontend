interface UserState {
	username?: string;
	accessToken?: string;
	refreshToken?: string;
	firstName?: string;
	lastName?: string;
	setUsername: (username: string) => void;
	setAccessToken: (accessToken: string) => void;
	setRefreshToken: (refreshToken: string) => void;
	setFirstName: (firstName: string) => void;
	setLastName: (lastName: string) => void;
}
