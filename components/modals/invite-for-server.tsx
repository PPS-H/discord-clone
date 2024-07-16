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

const InviteModal = () => {
  const { type, isOpen, onClose, onOpen, data } = useModal();
  const [codeCopied, setCodeCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    onClose();
  };

  const copyInviteCode = () => {
    if (data?.server?.inviteCode && !loading) {
      navigator.clipboard.writeText(
        `${window.location.origin}/invite/${data.server.inviteCode}`
      );

      document.getElementById("inviteCode")?.focus();
      setCodeCopied(true);

      setTimeout(() => {
        setCodeCopied(false);
      }, 1000);
    }
  };

  const regenarateInviteCode = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await axios.patch("/api/server", {
        serverId: data?.server?.id,
      });

      console.log("response:::", response);
      if (response.data.success) {
        setLoading(false);
        onOpen("invite", { server: response.data.server });
      }
    } catch (error) {
      setLoading(false);
      console.log("Error while regenerating invite code of the server", error);
    }
  };

  return (
    <Dialog open={type === "invite" && isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black">
        <DialogHeader>
          <DialogTitle className="text-center font-bold text-xl">
            Invite Code
          </DialogTitle>
          <DialogDescription className="text-center">
            Sent this link to your friends to invite them on your server
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label className="uppercase mb-0 text-zinc-500">Invite code</Label>
          <div className="flex justify-center items-center">
            <Input
              className="bg-white mt-0 outline-none"
              value={data?.server?.inviteCode}
              id="inviteCode"
              disabled={loading}
            />
            {codeCopied ? (
              <ClipboardCheck className="ml-2" />
            ) : (
              <Copy className="ml-2" onClick={copyInviteCode} />
            )}
          </div>
          <div className="flex items-center" onClick={regenarateInviteCode}>
            <p>Regenerate invite code</p>
            <RefreshCcw size={15} className="ml-2" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModal;
