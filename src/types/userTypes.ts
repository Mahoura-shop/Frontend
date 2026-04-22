interface UserState {
	username?: string;
	accessToken?: string;
	setUsername: (username: string) => void;
	setAccessToken: (accessToken: string) => void;
}
