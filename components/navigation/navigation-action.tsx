"use client";
import { Plus } from "lucide-react";
import ToolTip from "../tooltip";
import useModal from "@/hooks/useModal";

const NavigationAction = () => {
  const { onOpen } = useModal();
  return (
    <div
      className="flex justify-center w-full"
      onClick={() => {
        console.log("enter here");
        onOpen("createServer",{});
      }}
    >
      <ToolTip side="right" content="Add new server">
        <div className="rounded-full p-2 text-emerald-400 dark:bg-[#313338] bg-white hover:bg-emerald-400 dark:hover:bg-emerald-400 hover:text-white  hover:rounded-xl m-3">
          <Plus />
        </div>
      </ToolTip>
    </div>
  );
};

export default NavigationAction;
