"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import useModal from "@/hooks/useModal";
import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import Member from "../members/member";

const ManageMembersModal = () => {
  const { type, isOpen, onClose, onOpen, data } = useModal();
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    onClose();
  };

  const memebers = data?.server?.members;

  return (
    <Dialog open={type === "members" && isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black">
        <DialogHeader>
          <DialogTitle className="text-center font-bold text-xl">
            Manage Members
          </DialogTitle>
        </DialogHeader>
        <ScrollArea>
          {memebers?.map((member) => (
            <Member
              key={member.id}
              id={member.id}
              name={member.profile.username}
              email={member.profile.email}
              imageUrl={member.profile.imageUrl}
              role={member.role}
            />
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ManageMembersModal;
