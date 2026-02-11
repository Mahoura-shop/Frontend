import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useUserStore = create<UserState>()(
	persist(
		(set) => ({
			username: null,

			setUsername: (username: string) =>
				set((prev) => ({ ...prev, username })),
		}),
		{
			name: "profile-storage",
			storage: createJSONStorage(() => sessionStorage),
		}
	)
);

export default useUserStore;
