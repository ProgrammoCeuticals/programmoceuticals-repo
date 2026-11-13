import { create } from "zustand";

interface WorkspaceState {
  selectedUnitId: string | null;
  selectedSectionId: string | null;
  selectedCouId: string | null;
  expandedSectionIds: Set<string>;

  setSelectedUnit: (id: string | null) => void;
  setSelectedSection: (id: string | null) => void;
  setSelectedCou: (id: string | null) => void;
  toggleSection: (id: string) => void;
  expandSection: (id: string) => void;
  reset: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  selectedUnitId: null,
  selectedSectionId: null,
  selectedCouId: null,
  expandedSectionIds: new Set(),

  setSelectedUnit: (id) =>
    set({ selectedUnitId: id, selectedSectionId: null, selectedCouId: null }),

  setSelectedSection: (id) =>
    set({ selectedSectionId: id, selectedCouId: null }),

  setSelectedCou: (id) => set({ selectedCouId: id }),

  toggleSection: (id) =>
    set((s) => {
      const next = new Set(s.expandedSectionIds);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return { expandedSectionIds: next };
    }),

  expandSection: (id) =>
    set((s) => ({
      expandedSectionIds: new Set(s.expandedSectionIds).add(id),
    })),

  reset: () =>
    set({
      selectedUnitId: null,
      selectedSectionId: null,
      selectedCouId: null,
      expandedSectionIds: new Set(),
    }),
}));
