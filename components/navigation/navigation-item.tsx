"use client";
import Image from "next/image";
import ToolTip from "../tooltip";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface NavigationItemProps {
  id: string;
  name: string;
  imageUrl: string;
}

const NavigationItem = ({ id, name, imageUrl }: NavigationItemProps) => {
  const { id: serverId } = useParams();
  const router = useRouter();
  return (
    <div className="flex items-center">
      <div
        className={cn(
          "bg-white w-[3px] rounded-lg",
          serverId === id ? "h-[30px]" : "h-[10px]"
        )}
      ></div>
      <div
        className="flex justify-center w-full my-2"
        onClick={() => {
          console.log("enter here");
          router.push(`/servers/${id}`);
        }}
      >
        <ToolTip side="right" content={name}>
          <Image
            src={imageUrl}
            alt="Server image"
            width={50}
            height={50}
            className="rounded-lg object-cover w-[50px] h-[50px]"
          />
        </ToolTip>
      </div>
    </div>
  );
};

export default NavigationItem;
