import { Channel, ChannelType, MemberRole } from "@prisma/client";
import { Edit, Hash, LockIcon, Mic, Plus, Trash, Video } from "lucide-react";
import ToolTip from "../tooltip";

interface ServerChannelProps {
  channelType: ChannelType;
  role: MemberRole;
  channels: Channel[];
}

const ServerChannel = ({ role, channelType, channels }: ServerChannelProps) => {
  const heading = channelType + " Channels";
  const iconMap = {
    [ChannelType.TEXT]: <Hash className="w-4 h-4" />,
    [ChannelType.AUDIO]: <Mic className="w-4 h-4" />,
    [ChannelType.VIDEO]: <Video className="w-4 h-4" />,
  };
  return (
    <div className="text-zinc-400 mt-3 text-base">
      <div className="flex justify-between items-center uppercase text-xs my-2 tracking-wider">
        {heading}
        <Plus className="w-4 h-4 cursor-pointer" />
      </div>
      {channels.map((channel) => (
        <div
          key={channel.id}
          className="cursor-pointer hover:bg-zinc-700 py-1 px-2 flex items-center justify-between"
        >
          <div className="flex items-center space-x-2">
            <div>{iconMap[channelType]}</div>
            <div>{channel.name}</div>
          </div>
          <div className="flex items-center space-x-1">
            {<Icons channelName={channel.name} />}
          </div>
        </div>
      ))}
    </div>
  );
};

const Icons = ({ channelName }: { channelName: String }) => {
  if (channelName === "general")
    return (
      <ToolTip side="right" content="This channel cann't be edited or deleted">
        <LockIcon className="w-4 h-4" />
      </ToolTip>
    );
  return (
    <>
      <ToolTip side="right" content="Edit Channel">
        <Edit className="w-4 h-4" />
      </ToolTip>
      <ToolTip side="right" content="Delete Channel">
        <Trash className="w-4 h-4" />
      </ToolTip>
    </>
  );
};

export default ServerChannel;
