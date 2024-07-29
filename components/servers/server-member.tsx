"use client";
import useModal from "@/hooks/useModal";
import { ServerWithChannelsWithMembers } from "@/types";
import { MemberRole } from "@prisma/client";
import { Settings, ShieldAlert, ShieldCheck } from "lucide-react";
import Image from "next/image";

interface ServerMemebersProps {
  id: string;
  name: string;
  imageUrl: string;
  role: MemberRole;
}

const ServerMembers = ({
  members,
  server,
}: {
  members: ServerMemebersProps[];
  server: ServerWithChannelsWithMembers;
}) => {
  const { onOpen } = useModal();
  const iconMap = {
    [MemberRole.GUEST]: "",
    [MemberRole.MODERATOR]: <ShieldCheck className="w-3 h-3 ml-1" />,
    [MemberRole.ADMIN]: <ShieldAlert className="w-3 h-3 ml-1" color="red" />,
  };
  return (
    <div className="mt-4">
      <div className="flex justify-between items-center uppercase text-xs my-2 tracking-wider mb-4">
        Members
        <Settings
          className="w-4 h-4 cursor-pointer"
          onClick={() => onOpen("members", { server })}
        />
      </div>
      {members.map((member) => {
        return (
          <div
            key={member.id}
            className="flex items-center text-[14px] space-x-2"
          >
            <Image
              src={member.imageUrl}
              alt="user-image"
              width={20}
              height={20}
              className="w-[30px] h-[30px] rounded-full"
            />
            <div className="flex items-center">
              <div className="">{member.name}</div>
              <div>{iconMap[member.role]}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ServerMembers;
