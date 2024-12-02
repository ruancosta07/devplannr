import { create } from 'zustand'
interface Invites {
  id: string
  name: string
  plannrId: string
  invitedAt: string
  accepted: boolean
}

interface User {
  id?: string
  name?: string
  email?: string
  avatar?: string
  invites?: Invites[],
  twoStepsAuth?: boolean
}

type Theme = 'dark' | 'light'

interface UserStore {
  signed: boolean
  setSigned: (value: boolean) => void
  user: User
  setUser: (value: User) => void
  loadingData: boolean
  setLoadingData: (value: boolean) => void
  theme: Theme
  setTheme: (value: Theme) => void,
}

const useUserStore = create<UserStore>((set) => ({
  theme:
    (localStorage.getItem('theme') as Theme) || (matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light'),
  setTheme: (value) => set({ theme: value }),
  signed: false,
  setSigned: (value) => set({ signed: value }),
  user: {},
  setUser: (value) => set({ user: value }),
  loadingData: true,
  setLoadingData: (value) => set({ loadingData: value }),
}))

export default useUserStore
