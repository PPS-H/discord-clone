"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import FileUpload from "@/components/file-upload";
import axios from "axios";
import useModal from "@/hooks/useModal";
import { useParams, useRouter } from "next/navigation";
import { ChannelType } from "@prisma/client";

const formSchema = z.object({
  channelName: z
    .string()
    .min(1, { message: "Channel name cannot be empty" })
    .refine((name) => name.toLowerCase() !== "general", {
      message: "Channel name cannot be 'general'.",
    }),
  channelType: z.string().min(1, { message: "Channel type cannot be empty" }),
});

const CreateChannelModal = () => {
  const router = useRouter();
  const { type, isOpen, onClose, data } = useModal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      channelName: "",
      channelType: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { channelName, channelType } = values;

    try {
      const response = await axios.post(`/api/channel/`, {
        serverId: data?.server?.id,
        channelName,
        channelType,
      });
      if (response.data.success) {
        form.reset();
        router.refresh();
        onClose();
      }
    } catch (error) {
      console.log("Error while creating server:", error);
    }
  };

  const isLoading = form.formState.isLoading;

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog
      open={type === "createChannel" && isOpen}
      onOpenChange={handleClose}
    >
      <DialogContent className="bg-white text-black">
        <DialogHeader>
          <DialogTitle className="text-center font-bold text-xl">
            Create New Channel
          </DialogTitle>
          <DialogDescription className="text-center">
            Give your channels a personality with a name and type.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="channelName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Channel name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter channel name"
                      {...field}
                      className="text-black bg-zinc-300/50  border-0 focus:visible:right-0 focus:visible:ring-offset-0"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="channelType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Channel type</FormLabel>
                  <FormControl>
                    <Controller
                      name="channelType"
                      control={form.control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isLoading}
                        >
                          <SelectTrigger
                            className="text-black bg-zinc-300/50  border-0 focus:visible:right-0 focus:visible:ring-offset-0"
                          >
                            <SelectValue placeholder="Select channel type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={ChannelType.TEXT}>
                              {ChannelType.TEXT}
                            </SelectItem>
                            <SelectItem value={ChannelType.AUDIO}>
                              {ChannelType.AUDIO}
                            </SelectItem>
                            <SelectItem value={ChannelType.VIDEO}>
                              {ChannelType.VIDEO}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="submit"
                className="bg-indigo-500 text-white hover:bg-indigo-500/90"
                disabled={isLoading}
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannelModal;
