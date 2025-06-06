import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthRedirectStore {
  redirectPath: string | null;
  setRedirectPath: (path: string) => void;
  clearRedirectPath: () => void;
}

export const useAuthRedirectStore = create<AuthRedirectStore>()(
  persist(
    (set) => ({
      redirectPath: null,
      setRedirectPath: (path) => set({ redirectPath: path }),
      clearRedirectPath: () => set({ redirectPath: null }),
    }),
    {
      name: 'auth-redirect-storage', // localStorage key
    },
  ),
);
