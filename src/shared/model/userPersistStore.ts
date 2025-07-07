import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { User } from '@/entities/user/user';

interface UserStore {
  user: User | null;
  isLoggedIn: boolean;
  isApproved: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setIsApproved: (isApproved: boolean) => void;
  setUser: (user: User) => void;
  cleanUser: () => void;
}

export const useUserPersistStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      isApproved: false,
      setIsLoggedIn: (isLoggedIn: boolean) => {
        set({ isLoggedIn });
      },
      setIsApproved: (isApproved: boolean) => {
        set({ isApproved });
      },
      setUser: (user: User) => {
        set({ user, isLoggedIn: true, isApproved: user.role === 'STAFF' });
      },
      cleanUser: () => {
        set({ user: null, isLoggedIn: false, isApproved: false });
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

// export const useUserStore = create<UserStore>((set) => ({
//   user: null,
//   isLoggedIn: false,
//   isApproved: false,
//   setIsLoggedIn: (isLoggedIn: boolean) => {
//     set({
//       isLoggedIn
//     })
//   },
//   setIsApproved: (isApproved: boolean) => {
//     set({
//       isApproved
//     })
//   },
//   setUser: (user: User) => {
//     set({
//       user: user,
//       isLoggedIn: true,
//     })
//   },
//   cleanUser: () => {
//     set({
//       user: null,
//       isLoggedIn: false,
//       isApproved: false
//     })
//   }
// }))
