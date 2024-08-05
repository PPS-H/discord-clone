import ChannelHeader from "@/components/channels/channel-header";
import { getOrCreateConvesation } from "@/lib/conversation";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";

interface ConversationPageProps {
  params: {
    serverId: string;
    memberId: string;
  };
}

const ConversationPage = async ({ params }: ConversationPageProps) => {
  const user = await initialProfile();

  if (!user) redirect("/");

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
    },
  });

  if (!server) return redirect("/");

  const memberOne = await db.member.findFirst({
    where: {
      profileId: user.id,
      serverId: params.serverId,
    },
  });

  const memberTwo = await db.member.findUnique({
    where: {
      id: params.memberId,
      serverId: params.serverId,
    },
    include: {
      profile: true,
    },
  });

  if (!memberOne || !memberTwo) return redirect("/");

  const conversations = await getOrCreateConvesation(
    memberOne.id,
    memberTwo.id
  );

  return (
    <div>
      <ChannelHeader
        content={memberTwo.profile.username}
        serverId={params.serverId}
        type="conversation"
        imageUrl={memberTwo.profile.imageUrl}
      />
    </div>
  );
};

export default ConversationPage;
