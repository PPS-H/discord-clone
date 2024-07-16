import { Server } from "@prisma/client";
import { create } from "zustand";

export type ModalType = "createServer" | "invite";
export type ModalData = {
  server?: Server;
};

interface useModalProps {
  type: ModalType | null;
  isOpen: boolean;
  data?: ModalData;
  onOpen: (type: ModalType, data: ModalData) => void;
  onClose: () => void;
}

const useModal = create<useModalProps>((set) => ({
  type: null,
  isOpen: false,
  data: {},
  onOpen: (type, data = {}) => set({ type, isOpen: true, data }),
  onClose: () => set({ type: null, isOpen: false, data: {} }),
}));

export default useModal;
