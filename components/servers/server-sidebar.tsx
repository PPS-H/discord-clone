import { db } from "@/lib/db";
import ServerSidebarHeader from "./server-sidebar-header";
import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";
import { ScrollArea } from "../ui/scroll-area";
import ServerSearch from "./server-search";
import ServerChannel from "./server-channel";
import { ChannelType, MemberRole } from "@prisma/client";
import { Separator } from "@radix-ui/react-dropdown-menu";
import ServerMembers from "./server-member";

const ServerSideBar = async ({ serverId }: { serverId: string }) => {
  const user = await initialProfile();

  // console.log("user is user:::", user);

  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: user.id,
        },
      },
    },
    include: {
      channels: true,
      members: {
        include: {
          profile: true,
        },
      },
    },
  });
  if (!server) return redirect("/");

  const member = server.members.find((member) => member.profileId === user.id);

  if (!member) redirect("/");

  const role = member?.role;

  // console.log("server::::", server);
  // console.log("role::::", role);

  const textChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const audioChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const videoChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );

  // console.log("textChannels:::", textChannels);

  const members = server.members.map((member) => ({
    id: member.id,
    name: member.profile.username,
    role: member.role,
    imageUrl: member.profile.imageUrl,
  }));

  return (
    <div className="p-2 dark:bg-[#2B2D31] bg-[#F2F3F5] min-h-screen">
      <ServerSidebarHeader server={server} role={role!} />
      <ScrollArea className="mt-4">
        <ServerSearch
          data={[
            {
              heading: "Text Channels",
              items: textChannels.map((channel) => channel.name),
              type: ChannelType.TEXT,
            },
            {
              heading: "Audio Channels",
              items: audioChannels.map((channel) => channel.name),
              type: ChannelType.AUDIO,
            },
            {
              heading: "Video Channels",
              items: videoChannels.map((channel) => channel.name),
              type: ChannelType.VIDEO,
            },
          ]}
          members={members}
        />

        <Separator className="mt-2 border" />

        <ServerChannel
          role={role!}
          channelType={ChannelType.TEXT}
          channels={textChannels}
          server={server}
        />

        <ServerChannel
          role={role!}
          channelType={ChannelType.AUDIO}
          channels={audioChannels}
          server={server}
        />

        <ServerChannel
          role={role!}
          channelType={ChannelType.VIDEO}
          channels={videoChannels}
          server={server}
        />
        <Separator />
        <ServerMembers loggedInMember={member.id} members={members} server={server} />
      </ScrollArea>
    </div>
  );
};

export default ServerSideBar;
