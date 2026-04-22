import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useUserStore = create<UserState>()(
	persist(
		(set) => ({
			username: undefined,
			accessToken: undefined,

			setUsername: (username: string) =>
				set((prev) => ({ ...prev, username })),
			setAccessToken: (accessToken: string) =>
				set((prev) => ({ ...prev, accessToken })),
		}),
		{
			name: "user-storage",
			storage: createJSONStorage(() => localStorage),
		},
	),
);

export default useUserStore;
