"use client";
import { useChatQuery } from "@/hooks/use-chat-query";
import { Hash, ServerCrash } from "lucide-react";
import { useState } from "react";

interface ChatMessagesProps {
  name: string;
  apiUrl: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
}

const ChatMessages = ({
  name,
  apiUrl,
  paramKey,
  paramValue,
}: ChatMessagesProps) => {
  const [messages, setMessages] = useState([]);

  const queryKey = `Chat:${paramKey}`;
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({ queryKey, apiUrl, paramKey, paramValue });

  if (status == "error") {
    return (
      <div className="h-full w-full flex flex-col justify-center items-center">
        <ServerCrash size={30} />
        Internal Server error
      </div>
    );
  }

  // if (status == "success") setMessages(data?.pages[0]?.messages);

  console.log("data is :::", data);

  return (
    <div className="h-full w-full">
      {status == "success" && data?.pages[0]?.messages.length == 0 && (
        <div className="h-full w-full flex flex-col justify-end">
          <div className="mx-5 mb-[5rem] space-y-2">
            {paramKey == "channelId" && (
              <div className="bg-zinc-500 w-fit rounded-full p-4">
                <Hash size={40} />
              </div>
            )}
            <div className="text-lg">
              {paramKey == "channelId" ? "Message in #" : "Message"}
              {name}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessages;
