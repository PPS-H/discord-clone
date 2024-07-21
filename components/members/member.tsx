"use cleint";
import {
  Shield,
  Check,
  EllipsisVerticalIcon,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MemberRole } from "@prisma/client";
import axios from "axios";
import useModal from "@/hooks/useModal";
import { useRouter } from "next/navigation";

const Member = ({
  id,
  name,
  email,
  imageUrl,
  role,
}: {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
  role: string;
}) => {
  const isAdmin = role === MemberRole.ADMIN;
  const isMod = role === MemberRole.MODERATOR;
  const isGuest = role === MemberRole.GUEST;

  const { onOpen } = useModal();
  const router = useRouter();

  const handleChangeRole = async (id: string, role: MemberRole) => {
    try {
      const response = await axios.patch(`/api/member/${id}`, {
        role,
      });
      console.log(response);
      if (response.data.success) {
        onOpen("members", { server: response.data.server });
        router.refresh();
      }
    } catch (error) {
      console.log("Error while updating memeber role:", error);
    }
  };

  const handleRemoveMember = async (id: string) => {
    try {
      const response = await axios.patch(`/api/member/${id}`, {
        kick: true,
      });
      console.log(response, response.data.success);
      if (response.data.success) {
        console.log("enter ");
        onOpen("members", { server: response.data.server });
        router.refresh();
      }
    } catch (error) {
      console.log("Error while updating memeber role:", error);
    }
  };

  return (
    <div className="flex items-center my-2">
      <div>
        <Image
          src={imageUrl}
          alt="profile-image"
          height={40}
          width={40}
          className="rounded-full"
        />
      </div>

      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col justify-center ml-2">
          <div className="text-base flex items-center">
            {name}
            {isAdmin && <ShieldAlert size={15} color="red" />}
            {isMod && <ShieldCheck size={15} />}
            {isGuest && <Shield size={15} />}
          </div>
          <div className="text-xs text-zinc-500">{email}</div>
        </div>
        <div className="">
          {!isAdmin && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <EllipsisVerticalIcon size={18} />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="left" className="text-base">
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-full">
                    <DropdownMenuItem>Role</DropdownMenuItem>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="left">
                    <DropdownMenuItem
                      className="flex items-center cursor-pointer text-xs"
                      onClick={() => {
                        !isMod && handleChangeRole(id, MemberRole.MODERATOR);
                      }}
                    >
                      {isMod && <Check size={12} />}
                      {MemberRole.MODERATOR}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center cursor-pointer text-xs space-x-2"
                      onClick={() => {
                        !isGuest && handleChangeRole(id, MemberRole.GUEST);
                      }}
                    >
                      {isGuest && <Check size={12} />}
                      {MemberRole.GUEST}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleRemoveMember(id)}>
                    Kick
                  </DropdownMenuItem>
                </DropdownMenu>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
};

export default Member;
