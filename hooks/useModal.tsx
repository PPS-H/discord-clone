import { ServerWithChannelsWithMembers } from "@/types";
import { ChannelType } from "@prisma/client";
import { create } from "zustand";

export type ModalType =
  | "createServer"
  | "invite"
  | "editServer"
  | "members"
  | "createChannel"
  | "editChannel"
  | "deleteServer"
  | "deleteChannel"
  | "messageAttachment";

export type ModalData = {
  server?: ServerWithChannelsWithMembers;
  channelId?: string;
  channelName?: string;
  channelType?: ChannelType;
};

interface useModalProps {
  type: ModalType | null;
  isOpen: boolean;
  data?: ModalData;
  onOpen: (type: ModalType, data?: ModalData) => void;
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
