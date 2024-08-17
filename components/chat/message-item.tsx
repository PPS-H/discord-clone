import { Member, MemberRole, Profile } from "@prisma/client";
import { Ban, Edit, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import Image from "next/image";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import useModal from "@/hooks/useModal";

interface MessageItemProps {
  messageId: string;
  content: string;
  fileUrl: string | null;
  conversationId?: string | null;
  member: Member & { profile: Profile };
  ownerId: string;
  isEdited: boolean;
  isDeleted: boolean;
  updatedAt: string;
}

const formSchema = z.object({
  content: z.string().min(1, {
    message: "Message must contain atleast one character",
  }),
});

const MessageItem = ({
  messageId,
  content,
  fileUrl,
  conversationId,
  member,
  ownerId,
  isEdited,
  isDeleted,
  updatedAt,
}: MessageItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const params = useParams();
  const { onOpen } = useModal();
  const serverId = params?.serverId;
  const channelId = params?.channelId;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content,
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { content } = values;
    let url = "";
    try {
      if (conversationId) {
        url = `/api/socket/direct-messages/${messageId}?conversationId=${conversationId}`;
      } else {
        url = `/api/socket/messages/${messageId}?serverId=${serverId}&channelId=${channelId}`;
      }
      const response = await axios.patch(url, {
        content,
      });

      if (response.data.success) {
        form.reset();
        setIsEditing(false);
      }
    } catch (error) {
      console.log("Error while updating the current message", error);
    }
  };

  const iconMap = {
    [MemberRole.GUEST]: "",
    [MemberRole.MODERATOR]: <ShieldCheck className="w-3 h-3 ml-1" />,
    [MemberRole.ADMIN]: <ShieldAlert className="w-3 h-3 ml-1" color="red" />,
  };

  const isOwner = member.id == ownerId;
  const isAdmin = MemberRole.ADMIN == member.role;
  const isModerator = MemberRole.MODERATOR == member.role;

  const canDeleteMessage = !isDeleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !isDeleted && isOwner && !fileUrl;

  useEffect(() => {
    const handleEscKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsEditing(false);
      }
    };
    document.addEventListener("keydown", handleEscKeyPress);
    return () => {
      document.removeEventListener("keydown", handleEscKeyPress);
    };
  }, []);
  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="group flex gap-x-2 items-start w-full">
        <div className="flex space-x-2 w-full">
          <Image
            src={member.profile.imageUrl}
            alt={member.profile.username}
            width={20}
            height={20}
            className="w-[30px] h-[30px] rounded-full object-cover"
          ></Image>
          <div className="flex flex-col w-full">
            <div className="flex items-center">
              {member.profile.username}
              {iconMap[member.role]}
              <span className="text-xs text-zinc-600 dark:text-zinc-400 ml-4">
                {updatedAt}
              </span>
            </div>
            {!fileUrl && (
              <div className="flex items-center">
                {!isEditing ? (
                  <div>
                    {isDeleted ? (
                      <span className="flex items-center text-zinc-500 italic">
                        <Ban size={15} />
                        {content}
                      </span>
                    ) : (
                      content
                    )}
                    {isEdited && !isDeleted && (
                      <span className="text-xs text-zinc-600 dark:text-zinc-400 ml-2">
                        (edited)
                      </span>
                    )}
                  </div>
                ) : (
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="w-full flex space-x-2"
                    >
                      <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <div className="w-full">
                              <FormControl>
                                <Input
                                  {...field}
                                  className="w-full bg-transparent border-zinc-400 focus-visible:ring-0 focus:outline-none focus-visible:ring-offset-0"
                                />
                              </FormControl>
                              <FormDescription>
                                Press enter to edit your message or Esc key to
                                cancel.
                              </FormDescription>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="bg-indigo-500 hover:bg-indigo-600 text-white"
                      >
                        Save
                      </Button>
                    </form>
                  </Form>
                )}
              </div>
            )}
            {fileUrl && (
              <div className="mt-2">
                <Image
                  src={fileUrl}
                  alt="message-attachment"
                  width={100}
                  height={100}
                  className="object-cover w-[500px] h-[250px] rounded-xl"
                ></Image>
              </div>
            )}
          </div>
        </div>
      </div>
      {canEditMessage && (
        <div
          className="hidden group-hover:block absolute right-8 top-0 cursor-pointer"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Edit size={14} />
        </div>
      )}
      {canDeleteMessage && (
        <div
          className="hidden group-hover:block absolute right-4 top-0 cursor-pointer"
          onClick={() =>
            onOpen("deleteMessage", {
              conversationId: conversationId as string,
              messageId,
            })
          }
        >
          <Trash size={14} />
        </div>
      )}
    </div>
  );
};

export default MessageItem;
