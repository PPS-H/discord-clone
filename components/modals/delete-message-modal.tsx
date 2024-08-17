"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import useModal from "@/hooks/useModal";
import axios from "axios";
import { Button } from "../ui/button";
import { useParams, useRouter } from "next/navigation";

const DeleteMessageModal = () => {
  const { type, isOpen, onClose, data } = useModal();
  const params = useParams();
  const serverId = params?.serverId;
  const router = useRouter();
  const handleClose = () => {
    onClose();
  };

  const handleDeleteMessage = async () => {
    try {
      let url = "";

      if (data?.conversationId) {
        url = `/api/socket/direct-messages/${data?.messageId}?conversationId=${data?.conversationId}`;
      } else {
        url = `/api/socket/messages/${data?.messageId}?serverId=${serverId}&channelId=${data?.channelId}`;
      }
      const response = await axios.delete(url);
      if (response.data.success) {
        onClose();
        router.refresh();
      }
    } catch (error) {
      console.log("Error while deleting message:", error);
    }
  };

  return (
    <Dialog
      open={type === "deleteMessage" && isOpen}
      onOpenChange={handleClose}
    >
      <DialogContent className="bg-white text-black">
        <DialogHeader>
          <DialogTitle className="text-center font-bold text-xl">
            Delete Message
          </DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to delete this message ? This action can't be
            undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-between">
          <Button className="bg-zinc-300 hover:bg-zinc-400" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-indigo-500 hover:bg-indigo-600 text-white"
            onClick={handleDeleteMessage}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMessageModal;
