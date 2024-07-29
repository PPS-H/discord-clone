"use client";
import {
  Hash,
  Mic,
  Search,
  ShieldAlert,
  ShieldCheck,
  Video,
} from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useEffect, useState } from "react";
import { ChannelType, MemberRole } from "@prisma/client";

interface SearchListData {
  heading: string;
  items: string[];
  type: ChannelType;
}

interface ServerSearchProps {
  data: SearchListData[];
  members: {
    name: string;
    role: MemberRole;
  }[];
}

const ServerSearch = ({ data, members }: ServerSearchProps) => {
  const [open, setOpen] = useState(false);

  const iconMap = {
    [ChannelType.TEXT]: <Hash size={8} />,
    [ChannelType.AUDIO]: <Mic size={8} />,
    [ChannelType.VIDEO]: <Video size={8} />,
  };

  const roleIconMap = {
    [MemberRole.GUEST]: "",
    [MemberRole.MODERATOR]: <ShieldCheck />,
    [MemberRole.ADMIN]: <ShieldAlert size={8} />,
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  return (
    <>
      <div className="border-netural-200 p-1">
        <button
          className="flex items-center justify-between w-full"
          onClick={() => setOpen(true)}
        >
          <div className="flex items-center">
            <Search size={12} color="rgb(161 161 170)" />
            <p className="ml-2 text-zinc-400 text-xs">Search...</p>
          </div>
          <div className="text-xs dark:bg-gray-800 px-1">
            <kbd>
              <span className="text-[9px]">⌘</span>+k
            </kbd>
          </div>
        </button>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {data.map((item, index) => {
            return (
              <div key={index}>
                <CommandGroup heading={item.heading}>
                  {item.items.map((channelName: string) => (
                    <CommandItem>
                      {iconMap[item.type]}
                      {channelName}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
              </div>
            );
          })}
          <CommandGroup heading="Server Members">
            {members.map((member, index) => (
              <CommandItem key={index}>
                {member.name}
                {roleIconMap[member.role]}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default ServerSearch;
