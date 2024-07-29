"use client";
import { Channel, ChannelType, MemberRole } from "@prisma/client";
import { Edit, Hash, LockIcon, Mic, Plus, Trash, Video } from "lucide-react";
import ToolTip from "../tooltip";
import useModal, { ModalData, ModalType } from "@/hooks/useModal";
import { ServerWithChannelsWithMembers } from "@/types";
import { useRouter } from "next/navigation";

interface ServerChannelProps {
  channelType: ChannelType;
  role: MemberRole;
  channels: Channel[];
  server: ServerWithChannelsWithMembers;
}

const ServerChannel = ({
  role,
  channelType,
  channels,
  server,
}: ServerChannelProps) => {
  const heading = channelType + " Channels";
  const { onOpen } = useModal();
  const iconMap = {
    [ChannelType.TEXT]: <Hash className="w-4 h-4" />,
    [ChannelType.AUDIO]: <Mic className="w-4 h-4" />,
    [ChannelType.VIDEO]: <Video className="w-4 h-4" />,
  };

  const router = useRouter();

  const onClick = (channelId:string) => {
    router.push(`/servers/${server.id}/channels/${channelId}`)
  };
  return (
    <div className="text-zinc-400 mt-3 text-base">
      <div className="flex justify-between items-center uppercase text-xs my-2 tracking-wider">
        {heading}
        <Plus
          className="w-4 h-4 cursor-pointer"
          onClick={() => onOpen("createChannel", { server, channelType })}
        />
      </div>
      {channels.map((channel) => (
        <div
          key={channel.id}
          className="cursor-pointer dark:hover:bg-zinc-700 hover:bg-[#E3E5E8] py-1 px-2 flex items-center justify-between"
        >
          <div className="flex items-center space-x-2">
            <div>{iconMap[channelType]}</div>
            <div onClick={()=>onClick(channel.id)}>{channel.name}</div>
          </div>
          <div className="flex items-center space-x-1">
            {
              <Icons
                channelId={channel.id}
                channelName={channel.name}
                channelType={channel.type}
                onOpen={onOpen}
                server={server}
              />
            }
          </div>
        </div>
      ))}
    </div>
  );
};

const Icons = ({
  channelId,
  channelName,
  channelType,
  onOpen,
  server,
}: {
  channelName: string;
  channelId: string;
  channelType: ChannelType;
  server: ServerWithChannelsWithMembers;
  onOpen: (type: ModalType, data: ModalData) => void;
}) => {
  if (channelName === "general")
    return (
      <ToolTip side="right" content="This channel cann't be edited or deleted">
        <LockIcon className="w-4 h-4" />
      </ToolTip>
    );
  return (
    <>
      <ToolTip side="right" content="Edit Channel">
        <Edit
          className="w-4 h-4"
          onClick={() =>
            onOpen("editChannel", {
              server,
              channelId,
              channelName,
              channelType,
            })
          }
        />
      </ToolTip>
      <ToolTip side="right" content="Delete Channel">
        <Trash
          className="w-4 h-4"
          onClick={() => onOpen("deleteChannel", { server, channelId })}
        />
      </ToolTip>
    </>
  );
};

export default ServerChannel;
