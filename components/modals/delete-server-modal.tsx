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
import { ClipboardCheck, Copy, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { redirect, useRouter } from "next/navigation";

const DeleteServerModal = () => {
  const { type, isOpen, onClose, data } = useModal();
  const router = useRouter();
  const handleClose = () => {
    onClose();
  };

  const id = data?.server?.id;

  const handleDeleteServer = async () => {
    try {
      const response = await axios.delete(`/api/server/${id}`);
      if (response.data.success) {
        onClose();
        router.refresh();
        redirect("/");
      }
    } catch (error) {
      console.log("Error while deleting server:", error);
    }
  };

  return (
    <Dialog open={type === "deleteServer" && isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black">
        <DialogHeader>
          <DialogTitle className="text-center font-bold text-xl">
            Delete server
          </DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to delete this server ? This action can't be
            undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-between">
          <Button className="bg-zinc-300 hover:bg-zinc-400" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-indigo-500 hover:bg-indigo-600 text-white"
            onClick={handleDeleteServer}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteServerModal;
