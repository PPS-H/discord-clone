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
import { redirect, useRouter } from "next/navigation";

const DeleteChannelModal = () => {
  const { type, isOpen, onClose, data } = useModal();
  const router = useRouter();
  const handleClose = () => {
    onClose();
  };


  const handleDeleteChannel = async () => {
    try {
      const response = await axios.delete(`/api/channel/${data?.channelId}`);
      if (response.data.success) {
        onClose();
        router.refresh();
        redirect("/");
      }
    } catch (error) {
      console.log("Error while deleting channel:", error);
    }
  };

  return (
    <Dialog open={type === "deleteChannel" && isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black">
        <DialogHeader>
          <DialogTitle className="text-center font-bold text-xl">
            Delete channel
          </DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to delete this channel ? This action can't be
            undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-between">
          <Button className="bg-zinc-300 hover:bg-zinc-400" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-indigo-500 hover:bg-indigo-600 text-white"
            onClick={handleDeleteChannel}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteChannelModal;
