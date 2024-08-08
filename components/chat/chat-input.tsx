"use client";
import { Input } from "@/components/ui/input";
import useModal from "@/hooks/useModal";
import { Laugh, Plus } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import { useParams } from "next/navigation";

interface ChatInputProps {
  type: "channel" | "conversation";
  placeholder: string;
}

const formSchema = z.object({
  message: z.string(),
});

const ChatInput = ({ type, placeholder }: ChatInputProps) => {
  const params = useParams();
  const serverId = params?.serverId;
  const channelId = params?.channelId;

  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });
  const { onOpen } = useModal();
  const [openEmojiPicker, setOpenEmojiPicker] = useState<boolean>(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const message = values.message;
    if (message == "") return;

    try {
      const response = await axios.post(
        `/api/socket/messages?serverId=${serverId}&&channelId=${channelId}`,
        { content: message }
      );

      console.log("response:::",response);
    } catch (error) {}
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="p-2 relative flex items-center bottom-4">
                  <div
                    className="absolute left-5 cursor-pointer"
                    onClick={() => onOpen("messageAttachment")}
                  >
                    <Plus />
                  </div>
                  <Input
                    {...field}
                    type="text"
                    className="px-12 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus:outline-none"
                    placeholder={
                      type == "channel" ? `Message in #${placeholder}` : ""
                    }
                  />
                  <div
                    className="absolute right-5 cursor-pointer"
                    onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                  >
                    <Laugh />
                  </div>
                  <div className="absolute bottom-full mb-2 right-5">
                    <EmojiPicker
                      open={openEmojiPicker}
                      onEmojiClick={(emojiObject: any) => {
                        form.setValue(
                          "message",
                          form.getValues("message") + emojiObject.emoji
                        );
                      }}
                    />
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <Button type="submit">Submit</Button> */}
      </form>
    </Form>
  );
};

export default ChatInput;
