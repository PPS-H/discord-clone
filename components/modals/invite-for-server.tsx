"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import FileUpload from "@/components/file-upload";
import axios from "axios";
import useModal from "@/hooks/useModal";
import { initialProfile } from "@/lib/initial-profile";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  serverName: z
    .string()
    .min(2, {
      message: "Server name must be at least 2 characters.",
    })
    .max(50),
  serverImageUrl: z.string(),
});

const InviteModal = () => {
  const router = useRouter();
  const { type, isOpen, onClose } = useModal();

  const handleClose = () => {};

  return (
    <Dialog open={type === "invite" && isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black">
        <DialogHeader>
          <DialogTitle className="text-center font-bold text-xl">
            Customize your server
          </DialogTitle>
          <DialogDescription className="text-center">
            Give your server a personality with a name and image. You can always
            change it later.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModal;
