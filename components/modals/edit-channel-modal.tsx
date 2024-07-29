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
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import useModal from "@/hooks/useModal";
import { ChannelType } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const formSchema = z.object({
  channelName: z
    .string()
    .min(1, { message: "Channel name cannot be empty" })
    .refine((name) => name.toLowerCase() !== "general", {
      message: "Channel name cannot be 'general'.",
    }),
  channelType: z.string().min(1, { message: "Channel type cannot be empty" }),
});

const EditChannelModal = () => {
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
      const response = await axios.patch(`/api/channel/${data?.channelId}`, {
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
    <Dialog open={type === "editChannel" && isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black">
        <DialogHeader>
          <DialogTitle className="text-center font-bold text-xl">
            Edit Channel
          </DialogTitle>
          <DialogDescription className="text-center">
            Edit your channel name.
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
                          disabled={isLoading}
                          defaultValue={data?.channelType}
                        >
                          <SelectTrigger className="text-black bg-zinc-300/50  border-0 focus:visible:right-0 focus:visible:ring-offset-0">
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
                Edit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditChannelModal;
