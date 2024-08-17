"use client";
import { useChatQuery } from "@/hooks/use-chat-query";
import { Hash, Loader2, ServerCrash } from "lucide-react";
import { ElementRef, Fragment, useRef, useState } from "react";
import ChatWelcome from "./chat-welcome";
import MessageItem from "./message-item";
import { Member, Message, Profile } from "@prisma/client";
import moment from "moment-timezone";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useChatScroll } from "@/hooks/use-chat-scroll";

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
  const addKey = `chat:${paramValue}:message`;
  const updateKey = `chat:${paramValue}:message:update`;

  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({ queryKey, apiUrl, paramKey, paramValue });

  useChatSocket({ queryKey, addKey, updateKey });

  useChatScroll({
    chatRef,
    bottomRef,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    loadMore: fetchNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0,
  });

  if (status == "error") {
    return (
      <div className="h-full w-full flex flex-col justify-center items-center">
        <ServerCrash size={30} />
        Internal Server error
      </div>
    );
  }

  console.log("hasNextPage::::", hasNextPage, isFetchingNextPage);

  // if (status == "success") setMessages(data?.pages[0]?.messages);

  console.log("data is :::", data);

  return (
    <div
      ref={chatRef}
      className="flex-1 flex flex-col py-4 overflow-y-auto h-full"
    >
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
              {page?.items?.map((message: MessageType) => (
                <MessageItem
                  key={message.id}
                  messageId={message.id}
                  content={message.content}
                  fileUrl={message.fileUrl}
                  conversationId={
                    paramKey == "conversationId" ? paramValue : null
                  }
                  member={message.member}
                  ownerId={message.memberId}
                  isEdited={message.createdAt != message.updatedAt}
                  isDeleted={message.isDelete}
                  updatedAt={moment(message.createdAt)
                    .tz("Asia/Kolkata")
                    .calendar()}
                />
              ))}
            </Fragment>
          ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;
