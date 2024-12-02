import { create } from "zustand";

interface Plannr {
    id: string;
    name: string;
    logo: string;
}

interface App {
    sidebarActive: boolean;
    setSidebarActive: (value: boolean) => void;
    sidebarHover: boolean;
    setSidebarHover: (value: boolean) => void;
    fixSidebar: boolean;
    setFixSidebar: (value: boolean) => void;
    plannrs: Plannr[];
    setPlannrs: (value: Plannr) => void;
}

const useAppStore = create<App>((set, get) => ({
    sidebarActive: false,
    setSidebarActive: (value) => set({ sidebarActive: value }),
    sidebarHover: false,
    setSidebarHover: (value) => set({ sidebarHover: value }),
    fixSidebar: false,
    setFixSidebar: (value) => set({ fixSidebar: value }),
    plannrs: JSON.parse(localStorage.getItem("plannrs") || "[]"),
    setPlannrs: (value) => set({plannrs: [{...value}]})
}));

export default useAppStore;
