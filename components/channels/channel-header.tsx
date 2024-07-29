import { Hash } from "lucide-react";
import MobileToggle from "../mobile-toggle";

const ChannelHeader = ({
  content,
  serverId,
}: {
  content: string;
  serverId: string;
}) => {
  return (
    <div className="w-full border-b-2 border-neutral-800 p-2 flex items-center">
      <div className="mr-2 flex md:hidden w-full">
        <MobileToggle serverId={serverId} />
      </div>
      <Hash className="w-4 h-4" />
      {content}
    </div>
  );
};

export default ChannelHeader;
