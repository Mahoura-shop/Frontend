import { create } from "zustand"

interface DashboardMenuStore {
	sidebarOpen: boolean
	isAdminView: boolean
	setSidebarOpen: (open: boolean) => void
	toggleAdminView: () => void
	setAdminView: (isAdmin: boolean) => void
}

export const useDashboardMenuStore = create<DashboardMenuStore>((set) => ({
	sidebarOpen: false,
	isAdminView: false,
	setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
	toggleAdminView: () => set((state) => ({ isAdminView: !state.isAdminView })),
	setAdminView: (isAdmin: boolean) => set({ isAdminView: isAdmin }),
}))
