import { Hash } from "lucide-react";
import MobileToggle from "../mobile-toggle";
import Image from "next/image";

const ChannelHeader = ({
  content,
  serverId,
  type,
  imageUrl,
}: {
  content: string;
  serverId: string;
  type: "conversation" | "channel";
  imageUrl?: string;
}) => {
  return (
    <div className="w-full border-b-2 border-neutral-800 px-2 py-3 flex items-center">
      <div className="flex items-center">
        <div className="mr-2 flex md:hidden">
          <MobileToggle serverId={serverId} />
        </div>
        {type == "channel" && <Hash className="w-4 h-4" />}
        {type == "conversation" && (
          <Image
            src={imageUrl!}
            alt="profile-image"
            width={20}
            height={20}
            className="w-[30px] h-[30px] rounded-full mr-2"
          />
        )}
        {content}
      </div>
    </div>
  );
};

export default ChannelHeader;
