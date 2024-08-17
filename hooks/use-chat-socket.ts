import { useSocket } from "@/components/providers/socket-provider";
import { Member, Profile } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { Message } from "postcss";
import { useEffect } from "react";

interface chatSocketProps {
  queryKey: string;
  addKey: string;
  updateKey: string;
}

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

export const useChatSocket = ({
  queryKey,
  addKey,
  updateKey,
}: chatSocketProps) => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on(addKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData?.pages || oldData?.pages?.length === 0)
          return {
            pages: [{ items: [message] }],
          };

        const newData = [...oldData?.pages];

        console.log("newData[0]:::::", newData[0]);

        newData[0] = {
          ...newData[0],
          items: [message, ...newData[0].items],
        };

        return { ...oldData, pages: newData };
      });
    });

    socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData?.pages || oldData?.pages?.length === 0)
          return oldData;

        const updatedData = oldData?.pages.map((page: any) => {
          const messages = page.items.map((item: any) => {
            if (item.id == message.id) {
              return message;
            } else {
              return item;
            }
          });

          return { ...page, items: messages };
        });

        return { ...oldData, pages: updatedData };
      });
    });

    return () => {
      socket?.off(addKey);
      socket?.off(updateKey);
    };
  }, [socket, queryKey, addKey, updateKey, queryClient]);
};
