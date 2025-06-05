import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ReadNewsStore {
  readNewsIds: Set<number>;
  markAsRead: (id: number) => void;
  isRead: (id: number) => boolean;
}

export const useReadNewsPersistStore = create<ReadNewsStore>()(
  persist(
    (set, get) => ({
      readNewsIds: new Set<number>(),
      markAsRead: (id: number) =>
        set((state) => {
          if (state.readNewsIds.has(id)) return state;

          const updatedSet = new Set(state.readNewsIds);
          updatedSet.add(id);

          return { readNewsIds: updatedSet };
        }),

      isRead: (id: number) => get().readNewsIds.has(id),
    }),
    {
      name: 'read-news-storage',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const existingValue = JSON.parse(str);
          return {
            ...existingValue,
            state: {
              ...existingValue.state,
              readNewsIds: new Set(existingValue.state.readNewsIds), // Set으로 변환
            },
          };
        },
        setItem: (name, newValue) => {
          const str = JSON.stringify({
            ...newValue,
            state: {
              ...newValue.state,
              readNewsIds: Array.from(newValue.state.readNewsIds), // 직렬화
            },
          });
          localStorage.setItem(name, str);
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    },
  ),
);
