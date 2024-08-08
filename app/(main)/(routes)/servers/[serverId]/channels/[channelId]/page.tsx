import ChannelHeader from "@/components/channels/channel-header";
import ChatInput from "@/components/chat/chat-input";
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
    <div className="bg-white dark:bg-[#313338] flex flex-col h-[100vh]">
      <ChannelHeader
        content={channel.name}
        serverId={serverId}
        type="channel"
      />
      <div className="flex-1">Fetch all chats</div>
      <ChatInput type="channel" placeholder={channel.name} />
    </div>
  );
};

export default ChannelIdPage;
