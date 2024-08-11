"use client";
import { useChatQuery } from "@/hooks/use-chat-query";
import { Hash, Loader2, ServerCrash } from "lucide-react";
import { Fragment, useState } from "react";
import ChatWelcome from "./chat-welcome";
import MessageItem from "./message-item";
import { Member, Message, Profile } from "@prisma/client";
import moment from "moment-timezone";



interface ChatMessagesProps {
  name: string;
  apiUrl: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
}

type MessageType = Message & {
  member: Member & {
    profile: Profile;
  };
};

const ChatMessages = ({
  name,
  apiUrl,
  paramKey,
  paramValue,
}: ChatMessagesProps) => {

  const queryKey = `chat:${paramValue}`;
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
    <div className="flex-1 flex flex-col py-4 overflow-y-auto h-full">
      {!hasNextPage && <div className="flex-1" />}
      {!hasNextPage && <ChatWelcome name={name} type={paramKey} />}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4" />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition"
            >
              Load previous messages
            </button>
          )}
        </div>
      )}
      <div className="flex flex-col-reverse mt-auto">
        {status == "success" &&
          data?.pages.map((page, i) => (
            <Fragment key={i}>
              {page?.messages.map((message: MessageType) => (
                <MessageItem
                  messageId={message.id}
                  content={message.content}
                  fileUrl={message.fileUrl}
                  member={message.member}
                  ownerId={message.memberId}
                  isEdited={message.createdAt != message.updatedAt}
                  isDeleted={message.isDelete}
                  updatedAt={moment(message.updatedAt)
                    .tz("Asia/Kolkata")
                    .calendar()}
                />
              ))}
            </Fragment>
          ))}
      </div>
    </div>
  );
};

export default ChatMessages;
