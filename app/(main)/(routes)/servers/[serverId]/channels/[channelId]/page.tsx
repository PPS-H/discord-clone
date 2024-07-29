import ChannelHeader from "@/components/channels/channel-header";
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
    <div className="w-full">
      <ChannelHeader content={channel.name} serverId={serverId} />
    </div>
  );
};

export default ChannelIdPage;
