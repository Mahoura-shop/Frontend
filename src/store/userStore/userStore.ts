import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useUserStore = create<UserState>()(
	persist(
		(set) => ({
			username: undefined,
			accessToken: undefined,
			refreshToken: undefined,
			firstName: undefined,
			lastName: undefined,

			setUsername: (username: string) =>
				set((prev) => ({ ...prev, username })),
			setAccessToken: (accessToken: string) =>
				set((prev) => ({ ...prev, accessToken })),
			setRefreshToken: (refreshToken: string) =>
				set((prev) => ({ ...prev, refreshToken })),
			setFirstName: (firstName: string) =>
				set((prev) => ({ ...prev, firstName })),
			setLastName: (lastName: string) =>
				set((prev) => ({ ...prev, lastName })),
			logout: () =>
				set(() => ({
					username: undefined,
					accessToken: undefined,
					refreshToken: undefined,
					firstName: undefined,
					lastName: undefined,
				})),
		}),
		{
			name: "user-storage",
			storage: createJSONStorage(() => localStorage),
		},
	),
);

export default useUserStore;
