import { ServerWithChannelsWithMembers } from "@/types";
import { create } from "zustand";

export type ModalType =
  | "createServer"
  | "invite"
  | "editServer"
  | "members"
  | "createChannel"
  | "deleteServer";
export type ModalData = {
  server?: ServerWithChannelsWithMembers;
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
