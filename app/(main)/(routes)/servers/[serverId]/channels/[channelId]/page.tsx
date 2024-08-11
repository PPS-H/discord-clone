import ChannelHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";

interface ChannelIdProps {
  params: {
    serverId: string;
    channelId: string;
  };
}
const ChannelIdPage = async ({ params }: ChannelIdProps) => {
  const { serverId, channelId } = params;
  const user = await initialProfile();

  if (!user) return redirect("/");

  const channel = await db.channel.findUnique({
    where: {
      id: channelId,
    },
  });

  if (!channel) return redirect("/");

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col max-h-screen h-[100vh]">
      <ChannelHeader
        content={channel.name}
        serverId={serverId}
        type="channel"
      />
        <ChatMessages
          name={channel.name}
          apiUrl="/api/messages"
          paramKey="channelId"
          paramValue={channelId}
        />
      <ChatInput type="channel" placeholder={channel.name} />
    </div>
  );
};

export default ChannelIdPage;
