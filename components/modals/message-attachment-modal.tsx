"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import FileUpload from "@/components/file-upload";
import useModal from "@/hooks/useModal";
import { useRouter } from "next/navigation";
import axios from "axios";

const formSchema = z.object({
  messageAttachment: z.string(),
});

const MessageAttachmentModal = () => {
  const router = useRouter();
  const { type, isOpen, onClose } = useModal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      messageAttachment: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { messageAttachment } = values;

    if (!messageAttachment) {
      onClose();
      return;
    }

    try {
      const response = await axios.patch(`/api/server/`, { messageAttachment });

      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.log("Error while adding message attachment:", error);
    }
  };

  const isLoading = form.formState.isLoading;

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog
      open={type === "messageAttachment" && isOpen}
      onOpenChange={handleClose}
    >
      <DialogContent className="bg-white text-black">
        <DialogHeader>
          <DialogTitle className="text-center font-bold text-xl">
            Send Attachment
          </DialogTitle>
          <DialogDescription className="text-center">
            Share images or pdf's in the chat
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="messageAttachment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attachment</FormLabel>
                  <FormControl>
                    <FileUpload
                      endpoint="imageUploader"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="submit"
                className="bg-indigo-500 text-white hover:bg-indigo-500/90"
                disabled={isLoading}
              >
                Attach
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MessageAttachmentModal;
